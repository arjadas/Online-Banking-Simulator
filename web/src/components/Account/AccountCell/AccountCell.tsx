import type { FindAccountByAcc, FindAccountByAccVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Account from 'src/components/Account/Account'

export const QUERY: TypedDocumentNode<
  FindAccountByAcc,
  FindAccountByAccVariables
> = gql`
  query FindAccountByAcc($acc: Int!) {
    account: account(acc: $acc) {
      acc
      acc_name
      uid
      pay_id
      biller_code
      crn
      short_description
      long_description
      opened_timestamp
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Account not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAccountByAccVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  account,
}: CellSuccessProps<FindAccountByAcc, FindAccountByAccVariables>) => {
  return <Account account={account} />
}
