import type {
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables,
  FindTransactionByTransactionId,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, timeTag } from 'src/lib/formatters'

const DELETE_TRANSACTION_MUTATION: TypedDocumentNode<
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables
> = gql`
  mutation DeleteTransactionMutation($transaction_id: Int!) {
    deleteTransaction(transaction_id: $transaction_id) {
      transaction_id
    }
  }
`

interface Props {
  transaction: NonNullable<FindTransactionByTransactionId['transaction']>
}

const Transaction = ({ transaction }: Props) => {
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION_MUTATION, {
    onCompleted: () => {
      toast.success('Transaction deleted')
      navigate(routes.transactions())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (
    transaction_id: DeleteTransactionMutationVariables['transaction_id']
  ) => {
    if (
      confirm(
        'Are you sure you want to delete transaction ' + transaction_id + '?'
      )
    ) {
      deleteTransaction({ variables: { transaction_id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Transaction {transaction.transaction_id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Transaction id</th>
              <td>{transaction.transaction_id}</td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>{transaction.amount}</td>
            </tr>
            <tr>
              <th>Sender acc</th>
              <td>{transaction.sender_acc}</td>
            </tr>
            <tr>
              <th>Recipient acc</th>
              <td>{transaction.recipient_acc}</td>
            </tr>
            <tr>
              <th>Sender uid</th>
              <td>{transaction.sender_uid}</td>
            </tr>
            <tr>
              <th>Recipient uid</th>
              <td>{transaction.recipient_uid}</td>
            </tr>
            <tr>
              <th>Recipient address</th>
              <td>{transaction.recipient_address}</td>
            </tr>
            <tr>
              <th>Reference</th>
              <td>{transaction.reference}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{transaction.description}</td>
            </tr>
            <tr>
              <th>Timestamp</th>
              <td>{timeTag(transaction.timestamp)}</td>
            </tr>
            <tr>
              <th>Recc transaction id</th>
              <td>{transaction.recc_transaction_id}</td>
            </tr>
            <tr>
              <th>Settled</th>
              <td>{checkboxInputTag(transaction.settled)}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{transaction.type}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTransaction({
            transaction_id: transaction.transaction_id,
          })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(transaction.transaction_id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Transaction
