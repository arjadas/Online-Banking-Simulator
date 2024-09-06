import type {
  QueryResolvers,
  MutationResolvers,
  RecurringTransactionRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const recurringTransactions: QueryResolvers['recurringTransactions'] =
  () => {
    return db.recurringTransaction.findMany()
  }

export const recurringTransaction: QueryResolvers['recurringTransaction'] = ({
  recc_transaction_id,
}) => {
  return db.recurringTransaction.findUnique({
    where: { recc_transaction_id },
  })
}

export const createRecurringTransaction: MutationResolvers['createRecurringTransaction'] =
  ({ input }) => {
    return db.recurringTransaction.create({
      data: input,
    })
  }

export const updateRecurringTransaction: MutationResolvers['updateRecurringTransaction'] =
  ({ recc_transaction_id, input }) => {
    return db.recurringTransaction.update({
      data: input,
      where: { recc_transaction_id },
    })
  }

export const deleteRecurringTransaction: MutationResolvers['deleteRecurringTransaction'] =
  ({ recc_transaction_id }) => {
    return db.recurringTransaction.delete({
      where: { recc_transaction_id },
    })
  }

export const RecurringTransaction: RecurringTransactionRelationResolvers = {
  sender: (_obj, { root }) => {
    return db.recurringTransaction
      .findUnique({ where: { recc_transaction_id: root?.recc_transaction_id } })
      .sender()
  },
  recipient: (_obj, { root }) => {
    return db.recurringTransaction
      .findUnique({ where: { recc_transaction_id: root?.recc_transaction_id } })
      .recipient()
  },
  transactions: (_obj, { root }) => {
    return db.recurringTransaction
      .findUnique({ where: { recc_transaction_id: root?.recc_transaction_id } })
      .transactions()
  },
}
