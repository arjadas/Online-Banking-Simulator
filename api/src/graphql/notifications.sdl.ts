export const schema = gql`
  type Notification {
    notification_id: String!
    uid: String!
    timestamp: DateTime!
    type: String!
    content: String!
    read: Boolean!
    user: User!
  }

  type Query {
    notifications: [Notification!]! @requireAuth
    notification(notification_id: String!): Notification @requireAuth
  }

  input CreateNotificationInput {
    uid: String!
    timestamp: DateTime!
    type: String!
    content: String!
    read: Boolean!
  }

  input UpdateNotificationInput {
    uid: String
    timestamp: DateTime
    type: String
    content: String
    read: Boolean
  }

  type Mutation {
    createNotification(input: CreateNotificationInput!): Notification!
      @requireAuth
    updateNotification(
      notification_id: String!
      input: UpdateNotificationInput!
    ): Notification! @requireAuth
    deleteNotification(notification_id: String!): Notification! @requireAuth
  }
`
