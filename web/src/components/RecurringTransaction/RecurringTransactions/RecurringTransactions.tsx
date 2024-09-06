import type {
  DeleteRecurringTransactionMutation,
  DeleteRecurringTransactionMutationVariables,
  FindRecurringTransactions,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/RecurringTransaction/RecurringTransactionsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_RECURRING_TRANSACTION_MUTATION: TypedDocumentNode<
  DeleteRecurringTransactionMutation,
  DeleteRecurringTransactionMutationVariables
> = gql`
  mutation DeleteRecurringTransactionMutation($recc_transaction_id: Int!) {
    deleteRecurringTransaction(recc_transaction_id: $recc_transaction_id) {
      recc_transaction_id
    }
  }
`

const RecurringTransactionsList = ({
  recurringTransactions,
}: FindRecurringTransactions) => {
  const [deleteRecurringTransaction] = useMutation(
    DELETE_RECURRING_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('RecurringTransaction deleted')
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
    recc_transaction_id: DeleteRecurringTransactionMutationVariables['recc_transaction_id']
  ) => {
    if (
      confirm(
        'Are you sure you want to delete recurringTransaction ' +
          recc_transaction_id +
          '?'
      )
    ) {
      deleteRecurringTransaction({ variables: { recc_transaction_id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Recc transaction id</th>
            <th>Amount</th>
            <th>Sender acc</th>
            <th>Recipient acc</th>
            <th>Sender uid</th>
            <th>Recipient uid</th>
            <th>Recipient address</th>
            <th>Reference</th>
            <th>Description</th>
            <th>Frequency</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {recurringTransactions.map((recurringTransaction) => (
            <tr key={recurringTransaction.recc_transaction_id}>
              <td>{truncate(recurringTransaction.recc_transaction_id)}</td>
              <td>{truncate(recurringTransaction.amount)}</td>
              <td>{truncate(recurringTransaction.sender_acc)}</td>
              <td>{truncate(recurringTransaction.recipient_acc)}</td>
              <td>{truncate(recurringTransaction.sender_uid)}</td>
              <td>{truncate(recurringTransaction.recipient_uid)}</td>
              <td>{truncate(recurringTransaction.recipient_address)}</td>
              <td>{truncate(recurringTransaction.reference)}</td>
              <td>{truncate(recurringTransaction.description)}</td>
              <td>{truncate(recurringTransaction.frequency)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.recurringTransaction({
                      recc_transaction_id:
                        recurringTransaction.recc_transaction_id,
                    })}
                    title={
                      'Show recurringTransaction ' +
                      recurringTransaction.recc_transaction_id +
                      ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editRecurringTransaction({
                      recc_transaction_id:
                        recurringTransaction.recc_transaction_id,
                    })}
                    title={
                      'Edit recurringTransaction ' +
                      recurringTransaction.recc_transaction_id
                    }
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={
                      'Delete recurringTransaction ' +
                      recurringTransaction.recc_transaction_id
                    }
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() =>
                      onDeleteClick(recurringTransaction.recc_transaction_id)
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

export default RecurringTransactionsList
