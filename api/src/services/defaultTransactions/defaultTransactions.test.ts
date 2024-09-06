import type { DefaultTransaction } from '@prisma/client'

import {
  defaultTransactions,
  defaultTransaction,
  createDefaultTransaction,
  updateDefaultTransaction,
  deleteDefaultTransaction,
} from './defaultTransactions'
import type { StandardScenario } from './defaultTransactions.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('defaultTransactions', () => {
  scenario(
    'returns all defaultTransactions',
    async (scenario: StandardScenario) => {
      const result = await defaultTransactions()

      expect(result.length).toEqual(
        Object.keys(scenario.defaultTransaction).length
      )
    }
  )

  scenario(
    'returns a single defaultTransaction',
    async (scenario: StandardScenario) => {
      const result = await defaultTransaction({
        def_transaction_id: scenario.defaultTransaction.one.def_transaction_id,
      })

      expect(result).toEqual(scenario.defaultTransaction.one)
    }
  )

  scenario('creates a defaultTransaction', async () => {
    const result = await createDefaultTransaction({
      input: {
        sender_uid: 'String',
        recipient_uid: 'String',
        sender_acc: 9692635,
        recipient_acc: 5711803,
        incoming: true,
        amount: 3420043,
        recipient_address: 'String',
        reference: 'String',
      },
    })

    expect(result.sender_uid).toEqual('String')
    expect(result.recipient_uid).toEqual('String')
    expect(result.sender_acc).toEqual(9692635)
    expect(result.recipient_acc).toEqual(5711803)
    expect(result.incoming).toEqual(true)
    expect(result.amount).toEqual(3420043)
    expect(result.recipient_address).toEqual('String')
    expect(result.reference).toEqual('String')
  })

  scenario(
    'updates a defaultTransaction',
    async (scenario: StandardScenario) => {
      const original = (await defaultTransaction({
        def_transaction_id: scenario.defaultTransaction.one.def_transaction_id,
      })) as DefaultTransaction
      const result = await updateDefaultTransaction({
        def_transaction_id: original.def_transaction_id,
        input: { sender_uid: 'String2' },
      })

      expect(result.sender_uid).toEqual('String2')
    }
  )

  scenario(
    'deletes a defaultTransaction',
    async (scenario: StandardScenario) => {
      const original = (await deleteDefaultTransaction({
        def_transaction_id: scenario.defaultTransaction.one.def_transaction_id,
      })) as DefaultTransaction
      const result = await defaultTransaction({
        def_transaction_id: original.def_transaction_id,
      })

      expect(result).toEqual(null)
    }
  )
})
