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
import { truncate } from 'src/lib/formatters'

const DELETE_TRANSACTION_MUTATION: TypedDocumentNode<
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables
> = gql`
  mutation DeleteTransactionMutation($id: Int!) {
    deleteTransaction(id: $id) {
      id
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

  const onDeleteClick = (id: DeleteTransactionMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete transaction ' + id + '?')) {
      deleteTransaction({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Amount</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{truncate(transaction.id)}</td>
              <td>{truncate(transaction.amount)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.transaction({ id: transaction.id })}
                    title={'Show transaction ' + transaction.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTransaction({ id: transaction.id })}
                    title={'Edit transaction ' + transaction.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete transaction ' + transaction.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(transaction.id)}
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
