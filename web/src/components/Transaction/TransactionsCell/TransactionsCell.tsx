import type { FindTransactions, FindTransactionsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Transactions from 'src/components/Transaction/Transactions'

export const QUERY: TypedDocumentNode<
  FindTransactions,
  FindTransactionsVariables
> = gql`
  query FindTransactions {
    transactions {
      id
      amount
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No transactions yet. '}
      <Link to={routes.newTransaction()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindTransactions>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  transactions,
}: CellSuccessProps<FindTransactions, FindTransactionsVariables>) => {
  return <Transactions transactions={transactions} />
}
