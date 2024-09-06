import type {
  DeleteUserPrevContactMutation,
  DeleteUserPrevContactMutationVariables,
  FindUserPrevContacts,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/UserPrevContact/UserPrevContactsCell'
import { truncate } from 'src/lib/formatters'

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

const UserPrevContactsList = ({ userPrevContacts }: FindUserPrevContacts) => {
  const [deleteUserPrevContact] = useMutation(
    DELETE_USER_PREV_CONTACT_MUTATION,
    {
      onCompleted: () => {
        toast.success('UserPrevContact deleted')
      },
      onError: (error) => {
        toast.error(error.message)
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
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
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>User id</th>
            <th>Contact acc</th>
            <th>Contact acc name</th>
            <th>Contact uid</th>
            <th>Contact description</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {userPrevContacts.map((userPrevContact) => (
            <tr key={userPrevContact.user_id}>
              <td>{truncate(userPrevContact.user_id)}</td>
              <td>{truncate(userPrevContact.contact_acc)}</td>
              <td>{truncate(userPrevContact.contact_acc_name)}</td>
              <td>{truncate(userPrevContact.contact_uid)}</td>
              <td>{truncate(userPrevContact.contact_description)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.userPrevContact({
                      user_id: userPrevContact.user_id,
                    })}
                    title={
                      'Show userPrevContact ' +
                      userPrevContact.user_id +
                      ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editUserPrevContact({
                      user_id: userPrevContact.user_id,
                    })}
                    title={'Edit userPrevContact ' + userPrevContact.user_id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete userPrevContact ' + userPrevContact.user_id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(userPrevContact.user_id)}
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

export default UserPrevContactsList
