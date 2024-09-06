import type {
  DeleteNotificationMutation,
  DeleteNotificationMutationVariables,
  FindNotificationByNotificationId,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, timeTag } from 'src/lib/formatters'

const DELETE_NOTIFICATION_MUTATION: TypedDocumentNode<
  DeleteNotificationMutation,
  DeleteNotificationMutationVariables
> = gql`
  mutation DeleteNotificationMutation($notification_id: String!) {
    deleteNotification(notification_id: $notification_id) {
      notification_id
    }
  }
`

interface Props {
  notification: NonNullable<FindNotificationByNotificationId['notification']>
}

const Notification = ({ notification }: Props) => {
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION_MUTATION, {
    onCompleted: () => {
      toast.success('Notification deleted')
      navigate(routes.notifications())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (
    notification_id: DeleteNotificationMutationVariables['notification_id']
  ) => {
    if (
      confirm(
        'Are you sure you want to delete notification ' + notification_id + '?'
      )
    ) {
      deleteNotification({ variables: { notification_id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Notification {notification.notification_id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Notification id</th>
              <td>{notification.notification_id}</td>
            </tr>
            <tr>
              <th>Uid</th>
              <td>{notification.uid}</td>
            </tr>
            <tr>
              <th>Timestamp</th>
              <td>{timeTag(notification.timestamp)}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{notification.type}</td>
            </tr>
            <tr>
              <th>Content</th>
              <td>{notification.content}</td>
            </tr>
            <tr>
              <th>Read</th>
              <td>{checkboxInputTag(notification.read)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editNotification({
            notification_id: notification.notification_id,
          })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(notification.notification_id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Notification
