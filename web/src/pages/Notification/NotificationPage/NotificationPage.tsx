import NotificationCell from 'src/components/Notification/NotificationCell'

type NotificationPageProps = {
  notification_id: string
}

const NotificationPage = ({ notification_id }: NotificationPageProps) => {
  return <NotificationCell notification_id={notification_id} />
}

export default NotificationPage
