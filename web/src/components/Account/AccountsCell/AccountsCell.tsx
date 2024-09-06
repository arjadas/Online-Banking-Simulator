import type { FindAccounts, FindAccountsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Accounts from 'src/components/Account/Accounts'

export const QUERY: TypedDocumentNode<FindAccounts, FindAccountsVariables> =
  gql`
    query FindAccounts {
      accounts {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No accounts yet. '}
      <Link to={routes.newAccount()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindAccounts>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  accounts,
}: CellSuccessProps<FindAccounts, FindAccountsVariables>) => {
  return <Accounts accounts={accounts} />
}
