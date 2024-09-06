import type {
  EditNotificationByNotificationId,
  UpdateNotificationInput,
  UpdateNotificationMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import NotificationForm from 'src/components/Notification/NotificationForm'

export const QUERY: TypedDocumentNode<EditNotificationByNotificationId> = gql`
  query EditNotificationByNotificationId($notification_id: String!) {
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

const UPDATE_NOTIFICATION_MUTATION: TypedDocumentNode<
  EditNotificationById,
  UpdateNotificationMutationVariables
> = gql`
  mutation UpdateNotificationMutation(
    $notification_id: String!
    $input: UpdateNotificationInput!
  ) {
    updateNotification(notification_id: $notification_id, input: $input) {
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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  notification,
}: CellSuccessProps<EditNotificationByNotificationId>) => {
  const [updateNotification, { loading, error }] = useMutation(
    UPDATE_NOTIFICATION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Notification updated')
        navigate(routes.notifications())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateNotificationInput,
    id: EditNotificationByNotificationId['notification']['id']
  ) => {
    updateNotification({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Notification {notification?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <NotificationForm
          notification={notification}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
