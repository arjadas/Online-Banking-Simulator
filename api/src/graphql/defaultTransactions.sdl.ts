export const schema = gql`
  type DefaultTransaction {
    def_transaction_id: Int!
    sender_uid: String!
    recipient_uid: String!
    sender_acc: Int!
    recipient_acc: Int!
    incoming: Boolean!
    amount: Int!
    recipient_address: String!
    reference: String!
    description: String
    frequency: String
  }

  type Query {
    defaultTransactions: [DefaultTransaction!]! @requireAuth
    defaultTransaction(def_transaction_id: Int!): DefaultTransaction
      @requireAuth
  }

  input CreateDefaultTransactionInput {
    sender_uid: String!
    recipient_uid: String!
    sender_acc: Int!
    recipient_acc: Int!
    incoming: Boolean!
    amount: Int!
    recipient_address: String!
    reference: String!
    description: String
    frequency: String
  }

  input UpdateDefaultTransactionInput {
    sender_uid: String
    recipient_uid: String
    sender_acc: Int
    recipient_acc: Int
    incoming: Boolean
    amount: Int
    recipient_address: String
    reference: String
    description: String
    frequency: String
  }

  type Mutation {
    createDefaultTransaction(
      input: CreateDefaultTransactionInput!
    ): DefaultTransaction! @requireAuth
    updateDefaultTransaction(
      def_transaction_id: Int!
      input: UpdateDefaultTransactionInput!
    ): DefaultTransaction! @requireAuth
    deleteDefaultTransaction(def_transaction_id: Int!): DefaultTransaction!
      @requireAuth
  }
`
