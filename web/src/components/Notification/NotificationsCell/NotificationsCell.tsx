import type {
  FindNotifications,
  FindNotificationsVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Notifications from 'src/components/Notification/Notifications'

export const QUERY: TypedDocumentNode<
  FindNotifications,
  FindNotificationsVariables
> = gql`
  query FindNotifications {
    notifications {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No notifications yet. '}
      <Link to={routes.newNotification()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindNotifications>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  notifications,
}: CellSuccessProps<FindNotifications, FindNotificationsVariables>) => {
  return <Notifications notifications={notifications} />
}
