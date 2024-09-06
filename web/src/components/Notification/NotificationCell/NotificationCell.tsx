import type {
  FindNotificationByNotificationId,
  FindNotificationByNotificationIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Notification from 'src/components/Notification/Notification'

export const QUERY: TypedDocumentNode<
  FindNotificationByNotificationId,
  FindNotificationByNotificationIdVariables
> = gql`
  query FindNotificationByNotificationId($notification_id: String!) {
    notification: notification(notification_id: $notification_id) {
      notification_id
      uid
      timestamp
      type
      content
      read
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Notification not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindNotificationByNotificationIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  notification,
}: CellSuccessProps<
  FindNotificationByNotificationId,
  FindNotificationByNotificationIdVariables
>) => {
  return <Notification notification={notification} />
}
