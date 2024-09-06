import type { Prisma, Account } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AccountCreateArgs>({
  account: {
    one: {
      data: {
        acc_name: 'String',
        uid: 'String',
        short_description: 'String',
        opened_timestamp: '2024-09-06T12:49:04.423Z',
      },
    },
    two: {
      data: {
        acc_name: 'String',
        uid: 'String',
        short_description: 'String',
        opened_timestamp: '2024-09-06T12:49:04.423Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Account, 'account'>
