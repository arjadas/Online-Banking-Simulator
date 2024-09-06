import type {
  DeleteDefaultTransactionMutation,
  DeleteDefaultTransactionMutationVariables,
  FindDefaultTransactionByDefTransactionId,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag } from 'src/lib/formatters'

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

interface Props {
  defaultTransaction: NonNullable<
    FindDefaultTransactionByDefTransactionId['defaultTransaction']
  >
}

const DefaultTransaction = ({ defaultTransaction }: Props) => {
  const [deleteDefaultTransaction] = useMutation(
    DELETE_DEFAULT_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('DefaultTransaction deleted')
        navigate(routes.defaultTransactions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
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
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            DefaultTransaction {defaultTransaction.def_transaction_id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Def transaction id</th>
              <td>{defaultTransaction.def_transaction_id}</td>
            </tr>
            <tr>
              <th>Sender uid</th>
              <td>{defaultTransaction.sender_uid}</td>
            </tr>
            <tr>
              <th>Recipient uid</th>
              <td>{defaultTransaction.recipient_uid}</td>
            </tr>
            <tr>
              <th>Sender acc</th>
              <td>{defaultTransaction.sender_acc}</td>
            </tr>
            <tr>
              <th>Recipient acc</th>
              <td>{defaultTransaction.recipient_acc}</td>
            </tr>
            <tr>
              <th>Incoming</th>
              <td>{checkboxInputTag(defaultTransaction.incoming)}</td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>{defaultTransaction.amount}</td>
            </tr>
            <tr>
              <th>Recipient address</th>
              <td>{defaultTransaction.recipient_address}</td>
            </tr>
            <tr>
              <th>Reference</th>
              <td>{defaultTransaction.reference}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{defaultTransaction.description}</td>
            </tr>
            <tr>
              <th>Frequency</th>
              <td>{defaultTransaction.frequency}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editDefaultTransaction({
            def_transaction_id: defaultTransaction.def_transaction_id,
          })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(defaultTransaction.def_transaction_id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default DefaultTransaction
