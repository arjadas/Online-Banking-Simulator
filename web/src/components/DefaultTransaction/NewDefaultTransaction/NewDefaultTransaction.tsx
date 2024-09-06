import type {
  CreateDefaultTransactionMutation,
  CreateDefaultTransactionInput,
  CreateDefaultTransactionMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import DefaultTransactionForm from 'src/components/DefaultTransaction/DefaultTransactionForm'

const CREATE_DEFAULT_TRANSACTION_MUTATION: TypedDocumentNode<
  CreateDefaultTransactionMutation,
  CreateDefaultTransactionMutationVariables
> = gql`
  mutation CreateDefaultTransactionMutation(
    $input: CreateDefaultTransactionInput!
  ) {
    createDefaultTransaction(input: $input) {
      def_transaction_id
    }
  }
`

const NewDefaultTransaction = () => {
  const [createDefaultTransaction, { loading, error }] = useMutation(
    CREATE_DEFAULT_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('DefaultTransaction created')
        navigate(routes.defaultTransactions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateDefaultTransactionInput) => {
    createDefaultTransaction({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          New DefaultTransaction
        </h2>
      </header>
      <div className="rw-segment-main">
        <DefaultTransactionForm
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default NewDefaultTransaction
