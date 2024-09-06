import type {
  FindDefaultTransactions,
  FindDefaultTransactionsVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import DefaultTransactions from 'src/components/DefaultTransaction/DefaultTransactions'

export const QUERY: TypedDocumentNode<
  FindDefaultTransactions,
  FindDefaultTransactionsVariables
> = gql`
  query FindDefaultTransactions {
    defaultTransactions {
      def_transaction_id
      sender_uid
      recipient_uid
      sender_acc
      recipient_acc
      incoming
      amount
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
      {'No defaultTransactions yet. '}
      <Link to={routes.newDefaultTransaction()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({
  error,
}: CellFailureProps<FindDefaultTransactions>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  defaultTransactions,
}: CellSuccessProps<
  FindDefaultTransactions,
  FindDefaultTransactionsVariables
>) => {
  return <DefaultTransactions defaultTransactions={defaultTransactions} />
}
