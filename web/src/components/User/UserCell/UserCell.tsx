import type { FindUserByUid, FindUserByUidVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import User from 'src/components/User/User'

export const QUERY: TypedDocumentNode<FindUserByUid, FindUserByUidVariables> =
  gql`
    query FindUserByUid($uid: String!) {
      user: user(uid: $uid) {
        uid
        first_name
        surname
        email
        role
        font_preference
        creation_timestamp
        last_login
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>User not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindUserByUidVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  user,
}: CellSuccessProps<FindUserByUid, FindUserByUidVariables>) => {
  return <User user={user} />
}
