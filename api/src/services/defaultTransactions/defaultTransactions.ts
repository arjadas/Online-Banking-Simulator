import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const defaultTransactions: QueryResolvers['defaultTransactions'] =
  () => {
    return db.defaultTransaction.findMany()
  }

export const defaultTransaction: QueryResolvers['defaultTransaction'] = ({
  def_transaction_id,
}) => {
  return db.defaultTransaction.findUnique({
    where: { def_transaction_id },
  })
}

export const createDefaultTransaction: MutationResolvers['createDefaultTransaction'] =
  ({ input }) => {
    return db.defaultTransaction.create({
      data: input,
    })
  }

export const updateDefaultTransaction: MutationResolvers['updateDefaultTransaction'] =
  ({ def_transaction_id, input }) => {
    return db.defaultTransaction.update({
      data: input,
      where: { def_transaction_id },
    })
  }

export const deleteDefaultTransaction: MutationResolvers['deleteDefaultTransaction'] =
  ({ def_transaction_id }) => {
    return db.defaultTransaction.delete({
      where: { def_transaction_id },
    })
  }
