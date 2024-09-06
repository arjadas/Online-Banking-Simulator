import type { Prisma, Transaction } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TransactionCreateArgs>({
  transaction: {
    one: {
      data: {
        amount: 7992962,
        sender_uid: 'String',
        recipient_uid: 'String',
        recipient_address: 'String',
        reference: 'String',
        timestamp: '2024-09-06T12:49:39.562Z',
        settled: true,
        sender: {
          create: {
            acc_name: 'String',
            uid: 'String',
            short_description: 'String',
            opened_timestamp: '2024-09-06T12:49:39.562Z',
          },
        },
        recipient: {
          create: {
            acc_name: 'String',
            uid: 'String',
            short_description: 'String',
            opened_timestamp: '2024-09-06T12:49:39.562Z',
          },
        },
      },
    },
    two: {
      data: {
        amount: 7179129,
        sender_uid: 'String',
        recipient_uid: 'String',
        recipient_address: 'String',
        reference: 'String',
        timestamp: '2024-09-06T12:49:39.562Z',
        settled: true,
        sender: {
          create: {
            acc_name: 'String',
            uid: 'String',
            short_description: 'String',
            opened_timestamp: '2024-09-06T12:49:39.562Z',
          },
        },
        recipient: {
          create: {
            acc_name: 'String',
            uid: 'String',
            short_description: 'String',
            opened_timestamp: '2024-09-06T12:49:39.562Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Transaction, 'transaction'>
