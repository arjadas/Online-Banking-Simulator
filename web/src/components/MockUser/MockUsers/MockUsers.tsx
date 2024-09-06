import type {
  DeleteMockUserMutation,
  DeleteMockUserMutationVariables,
  FindMockUsers,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/MockUser/MockUsersCell'
import { timeTag, truncate } from 'src/lib/formatters'

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

const MockUsersList = ({ mockUsers }: FindMockUsers) => {
  const [deleteMockUser] = useMutation(DELETE_MOCK_USER_MUTATION, {
    onCompleted: () => {
      toast.success('MockUser deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (uid: DeleteMockUserMutationVariables['uid']) => {
    if (confirm('Are you sure you want to delete mockUser ' + uid + '?')) {
      deleteMockUser({ variables: { uid } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Uid</th>
            <th>First name</th>
            <th>Surname</th>
            <th>Description</th>
            <th>Creation timestamp</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((mockUser) => (
            <tr key={mockUser.uid}>
              <td>{truncate(mockUser.uid)}</td>
              <td>{truncate(mockUser.first_name)}</td>
              <td>{truncate(mockUser.surname)}</td>
              <td>{truncate(mockUser.description)}</td>
              <td>{timeTag(mockUser.creation_timestamp)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.mockUser({ uid: mockUser.uid })}
                    title={'Show mockUser ' + mockUser.uid + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editMockUser({ uid: mockUser.uid })}
                    title={'Edit mockUser ' + mockUser.uid}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete mockUser ' + mockUser.uid}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(mockUser.uid)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MockUsersList
