import type {
  EditDefaultTransactionByDefTransactionId,
  UpdateDefaultTransactionInput,
  UpdateDefaultTransactionMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import DefaultTransactionForm from 'src/components/DefaultTransaction/DefaultTransactionForm'

export const QUERY: TypedDocumentNode<EditDefaultTransactionByDefTransactionId> = gql`
  query EditDefaultTransactionByDefTransactionId($def_transaction_id: Int!) {
    defaultTransaction: defaultTransaction(
      def_transaction_id: $def_transaction_id
    ) {
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

const UPDATE_DEFAULT_TRANSACTION_MUTATION: TypedDocumentNode<
  EditDefaultTransactionById,
  UpdateDefaultTransactionMutationVariables
> = gql`
  mutation UpdateDefaultTransactionMutation(
    $def_transaction_id: Int!
    $input: UpdateDefaultTransactionInput!
  ) {
    updateDefaultTransaction(
      def_transaction_id: $def_transaction_id
      input: $input
    ) {
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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  defaultTransaction,
}: CellSuccessProps<EditDefaultTransactionByDefTransactionId>) => {
  const [updateDefaultTransaction, { loading, error }] = useMutation(
    UPDATE_DEFAULT_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('DefaultTransaction updated')
        navigate(routes.defaultTransactions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateDefaultTransactionInput,
    id: EditDefaultTransactionByDefTransactionId['defaultTransaction']['id']
  ) => {
    updateDefaultTransaction({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit DefaultTransaction {defaultTransaction?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <DefaultTransactionForm
          defaultTransaction={defaultTransaction}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
