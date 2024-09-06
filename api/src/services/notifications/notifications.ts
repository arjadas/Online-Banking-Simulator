import type {
  QueryResolvers,
  MutationResolvers,
  NotificationRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const notifications: QueryResolvers['notifications'] = () => {
  return db.notification.findMany()
}

export const notification: QueryResolvers['notification'] = ({
  notification_id,
}) => {
  return db.notification.findUnique({
    where: { notification_id },
  })
}

export const createNotification: MutationResolvers['createNotification'] = ({
  input,
}) => {
  return db.notification.create({
    data: input,
  })
}

export const updateNotification: MutationResolvers['updateNotification'] = ({
  notification_id,
  input,
}) => {
  return db.notification.update({
    data: input,
    where: { notification_id },
  })
}

export const deleteNotification: MutationResolvers['deleteNotification'] = ({
  notification_id,
}) => {
  return db.notification.delete({
    where: { notification_id },
  })
}

export const Notification: NotificationRelationResolvers = {
  user: (_obj, { root }) => {
    return db.notification
      .findUnique({ where: { notification_id: root?.notification_id } })
      .user()
  },
}
