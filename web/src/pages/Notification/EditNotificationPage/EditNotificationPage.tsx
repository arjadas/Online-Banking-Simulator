import EditNotificationCell from 'src/components/Notification/EditNotificationCell'

type NotificationPageProps = {
  notification_id: string
}

const EditNotificationPage = ({ notification_id }: NotificationPageProps) => {
  return <EditNotificationCell notification_id={notification_id} />
}

export default EditNotificationPage
