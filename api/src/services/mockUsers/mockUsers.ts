import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const mockUsers: QueryResolvers['mockUsers'] = () => {
  return db.mockUser.findMany()
}

export const mockUser: QueryResolvers['mockUser'] = ({ uid }) => {
  return db.mockUser.findUnique({
    where: { uid },
  })
}

export const createMockUser: MutationResolvers['createMockUser'] = ({
  input,
}) => {
  return db.mockUser.create({
    data: input,
  })
}

export const updateMockUser: MutationResolvers['updateMockUser'] = ({
  uid,
  input,
}) => {
  return db.mockUser.update({
    data: input,
    where: { uid },
  })
}

export const deleteMockUser: MutationResolvers['deleteMockUser'] = ({
  uid,
}) => {
  return db.mockUser.delete({
    where: { uid },
  })
}
