import type {
  FindRecurringTransactionByReccTransactionId,
  FindRecurringTransactionByReccTransactionIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import RecurringTransaction from 'src/components/RecurringTransaction/RecurringTransaction'

export const QUERY: TypedDocumentNode<
  FindRecurringTransactionByReccTransactionId,
  FindRecurringTransactionByReccTransactionIdVariables
> = gql`
  query FindRecurringTransactionByReccTransactionId(
    $recc_transaction_id: Int!
  ) {
    recurringTransaction: recurringTransaction(
      recc_transaction_id: $recc_transaction_id
    ) {
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

export const Empty = () => <div>RecurringTransaction not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindRecurringTransactionByReccTransactionIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  recurringTransaction,
}: CellSuccessProps<
  FindRecurringTransactionByReccTransactionId,
  FindRecurringTransactionByReccTransactionIdVariables
>) => {
  return <RecurringTransaction recurringTransaction={recurringTransaction} />
}
