export const schema = gql`
  type Account {
    acc: Int!
    acc_name: String!
    uid: String!
    pay_id: String
    biller_code: Int
    crn: Int
    short_description: String!
    long_description: String
    opened_timestamp: DateTime!
    sentTransactions: [Transaction]!
    receivedTransactions: [Transaction]!
    sentRecurringTransactions: [RecurringTransaction]!
    receivedRecurringTransactions: [RecurringTransaction]!
  }

  type Query {
    accounts: [Account!]! @requireAuth
    account(acc: Int!): Account @requireAuth
  }

  input CreateAccountInput {
    acc_name: String!
    uid: String!
    pay_id: String
    biller_code: Int
    crn: Int
    short_description: String!
    long_description: String
    opened_timestamp: DateTime!
  }

  input UpdateAccountInput {
    acc_name: String
    uid: String
    pay_id: String
    biller_code: Int
    crn: Int
    short_description: String
    long_description: String
    opened_timestamp: DateTime
  }

  type Mutation {
    createAccount(input: CreateAccountInput!): Account! @requireAuth
    updateAccount(acc: Int!, input: UpdateAccountInput!): Account! @requireAuth
    deleteAccount(acc: Int!): Account! @requireAuth
  }
`
