import type {
  DeleteDefaultTransactionMutation,
  DeleteDefaultTransactionMutationVariables,
  FindDefaultTransactions,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/DefaultTransaction/DefaultTransactionsCell'
import { checkboxInputTag, truncate } from 'src/lib/formatters'

const DELETE_DEFAULT_TRANSACTION_MUTATION: TypedDocumentNode<
  DeleteDefaultTransactionMutation,
  DeleteDefaultTransactionMutationVariables
> = gql`
  mutation DeleteDefaultTransactionMutation($def_transaction_id: Int!) {
    deleteDefaultTransaction(def_transaction_id: $def_transaction_id) {
      def_transaction_id
    }
  }
`

const DefaultTransactionsList = ({
  defaultTransactions,
}: FindDefaultTransactions) => {
  const [deleteDefaultTransaction] = useMutation(
    DELETE_DEFAULT_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('DefaultTransaction deleted')
      },
      onError: (error) => {
        toast.error(error.message)
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
    }
  )

  const onDeleteClick = (
    def_transaction_id: DeleteDefaultTransactionMutationVariables['def_transaction_id']
  ) => {
    if (
      confirm(
        'Are you sure you want to delete defaultTransaction ' +
          def_transaction_id +
          '?'
      )
    ) {
      deleteDefaultTransaction({ variables: { def_transaction_id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Def transaction id</th>
            <th>Sender uid</th>
            <th>Recipient uid</th>
            <th>Sender acc</th>
            <th>Recipient acc</th>
            <th>Incoming</th>
            <th>Amount</th>
            <th>Recipient address</th>
            <th>Reference</th>
            <th>Description</th>
            <th>Frequency</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {defaultTransactions.map((defaultTransaction) => (
            <tr key={defaultTransaction.def_transaction_id}>
              <td>{truncate(defaultTransaction.def_transaction_id)}</td>
              <td>{truncate(defaultTransaction.sender_uid)}</td>
              <td>{truncate(defaultTransaction.recipient_uid)}</td>
              <td>{truncate(defaultTransaction.sender_acc)}</td>
              <td>{truncate(defaultTransaction.recipient_acc)}</td>
              <td>{checkboxInputTag(defaultTransaction.incoming)}</td>
              <td>{truncate(defaultTransaction.amount)}</td>
              <td>{truncate(defaultTransaction.recipient_address)}</td>
              <td>{truncate(defaultTransaction.reference)}</td>
              <td>{truncate(defaultTransaction.description)}</td>
              <td>{truncate(defaultTransaction.frequency)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.defaultTransaction({
                      def_transaction_id: defaultTransaction.def_transaction_id,
                    })}
                    title={
                      'Show defaultTransaction ' +
                      defaultTransaction.def_transaction_id +
                      ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editDefaultTransaction({
                      def_transaction_id: defaultTransaction.def_transaction_id,
                    })}
                    title={
                      'Edit defaultTransaction ' +
                      defaultTransaction.def_transaction_id
                    }
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={
                      'Delete defaultTransaction ' +
                      defaultTransaction.def_transaction_id
                    }
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() =>
                      onDeleteClick(defaultTransaction.def_transaction_id)
                    }
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DefaultTransactionsList
