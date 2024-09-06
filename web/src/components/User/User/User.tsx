import type {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  FindUserByUid,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

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

interface Props {
  user: NonNullable<FindUserByUid['user']>
}

const User = ({ user }: Props) => {
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User deleted')
      navigate(routes.users())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (uid: DeleteUserMutationVariables['uid']) => {
    if (confirm('Are you sure you want to delete user ' + uid + '?')) {
      deleteUser({ variables: { uid } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            User {user.uid} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Uid</th>
              <td>{user.uid}</td>
            </tr>
            <tr>
              <th>First name</th>
              <td>{user.first_name}</td>
            </tr>
            <tr>
              <th>Surname</th>
              <td>{user.surname}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{user.role}</td>
            </tr>
            <tr>
              <th>Font preference</th>
              <td>{user.font_preference}</td>
            </tr>
            <tr>
              <th>Creation timestamp</th>
              <td>{timeTag(user.creation_timestamp)}</td>
            </tr>
            <tr>
              <th>Last login</th>
              <td>{timeTag(user.last_login)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editUser({ uid: user.uid })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(user.uid)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default User
