import type { RecurringTransaction } from '@prisma/client'

import {
  recurringTransactions,
  recurringTransaction,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
} from './recurringTransactions'
import type { StandardScenario } from './recurringTransactions.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('recurringTransactions', () => {
  scenario(
    'returns all recurringTransactions',
    async (scenario: StandardScenario) => {
      const result = await recurringTransactions()

      expect(result.length).toEqual(
        Object.keys(scenario.recurringTransaction).length
      )
    }
  )

  scenario(
    'returns a single recurringTransaction',
    async (scenario: StandardScenario) => {
      const result = await recurringTransaction({
        recc_transaction_id:
          scenario.recurringTransaction.one.recc_transaction_id,
      })

      expect(result).toEqual(scenario.recurringTransaction.one)
    }
  )

  scenario(
    'creates a recurringTransaction',
    async (scenario: StandardScenario) => {
      const result = await createRecurringTransaction({
        input: {
          amount: 469270,
          sender_acc: scenario.recurringTransaction.two.sender_acc,
          recipient_acc: scenario.recurringTransaction.two.recipient_acc,
          sender_uid: 'String',
          recipient_uid: 'String',
          recipient_address: 'String',
          reference: 'String',
          frequency: 'String',
        },
      })

      expect(result.amount).toEqual(469270)
      expect(result.sender_acc).toEqual(
        scenario.recurringTransaction.two.sender_acc
      )
      expect(result.recipient_acc).toEqual(
        scenario.recurringTransaction.two.recipient_acc
      )
      expect(result.sender_uid).toEqual('String')
      expect(result.recipient_uid).toEqual('String')
      expect(result.recipient_address).toEqual('String')
      expect(result.reference).toEqual('String')
      expect(result.frequency).toEqual('String')
    }
  )

  scenario(
    'updates a recurringTransaction',
    async (scenario: StandardScenario) => {
      const original = (await recurringTransaction({
        recc_transaction_id:
          scenario.recurringTransaction.one.recc_transaction_id,
      })) as RecurringTransaction
      const result = await updateRecurringTransaction({
        recc_transaction_id: original.recc_transaction_id,
        input: { amount: 5461661 },
      })

      expect(result.amount).toEqual(5461661)
    }
  )

  scenario(
    'deletes a recurringTransaction',
    async (scenario: StandardScenario) => {
      const original = (await deleteRecurringTransaction({
        recc_transaction_id:
          scenario.recurringTransaction.one.recc_transaction_id,
      })) as RecurringTransaction
      const result = await recurringTransaction({
        recc_transaction_id: original.recc_transaction_id,
      })

      expect(result).toEqual(null)
    }
  )
})
