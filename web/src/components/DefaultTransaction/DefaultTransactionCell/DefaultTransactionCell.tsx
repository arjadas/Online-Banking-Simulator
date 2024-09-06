import type {
  FindDefaultTransactionByDefTransactionId,
  FindDefaultTransactionByDefTransactionIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import DefaultTransaction from 'src/components/DefaultTransaction/DefaultTransaction'

export const QUERY: TypedDocumentNode<
  FindDefaultTransactionByDefTransactionId,
  FindDefaultTransactionByDefTransactionIdVariables
> = gql`
  query FindDefaultTransactionByDefTransactionId($def_transaction_id: Int!) {
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>DefaultTransaction not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindDefaultTransactionByDefTransactionIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  defaultTransaction,
}: CellSuccessProps<
  FindDefaultTransactionByDefTransactionId,
  FindDefaultTransactionByDefTransactionIdVariables
>) => {
  return <DefaultTransaction defaultTransaction={defaultTransaction} />
}
