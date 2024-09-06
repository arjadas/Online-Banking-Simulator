import type { Prisma, UserPrevContact } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserPrevContactCreateArgs>({
  userPrevContact: {
    one: {
      data: {
        contact_acc: 8807987,
        contact_acc_name: 'String',
        contact_uid: 'String',
        contact_description: 'String',
        user: {
          create: {
            uid: 'String',
            first_name: 'String',
            surname: 'String',
            email: 'String',
            creation_timestamp: '2024-09-06T13:04:00.897Z',
          },
        },
      },
    },
    two: {
      data: {
        contact_acc: 4096584,
        contact_acc_name: 'String',
        contact_uid: 'String',
        contact_description: 'String',
        user: {
          create: {
            uid: 'String',
            first_name: 'String',
            surname: 'String',
            email: 'String',
            creation_timestamp: '2024-09-06T13:04:00.897Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<UserPrevContact, 'userPrevContact'>
