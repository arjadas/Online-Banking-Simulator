import type { Transaction } from '@prisma/client'

import {
  transactions,
  transaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from './transactions'
import type { StandardScenario } from './transactions.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('transactions', () => {
  scenario('returns all transactions', async (scenario: StandardScenario) => {
    const result = await transactions()

    expect(result.length).toEqual(Object.keys(scenario.transaction).length)
  })

  scenario(
    'returns a single transaction',
    async (scenario: StandardScenario) => {
      const result = await transaction({
        transaction_id: scenario.transaction.one.transaction_id,
      })

      expect(result).toEqual(scenario.transaction.one)
    }
  )

  scenario('creates a transaction', async (scenario: StandardScenario) => {
    const result = await createTransaction({
      input: {
        amount: 7177384,
        sender_acc: scenario.transaction.two.sender_acc,
        recipient_acc: scenario.transaction.two.recipient_acc,
        sender_uid: 'String',
        recipient_uid: 'String',
        recipient_address: 'String',
        reference: 'String',
        timestamp: '2024-09-06T12:49:39.551Z',
        settled: true,
      },
    })

    expect(result.amount).toEqual(7177384)
    expect(result.sender_acc).toEqual(scenario.transaction.two.sender_acc)
    expect(result.recipient_acc).toEqual(scenario.transaction.two.recipient_acc)
    expect(result.sender_uid).toEqual('String')
    expect(result.recipient_uid).toEqual('String')
    expect(result.recipient_address).toEqual('String')
    expect(result.reference).toEqual('String')
    expect(result.timestamp).toEqual(new Date('2024-09-06T12:49:39.551Z'))
    expect(result.settled).toEqual(true)
  })

  scenario('updates a transaction', async (scenario: StandardScenario) => {
    const original = (await transaction({
      transaction_id: scenario.transaction.one.transaction_id,
    })) as Transaction
    const result = await updateTransaction({
      transaction_id: original.transaction_id,
      input: { amount: 2054468 },
    })

    expect(result.amount).toEqual(2054468)
  })

  scenario('deletes a transaction', async (scenario: StandardScenario) => {
    const original = (await deleteTransaction({
      transaction_id: scenario.transaction.one.transaction_id,
    })) as Transaction
    const result = await transaction({
      transaction_id: original.transaction_id,
    })

    expect(result).toEqual(null)
  })
})
