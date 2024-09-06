import type { UserPrevContact } from '@prisma/client'

import {
  userPrevContacts,
  userPrevContact,
  createUserPrevContact,
  updateUserPrevContact,
  deleteUserPrevContact,
} from './userPrevContacts'
import type { StandardScenario } from './userPrevContacts.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('userPrevContacts', () => {
  scenario(
    'returns all userPrevContacts',
    async (scenario: StandardScenario) => {
      const result = await userPrevContacts()

      expect(result.length).toEqual(
        Object.keys(scenario.userPrevContact).length
      )
    }
  )

  scenario(
    'returns a single userPrevContact',
    async (scenario: StandardScenario) => {
      const result = await userPrevContact({
        user_id: scenario.userPrevContact.one.user_id,
      })

      expect(result).toEqual(scenario.userPrevContact.one)
    }
  )

  scenario('creates a userPrevContact', async (scenario: StandardScenario) => {
    const result = await createUserPrevContact({
      input: {
        user_id: scenario.userPrevContact.two.user_id,
        contact_acc: 7759138,
        contact_acc_name: 'String',
        contact_uid: 'String',
        contact_description: 'String',
      },
    })

    expect(result.user_id).toEqual(scenario.userPrevContact.two.user_id)
    expect(result.contact_acc).toEqual(7759138)
    expect(result.contact_acc_name).toEqual('String')
    expect(result.contact_uid).toEqual('String')
    expect(result.contact_description).toEqual('String')
  })

  scenario('updates a userPrevContact', async (scenario: StandardScenario) => {
    const original = (await userPrevContact({
      user_id: scenario.userPrevContact.one.user_id,
    })) as UserPrevContact
    const result = await updateUserPrevContact({
      user_id: original.user_id,
      input: { contact_acc: 2803952 },
    })

    expect(result.contact_acc).toEqual(2803952)
  })

  scenario('deletes a userPrevContact', async (scenario: StandardScenario) => {
    const original = (await deleteUserPrevContact({
      user_id: scenario.userPrevContact.one.user_id,
    })) as UserPrevContact
    const result = await userPrevContact({ user_id: original.user_id })

    expect(result).toEqual(null)
  })
})
