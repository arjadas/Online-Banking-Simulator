export const schema = gql`
  type User {
    uid: String!
    first_name: String!
    surname: String!
    email: String!
    role: String!
    font_preference: String
    creation_timestamp: DateTime!
    last_login: DateTime
    previous_contacts: [UserPrevContact]!
    notifications: [Notification]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(uid: String!): User @requireAuth
  }

  input CreateUserInput {
    first_name: String!
    surname: String!
    email: String!
    role: String!
    font_preference: String
    creation_timestamp: DateTime!
    last_login: DateTime
  }

  input UpdateUserInput {
    first_name: String
    surname: String
    email: String
    role: String
    font_preference: String
    creation_timestamp: DateTime
    last_login: DateTime
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(uid: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(uid: String!): User! @requireAuth
  }
`
