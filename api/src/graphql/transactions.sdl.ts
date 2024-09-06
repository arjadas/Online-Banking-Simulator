export const schema = gql`
  type Transaction {
    transaction_id: Int!
    amount: Int!
    sender_acc: Int!
    recipient_acc: Int!
    sender_uid: String!
    recipient_uid: String!
    recipient_address: String!
    reference: String!
    description: String
    timestamp: DateTime!
    recc_transaction_id: Int
    settled: Boolean!
    type: String!
    sender: Account!
    recipient: Account!
    recc_transaction: RecurringTransaction
  }

  type Query {
    transactions: [Transaction!]! @requireAuth
    transaction(transaction_id: Int!): Transaction @requireAuth
  }

  input CreateTransactionInput {
    amount: Int!
    sender_acc: Int!
    recipient_acc: Int!
    sender_uid: String!
    recipient_uid: String!
    recipient_address: String!
    reference: String!
    description: String
    timestamp: DateTime!
    recc_transaction_id: Int
    settled: Boolean!
    type: String!
  }

  input UpdateTransactionInput {
    amount: Int
    sender_acc: Int
    recipient_acc: Int
    sender_uid: String
    recipient_uid: String
    recipient_address: String
    reference: String
    description: String
    timestamp: DateTime
    recc_transaction_id: Int
    settled: Boolean
    type: String
  }

  type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction! @requireAuth
    updateTransaction(
      transaction_id: Int!
      input: UpdateTransactionInput!
    ): Transaction! @requireAuth
    deleteTransaction(transaction_id: Int!): Transaction! @requireAuth
  }
`
