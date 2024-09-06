import type {
  QueryResolvers,
  MutationResolvers,
  TransactionRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const transactions: QueryResolvers['transactions'] = () => {
  return db.transaction.findMany()
}

export const transaction: QueryResolvers['transaction'] = ({
  transaction_id,
}) => {
  return db.transaction.findUnique({
    where: { transaction_id },
  })
}

export const createTransaction: MutationResolvers['createTransaction'] = ({
  input,
}) => {
  return db.transaction.create({
    data: input,
  })
}

export const updateTransaction: MutationResolvers['updateTransaction'] = ({
  transaction_id,
  input,
}) => {
  return db.transaction.update({
    data: input,
    where: { transaction_id },
  })
}

export const deleteTransaction: MutationResolvers['deleteTransaction'] = ({
  transaction_id,
}) => {
  return db.transaction.delete({
    where: { transaction_id },
  })
}

export const Transaction: TransactionRelationResolvers = {
  sender: (_obj, { root }) => {
    return db.transaction
      .findUnique({ where: { transaction_id: root?.transaction_id } })
      .sender()
  },
  recipient: (_obj, { root }) => {
    return db.transaction
      .findUnique({ where: { transaction_id: root?.transaction_id } })
      .recipient()
  },
  recc_transaction: (_obj, { root }) => {
    return db.transaction
      .findUnique({ where: { transaction_id: root?.transaction_id } })
      .recc_transaction()
  },
}
