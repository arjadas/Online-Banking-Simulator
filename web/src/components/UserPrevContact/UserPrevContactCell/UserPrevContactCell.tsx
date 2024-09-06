import type {
  FindUserPrevContactByUserId,
  FindUserPrevContactByUserIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import UserPrevContact from 'src/components/UserPrevContact/UserPrevContact'

export const QUERY: TypedDocumentNode<
  FindUserPrevContactByUserId,
  FindUserPrevContactByUserIdVariables
> = gql`
  query FindUserPrevContactByUserId($user_id: String!) {
    userPrevContact: userPrevContact(user_id: $user_id) {
      user_id
      contact_acc
      contact_acc_name
      contact_uid
      contact_description
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>UserPrevContact not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindUserPrevContactByUserIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  userPrevContact,
}: CellSuccessProps<
  FindUserPrevContactByUserId,
  FindUserPrevContactByUserIdVariables
>) => {
  return <UserPrevContact userPrevContact={userPrevContact} />
}
