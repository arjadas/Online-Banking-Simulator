import type {
  DeleteUserPrevContactMutation,
  DeleteUserPrevContactMutationVariables,
  FindUserPrevContactByUserId,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_USER_PREV_CONTACT_MUTATION: TypedDocumentNode<
  DeleteUserPrevContactMutation,
  DeleteUserPrevContactMutationVariables
> = gql`
  mutation DeleteUserPrevContactMutation($user_id: String!) {
    deleteUserPrevContact(user_id: $user_id) {
      user_id
    }
  }
`

interface Props {
  userPrevContact: NonNullable<FindUserPrevContactByUserId['userPrevContact']>
}

const UserPrevContact = ({ userPrevContact }: Props) => {
  const [deleteUserPrevContact] = useMutation(
    DELETE_USER_PREV_CONTACT_MUTATION,
    {
      onCompleted: () => {
        toast.success('UserPrevContact deleted')
        navigate(routes.userPrevContacts())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onDeleteClick = (
    user_id: DeleteUserPrevContactMutationVariables['user_id']
  ) => {
    if (
      confirm(
        'Are you sure you want to delete userPrevContact ' + user_id + '?'
      )
    ) {
      deleteUserPrevContact({ variables: { user_id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            UserPrevContact {userPrevContact.user_id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>User id</th>
              <td>{userPrevContact.user_id}</td>
            </tr>
            <tr>
              <th>Contact acc</th>
              <td>{userPrevContact.contact_acc}</td>
            </tr>
            <tr>
              <th>Contact acc name</th>
              <td>{userPrevContact.contact_acc_name}</td>
            </tr>
            <tr>
              <th>Contact uid</th>
              <td>{userPrevContact.contact_uid}</td>
            </tr>
            <tr>
              <th>Contact description</th>
              <td>{userPrevContact.contact_description}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editUserPrevContact({ user_id: userPrevContact.user_id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(userPrevContact.user_id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default UserPrevContact
