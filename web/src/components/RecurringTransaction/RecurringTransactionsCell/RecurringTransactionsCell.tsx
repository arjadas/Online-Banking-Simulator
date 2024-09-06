import type {
  FindRecurringTransactions,
  FindRecurringTransactionsVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import RecurringTransactions from 'src/components/RecurringTransaction/RecurringTransactions'

export const QUERY: TypedDocumentNode<
  FindRecurringTransactions,
  FindRecurringTransactionsVariables
> = gql`
  query FindRecurringTransactions {
    recurringTransactions {
      recc_transaction_id
      amount
      sender_acc
      recipient_acc
      sender_uid
      recipient_uid
      recipient_address
      reference
      description
      frequency
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No recurringTransactions yet. '}
      <Link to={routes.newRecurringTransaction()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({
  error,
}: CellFailureProps<FindRecurringTransactions>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  recurringTransactions,
}: CellSuccessProps<
  FindRecurringTransactions,
  FindRecurringTransactionsVariables
>) => {
  return <RecurringTransactions recurringTransactions={recurringTransactions} />
}
