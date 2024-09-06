export const schema = gql`
  type RecurringTransaction {
    recc_transaction_id: Int!
    amount: Int!
    sender_acc: Int!
    recipient_acc: Int!
    sender_uid: String!
    recipient_uid: String!
    recipient_address: String!
    reference: String!
    description: String
    frequency: String!
    sender: Account!
    recipient: Account!
    transactions: [Transaction]!
  }

  type Query {
    recurringTransactions: [RecurringTransaction!]! @requireAuth
    recurringTransaction(recc_transaction_id: Int!): RecurringTransaction
      @requireAuth
  }

  input CreateRecurringTransactionInput {
    amount: Int!
    sender_acc: Int!
    recipient_acc: Int!
    sender_uid: String!
    recipient_uid: String!
    recipient_address: String!
    reference: String!
    description: String
    frequency: String!
  }

  input UpdateRecurringTransactionInput {
    amount: Int
    sender_acc: Int
    recipient_acc: Int
    sender_uid: String
    recipient_uid: String
    recipient_address: String
    reference: String
    description: String
    frequency: String
  }

  type Mutation {
    createRecurringTransaction(
      input: CreateRecurringTransactionInput!
    ): RecurringTransaction! @requireAuth
    updateRecurringTransaction(
      recc_transaction_id: Int!
      input: UpdateRecurringTransactionInput!
    ): RecurringTransaction! @requireAuth
    deleteRecurringTransaction(
      recc_transaction_id: Int!
    ): RecurringTransaction! @requireAuth
  }
`
