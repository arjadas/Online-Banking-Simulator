import type {
  QueryResolvers,
  MutationResolvers,
  AccountRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const accounts: QueryResolvers['accounts'] = () => {
  return db.account.findMany()
}

export const account: QueryResolvers['account'] = ({ acc }) => {
  return db.account.findUnique({
    where: { acc },
  })
}

export const createAccount: MutationResolvers['createAccount'] = ({
  input,
}) => {
  return db.account.create({
    data: input,
  })
}

export const updateAccount: MutationResolvers['updateAccount'] = ({
  acc,
  input,
}) => {
  return db.account.update({
    data: input,
    where: { acc },
  })
}

export const deleteAccount: MutationResolvers['deleteAccount'] = ({ acc }) => {
  return db.account.delete({
    where: { acc },
  })
}

export const Account: AccountRelationResolvers = {
  sentTransactions: (_obj, { root }) => {
    return db.account
      .findUnique({ where: { acc: root?.acc } })
      .sentTransactions()
  },
  receivedTransactions: (_obj, { root }) => {
    return db.account
      .findUnique({ where: { acc: root?.acc } })
      .receivedTransactions()
  },
  sentRecurringTransactions: (_obj, { root }) => {
    return db.account
      .findUnique({ where: { acc: root?.acc } })
      .sentRecurringTransactions()
  },
  receivedRecurringTransactions: (_obj, { root }) => {
    return db.account
      .findUnique({ where: { acc: root?.acc } })
      .receivedRecurringTransactions()
  },
}
