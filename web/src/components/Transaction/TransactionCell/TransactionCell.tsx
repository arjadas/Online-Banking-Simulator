import type {
  FindTransactionByTransactionId,
  FindTransactionByTransactionIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Transaction from 'src/components/Transaction/Transaction'

export const QUERY: TypedDocumentNode<
  FindTransactionByTransactionId,
  FindTransactionByTransactionIdVariables
> = gql`
  query FindTransactionByTransactionId($transaction_id: Int!) {
    transaction: transaction(transaction_id: $transaction_id) {
      transaction_id
      amount
      sender_acc
      recipient_acc
      sender_uid
      recipient_uid
      recipient_address
      reference
      description
      timestamp
      recc_transaction_id
      settled
      type
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Transaction not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindTransactionByTransactionIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  transaction,
}: CellSuccessProps<
  FindTransactionByTransactionId,
  FindTransactionByTransactionIdVariables
>) => {
  return <Transaction transaction={transaction} />
}
