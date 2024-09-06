import type {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  FindUsers,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/User/UsersCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_USER_MUTATION: TypedDocumentNode<
  DeleteUserMutation,
  DeleteUserMutationVariables
> = gql`
  mutation DeleteUserMutation($uid: String!) {
    deleteUser(uid: $uid) {
      uid
    }
  }
`

const UsersList = ({ users }: FindUsers) => {
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User deleted')
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

  const onDeleteClick = (uid: DeleteUserMutationVariables['uid']) => {
    if (confirm('Are you sure you want to delete user ' + uid + '?')) {
      deleteUser({ variables: { uid } })
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
            <th>Email</th>
            <th>Role</th>
            <th>Font preference</th>
            <th>Creation timestamp</th>
            <th>Last login</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{truncate(user.uid)}</td>
              <td>{truncate(user.first_name)}</td>
              <td>{truncate(user.surname)}</td>
              <td>{truncate(user.email)}</td>
              <td>{truncate(user.role)}</td>
              <td>{truncate(user.font_preference)}</td>
              <td>{timeTag(user.creation_timestamp)}</td>
              <td>{timeTag(user.last_login)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.user({ uid: user.uid })}
                    title={'Show user ' + user.uid + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editUser({ uid: user.uid })}
                    title={'Edit user ' + user.uid}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete user ' + user.uid}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(user.uid)}
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

export default UsersList
