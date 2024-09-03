import type {
  FindTransactionById,
  FindTransactionByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Transaction from 'src/components/Transaction/Transaction'

export const QUERY: TypedDocumentNode<
  FindTransactionById,
  FindTransactionByIdVariables
> = gql`
  query FindTransactionById($id: Int!) {
    transaction: transaction(id: $id) {
      id
      amount
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Transaction not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindTransactionByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  transaction,
}: CellSuccessProps<FindTransactionById, FindTransactionByIdVariables>) => {
  return <Transaction transaction={transaction} />
}
