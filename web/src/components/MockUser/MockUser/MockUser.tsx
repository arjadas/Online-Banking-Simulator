import type {
  DeleteMockUserMutation,
  DeleteMockUserMutationVariables,
  FindMockUserByUid,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_MOCK_USER_MUTATION: TypedDocumentNode<
  DeleteMockUserMutation,
  DeleteMockUserMutationVariables
> = gql`
  mutation DeleteMockUserMutation($uid: String!) {
    deleteMockUser(uid: $uid) {
      uid
    }
  }
`

interface Props {
  mockUser: NonNullable<FindMockUserByUid['mockUser']>
}

const MockUser = ({ mockUser }: Props) => {
  const [deleteMockUser] = useMutation(DELETE_MOCK_USER_MUTATION, {
    onCompleted: () => {
      toast.success('MockUser deleted')
      navigate(routes.mockUsers())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (uid: DeleteMockUserMutationVariables['uid']) => {
    if (confirm('Are you sure you want to delete mockUser ' + uid + '?')) {
      deleteMockUser({ variables: { uid } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            MockUser {mockUser.uid} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Uid</th>
              <td>{mockUser.uid}</td>
            </tr>
            <tr>
              <th>First name</th>
              <td>{mockUser.first_name}</td>
            </tr>
            <tr>
              <th>Surname</th>
              <td>{mockUser.surname}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{mockUser.description}</td>
            </tr>
            <tr>
              <th>Creation timestamp</th>
              <td>{timeTag(mockUser.creation_timestamp)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editMockUser({ uid: mockUser.uid })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(mockUser.uid)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default MockUser
