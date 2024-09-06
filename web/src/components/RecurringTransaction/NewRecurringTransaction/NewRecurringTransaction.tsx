import type {
  CreateRecurringTransactionMutation,
  CreateRecurringTransactionInput,
  CreateRecurringTransactionMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import RecurringTransactionForm from 'src/components/RecurringTransaction/RecurringTransactionForm'

const CREATE_RECURRING_TRANSACTION_MUTATION: TypedDocumentNode<
  CreateRecurringTransactionMutation,
  CreateRecurringTransactionMutationVariables
> = gql`
  mutation CreateRecurringTransactionMutation(
    $input: CreateRecurringTransactionInput!
  ) {
    createRecurringTransaction(input: $input) {
      recc_transaction_id
    }
  }
`

const NewRecurringTransaction = () => {
  const [createRecurringTransaction, { loading, error }] = useMutation(
    CREATE_RECURRING_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('RecurringTransaction created')
        navigate(routes.recurringTransactions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateRecurringTransactionInput) => {
    createRecurringTransaction({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          New RecurringTransaction
        </h2>
      </header>
      <div className="rw-segment-main">
        <RecurringTransactionForm
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default NewRecurringTransaction
