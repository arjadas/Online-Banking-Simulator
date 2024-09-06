import type {
  EditMockUserByUid,
  UpdateMockUserInput,
  UpdateMockUserMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import MockUserForm from 'src/components/MockUser/MockUserForm'

export const QUERY: TypedDocumentNode<EditMockUserByUid> = gql`
  query EditMockUserByUid($uid: String!) {
    mockUser: mockUser(uid: $uid) {
      uid
      first_name
      surname
      description
      creation_timestamp
    }
  }
`

const UPDATE_MOCK_USER_MUTATION: TypedDocumentNode<
  EditMockUserById,
  UpdateMockUserMutationVariables
> = gql`
  mutation UpdateMockUserMutation($uid: String!, $input: UpdateMockUserInput!) {
    updateMockUser(uid: $uid, input: $input) {
      uid
      first_name
      surname
      description
      creation_timestamp
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ mockUser }: CellSuccessProps<EditMockUserByUid>) => {
  const [updateMockUser, { loading, error }] = useMutation(
    UPDATE_MOCK_USER_MUTATION,
    {
      onCompleted: () => {
        toast.success('MockUser updated')
        navigate(routes.mockUsers())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateMockUserInput,
    id: EditMockUserByUid['mockUser']['id']
  ) => {
    updateMockUser({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit MockUser {mockUser?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <MockUserForm
          mockUser={mockUser}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
