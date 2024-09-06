import type {
  EditTransactionByTransactionId,
  UpdateTransactionInput,
  UpdateTransactionMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TransactionForm from 'src/components/Transaction/TransactionForm'

export const QUERY: TypedDocumentNode<EditTransactionByTransactionId> = gql`
  query EditTransactionByTransactionId($transaction_id: Int!) {
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

const UPDATE_TRANSACTION_MUTATION: TypedDocumentNode<
  EditTransactionById,
  UpdateTransactionMutationVariables
> = gql`
  mutation UpdateTransactionMutation(
    $transaction_id: Int!
    $input: UpdateTransactionInput!
  ) {
    updateTransaction(transaction_id: $transaction_id, input: $input) {
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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  transaction,
}: CellSuccessProps<EditTransactionByTransactionId>) => {
  const [updateTransaction, { loading, error }] = useMutation(
    UPDATE_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Transaction updated')
        navigate(routes.transactions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateTransactionInput,
    id: EditTransactionByTransactionId['transaction']['id']
  ) => {
    updateTransaction({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Transaction {transaction?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <TransactionForm
          transaction={transaction}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
