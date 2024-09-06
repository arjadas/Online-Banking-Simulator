export const schema = gql`

  type UserPrevContact {
    user_id: String!
    contact_acc: Int!
    contact_acc_name: String!
    contact_uid: String!
    contact_description: String!
    user: User!
  }



  type Query {
    userPrevContacts: [UserPrevContact!]! @requireAuth
    userPrevContact(user_id: [object]!): UserPrevContact @requireAuth
  }


  input CreateUserPrevContactInput {
    contact_acc: Int!
    contact_acc_name: String!
    contact_uid: String!
    contact_description: String!
  }



    input UserPrevContactIdInput {
      user_id: String!
    }



  input UpdateUserPrevContactInput {
    contact_acc: Int
    contact_acc_name: String
    contact_uid: String
    contact_description: String
  }


  type Mutation {
    createUserPrevContact(input: CreateUserPrevContactInput!): UserPrevContact! @requireAuth
    updateUserPrevContact(user_id: [object Object]!, input: UpdateUserPrevContactInput!): UserPrevContact! @requireAuth
    deleteUserPrevContact(user_id: [object Object]!): UserPrevContact! @requireAuth
  }
`
