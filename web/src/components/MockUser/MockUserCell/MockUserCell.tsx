import type {
  FindMockUserByUid,
  FindMockUserByUidVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import MockUser from 'src/components/MockUser/MockUser'

export const QUERY: TypedDocumentNode<
  FindMockUserByUid,
  FindMockUserByUidVariables
> = gql`
  query FindMockUserByUid($uid: String!) {
    mockUser: mockUser(uid: $uid) {
      uid
      first_name
      surname
      description
      creation_timestamp
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>MockUser not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindMockUserByUidVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  mockUser,
}: CellSuccessProps<FindMockUserByUid, FindMockUserByUidVariables>) => {
  return <MockUser mockUser={mockUser} />
}
