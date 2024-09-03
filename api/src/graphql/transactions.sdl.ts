export const schema = gql`
  type Transaction {
    id: Int!
    amount: Int!
  }

  type Query {
    transactions: [Transaction!]! @requireAuth
    transaction(id: Int!): Transaction @requireAuth
  }

  input CreateTransactionInput {
    amount: Int!
  }

  input UpdateTransactionInput {
    amount: Int
  }

  type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction! @requireAuth
    updateTransaction(id: Int!, input: UpdateTransactionInput!): Transaction!
      @requireAuth
    deleteTransaction(id: Int!): Transaction! @requireAuth
  }
`
