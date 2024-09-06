import type { Prisma, MockUser } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MockUserCreateArgs>({
  mockUser: {
    one: {
      data: { uid: 'String', creation_timestamp: '2024-09-06T12:51:24.979Z' },
    },
    two: {
      data: { uid: 'String', creation_timestamp: '2024-09-06T12:51:24.979Z' },
    },
  },
})

export type StandardScenario = ScenarioData<MockUser, 'mockUser'>
