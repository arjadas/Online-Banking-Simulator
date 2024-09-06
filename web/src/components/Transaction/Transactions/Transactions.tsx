import type {
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables,
  FindTransactions,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Transaction/TransactionsCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'

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

const TransactionsList = ({ transactions }: FindTransactions) => {
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION_MUTATION, {
    onCompleted: () => {
      toast.success('Transaction deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
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
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Transaction id</th>
            <th>Amount</th>
            <th>Sender acc</th>
            <th>Recipient acc</th>
            <th>Sender uid</th>
            <th>Recipient uid</th>
            <th>Recipient address</th>
            <th>Reference</th>
            <th>Description</th>
            <th>Timestamp</th>
            <th>Recc transaction id</th>
            <th>Settled</th>
            <th>Type</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td>{truncate(transaction.transaction_id)}</td>
              <td>{truncate(transaction.amount)}</td>
              <td>{truncate(transaction.sender_acc)}</td>
              <td>{truncate(transaction.recipient_acc)}</td>
              <td>{truncate(transaction.sender_uid)}</td>
              <td>{truncate(transaction.recipient_uid)}</td>
              <td>{truncate(transaction.recipient_address)}</td>
              <td>{truncate(transaction.reference)}</td>
              <td>{truncate(transaction.description)}</td>
              <td>{timeTag(transaction.timestamp)}</td>
              <td>{truncate(transaction.recc_transaction_id)}</td>
              <td>{checkboxInputTag(transaction.settled)}</td>
              <td>{truncate(transaction.type)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.transaction({
                      transaction_id: transaction.transaction_id,
                    })}
                    title={
                      'Show transaction ' +
                      transaction.transaction_id +
                      ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTransaction({
                      transaction_id: transaction.transaction_id,
                    })}
                    title={'Edit transaction ' + transaction.transaction_id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete transaction ' + transaction.transaction_id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(transaction.transaction_id)}
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

export default TransactionsList
