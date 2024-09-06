import type {
  QueryResolvers,
  MutationResolvers,
  UserPrevContactRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const userPrevContacts: QueryResolvers['userPrevContacts'] = () => {
  return db.userPrevContact.findMany()
}

export const userPrevContact: QueryResolvers['userPrevContact'] = ({
  user_id,
}) => {
  return db.userPrevContact.findUnique({
    where: { user_id },
  })
}

export const createUserPrevContact: MutationResolvers['createUserPrevContact'] =
  ({ input }) => {
    return db.userPrevContact.create({
      data: input,
    })
  }

export const updateUserPrevContact: MutationResolvers['updateUserPrevContact'] =
  ({ user_id, input }) => {
    return db.userPrevContact.update({
      data: input,
      where: { user_id },
    })
  }

export const deleteUserPrevContact: MutationResolvers['deleteUserPrevContact'] =
  ({ user_id }) => {
    return db.userPrevContact.delete({
      where: { user_id },
    })
  }

export const UserPrevContact: UserPrevContactRelationResolvers = {
  user: (_obj, { root }) => {
    return db.userPrevContact
      .findUnique({ where: { user_id: root?.user_id } })
      .user()
  },
}
