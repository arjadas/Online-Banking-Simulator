import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ uid }) => {
  return db.user.findUnique({
    where: { uid },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ uid, input }) => {
  return db.user.update({
    data: input,
    where: { uid },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ uid }) => {
  return db.user.delete({
    where: { uid },
  })
}

export const User: UserRelationResolvers = {
  previous_contacts: (_obj, { root }) => {
    return db.user.findUnique({ where: { uid: root?.uid } }).previous_contacts()
  },
  notifications: (_obj, { root }) => {
    return db.user.findUnique({ where: { uid: root?.uid } }).notifications()
  },
}
