import type { Prisma, DefaultTransaction } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DefaultTransactionCreateArgs>({
  defaultTransaction: {
    one: {
      data: {
        sender_uid: 'String',
        recipient_uid: 'String',
        sender_acc: 7727421,
        recipient_acc: 5908410,
        incoming: true,
        amount: 3306848,
        recipient_address: 'String',
        reference: 'String',
      },
    },
    two: {
      data: {
        sender_uid: 'String',
        recipient_uid: 'String',
        sender_acc: 3832833,
        recipient_acc: 3622940,
        incoming: true,
        amount: 9088143,
        recipient_address: 'String',
        reference: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  DefaultTransaction,
  'defaultTransaction'
>
