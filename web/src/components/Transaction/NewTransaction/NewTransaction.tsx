import type {
  CreateTransactionMutation,
  CreateTransactionInput,
  CreateTransactionMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TransactionForm from 'src/components/Transaction/TransactionForm'

const CREATE_TRANSACTION_MUTATION: TypedDocumentNode<
  CreateTransactionMutation,
  CreateTransactionMutationVariables
> = gql`
  mutation CreateTransactionMutation($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`

const NewTransaction = () => {
  const [createTransaction, { loading, error }] = useMutation(
    CREATE_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Transaction created')
        navigate(routes.transactions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateTransactionInput) => {
    createTransaction({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Transaction</h2>
      </header>
      <div className="rw-segment-main">
        <TransactionForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewTransaction
