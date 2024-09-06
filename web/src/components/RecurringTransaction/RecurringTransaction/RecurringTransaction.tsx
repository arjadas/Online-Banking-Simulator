import type {
  DeleteRecurringTransactionMutation,
  DeleteRecurringTransactionMutationVariables,
  FindRecurringTransactionByReccTransactionId,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

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

interface Props {
  recurringTransaction: NonNullable<
    FindRecurringTransactionByReccTransactionId['recurringTransaction']
  >
}

const RecurringTransaction = ({ recurringTransaction }: Props) => {
  const [deleteRecurringTransaction] = useMutation(
    DELETE_RECURRING_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('RecurringTransaction deleted')
        navigate(routes.recurringTransactions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
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
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            RecurringTransaction {recurringTransaction.recc_transaction_id}{' '}
            Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Recc transaction id</th>
              <td>{recurringTransaction.recc_transaction_id}</td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>{recurringTransaction.amount}</td>
            </tr>
            <tr>
              <th>Sender acc</th>
              <td>{recurringTransaction.sender_acc}</td>
            </tr>
            <tr>
              <th>Recipient acc</th>
              <td>{recurringTransaction.recipient_acc}</td>
            </tr>
            <tr>
              <th>Sender uid</th>
              <td>{recurringTransaction.sender_uid}</td>
            </tr>
            <tr>
              <th>Recipient uid</th>
              <td>{recurringTransaction.recipient_uid}</td>
            </tr>
            <tr>
              <th>Recipient address</th>
              <td>{recurringTransaction.recipient_address}</td>
            </tr>
            <tr>
              <th>Reference</th>
              <td>{recurringTransaction.reference}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{recurringTransaction.description}</td>
            </tr>
            <tr>
              <th>Frequency</th>
              <td>{recurringTransaction.frequency}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editRecurringTransaction({
            recc_transaction_id: recurringTransaction.recc_transaction_id,
          })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() =>
            onDeleteClick(recurringTransaction.recc_transaction_id)
          }
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default RecurringTransaction
