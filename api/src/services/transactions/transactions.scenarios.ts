import type { Prisma, Transaction } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TransactionCreateArgs>({
  transaction: {
    one: { data: { amount: 219426 } },
    two: { data: { amount: 5183592 } },
  },
})

export type StandardScenario = ScenarioData<Transaction, 'transaction'>
