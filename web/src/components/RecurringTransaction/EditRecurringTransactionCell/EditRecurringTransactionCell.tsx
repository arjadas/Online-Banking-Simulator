import type {
  EditRecurringTransactionByReccTransactionId,
  UpdateRecurringTransactionInput,
  UpdateRecurringTransactionMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import RecurringTransactionForm from 'src/components/RecurringTransaction/RecurringTransactionForm'

export const QUERY: TypedDocumentNode<EditRecurringTransactionByReccTransactionId> = gql`
  query EditRecurringTransactionByReccTransactionId(
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

const UPDATE_RECURRING_TRANSACTION_MUTATION: TypedDocumentNode<
  EditRecurringTransactionById,
  UpdateRecurringTransactionMutationVariables
> = gql`
  mutation UpdateRecurringTransactionMutation(
    $recc_transaction_id: Int!
    $input: UpdateRecurringTransactionInput!
  ) {
    updateRecurringTransaction(
      recc_transaction_id: $recc_transaction_id
      input: $input
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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  recurringTransaction,
}: CellSuccessProps<EditRecurringTransactionByReccTransactionId>) => {
  const [updateRecurringTransaction, { loading, error }] = useMutation(
    UPDATE_RECURRING_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('RecurringTransaction updated')
        navigate(routes.recurringTransactions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateRecurringTransactionInput,
    id: EditRecurringTransactionByReccTransactionId['recurringTransaction']['id']
  ) => {
    updateRecurringTransaction({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit RecurringTransaction {recurringTransaction?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <RecurringTransactionForm
          recurringTransaction={recurringTransaction}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
