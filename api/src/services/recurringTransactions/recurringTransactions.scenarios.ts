import type { Prisma, RecurringTransaction } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.RecurringTransactionCreateArgs>({
  recurringTransaction: {
    one: {
      data: {
        amount: 1160240,
        sender_uid: 'String',
        recipient_uid: 'String',
        recipient_address: 'String',
        reference: 'String',
        frequency: 'String',
        sender: {
          create: {
            acc_name: 'String',
            uid: 'String',
            short_description: 'String',
            opened_timestamp: '2024-09-06T12:51:05.911Z',
          },
        },
        recipient: {
          create: {
            acc_name: 'String',
            uid: 'String',
            short_description: 'String',
            opened_timestamp: '2024-09-06T12:51:05.911Z',
          },
        },
      },
    },
    two: {
      data: {
        amount: 1626739,
        sender_uid: 'String',
        recipient_uid: 'String',
        recipient_address: 'String',
        reference: 'String',
        frequency: 'String',
        sender: {
          create: {
            acc_name: 'String',
            uid: 'String',
            short_description: 'String',
            opened_timestamp: '2024-09-06T12:51:05.911Z',
          },
        },
        recipient: {
          create: {
            acc_name: 'String',
            uid: 'String',
            short_description: 'String',
            opened_timestamp: '2024-09-06T12:51:05.911Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  RecurringTransaction,
  'recurringTransaction'
>
