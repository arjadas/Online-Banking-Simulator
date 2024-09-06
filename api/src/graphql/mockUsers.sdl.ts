export const schema = gql`
  type MockUser {
    uid: String!
    first_name: String
    surname: String
    description: String
    creation_timestamp: DateTime!
  }

  type Query {
    mockUsers: [MockUser!]! @requireAuth
    mockUser(uid: String!): MockUser @requireAuth
  }

  input CreateMockUserInput {
    first_name: String
    surname: String
    description: String
    creation_timestamp: DateTime!
  }

  input UpdateMockUserInput {
    first_name: String
    surname: String
    description: String
    creation_timestamp: DateTime
  }

  type Mutation {
    createMockUser(input: CreateMockUserInput!): MockUser! @requireAuth
    updateMockUser(uid: String!, input: UpdateMockUserInput!): MockUser!
      @requireAuth
    deleteMockUser(uid: String!): MockUser! @requireAuth
  }
`
