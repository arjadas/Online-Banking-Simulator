import type {
  DeleteNotificationMutation,
  DeleteNotificationMutationVariables,
  FindNotifications,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Notification/NotificationsCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'

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

const NotificationsList = ({ notifications }: FindNotifications) => {
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION_MUTATION, {
    onCompleted: () => {
      toast.success('Notification deleted')
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
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Notification id</th>
            <th>Uid</th>
            <th>Timestamp</th>
            <th>Type</th>
            <th>Content</th>
            <th>Read</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.notification_id}>
              <td>{truncate(notification.notification_id)}</td>
              <td>{truncate(notification.uid)}</td>
              <td>{timeTag(notification.timestamp)}</td>
              <td>{truncate(notification.type)}</td>
              <td>{truncate(notification.content)}</td>
              <td>{checkboxInputTag(notification.read)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.notification({
                      notification_id: notification.notification_id,
                    })}
                    title={
                      'Show notification ' +
                      notification.notification_id +
                      ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editNotification({
                      notification_id: notification.notification_id,
                    })}
                    title={'Edit notification ' + notification.notification_id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={
                      'Delete notification ' + notification.notification_id
                    }
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(notification.notification_id)}
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

export default NotificationsList
