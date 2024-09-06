import type { Account } from '@prisma/client'

import {
  accounts,
  account,
  createAccount,
  updateAccount,
  deleteAccount,
} from './accounts'
import type { StandardScenario } from './accounts.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('accounts', () => {
  scenario('returns all accounts', async (scenario: StandardScenario) => {
    const result = await accounts()

    expect(result.length).toEqual(Object.keys(scenario.account).length)
  })

  scenario('returns a single account', async (scenario: StandardScenario) => {
    const result = await account({ acc: scenario.account.one.acc })

    expect(result).toEqual(scenario.account.one)
  })

  scenario('creates a account', async () => {
    const result = await createAccount({
      input: {
        acc_name: 'String',
        uid: 'String',
        short_description: 'String',
        opened_timestamp: '2024-09-06T12:49:04.411Z',
      },
    })

    expect(result.acc_name).toEqual('String')
    expect(result.uid).toEqual('String')
    expect(result.short_description).toEqual('String')
    expect(result.opened_timestamp).toEqual(
      new Date('2024-09-06T12:49:04.411Z')
    )
  })

  scenario('updates a account', async (scenario: StandardScenario) => {
    const original = (await account({
      acc: scenario.account.one.acc,
    })) as Account
    const result = await updateAccount({
      acc: original.acc,
      input: { acc_name: 'String2' },
    })

    expect(result.acc_name).toEqual('String2')
  })

  scenario('deletes a account', async (scenario: StandardScenario) => {
    const original = (await deleteAccount({
      acc: scenario.account.one.acc,
    })) as Account
    const result = await account({ acc: original.acc })

    expect(result).toEqual(null)
  })
})
