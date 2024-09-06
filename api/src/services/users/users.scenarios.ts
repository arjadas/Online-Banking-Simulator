import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        uid: 'String',
        first_name: 'String',
        surname: 'String',
        email: 'String',
        creation_timestamp: '2024-09-06T12:53:05.488Z',
      },
    },
    two: {
      data: {
        uid: 'String',
        first_name: 'String',
        surname: 'String',
        email: 'String',
        creation_timestamp: '2024-09-06T12:53:05.488Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
