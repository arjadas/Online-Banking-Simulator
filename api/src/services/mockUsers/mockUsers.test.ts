import type { MockUser } from '@prisma/client'

import {
  mockUsers,
  mockUser,
  createMockUser,
  updateMockUser,
  deleteMockUser,
} from './mockUsers'
import type { StandardScenario } from './mockUsers.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('mockUsers', () => {
  scenario('returns all mockUsers', async (scenario: StandardScenario) => {
    const result = await mockUsers()

    expect(result.length).toEqual(Object.keys(scenario.mockUser).length)
  })

  scenario('returns a single mockUser', async (scenario: StandardScenario) => {
    const result = await mockUser({ uid: scenario.mockUser.one.uid })

    expect(result).toEqual(scenario.mockUser.one)
  })

  scenario('creates a mockUser', async () => {
    const result = await createMockUser({
      input: { uid: 'String', creation_timestamp: '2024-09-06T12:51:24.971Z' },
    })

    expect(result.uid).toEqual('String')
    expect(result.creation_timestamp).toEqual(
      new Date('2024-09-06T12:51:24.971Z')
    )
  })

  scenario('updates a mockUser', async (scenario: StandardScenario) => {
    const original = (await mockUser({
      uid: scenario.mockUser.one.uid,
    })) as MockUser
    const result = await updateMockUser({
      uid: original.uid,
      input: { uid: 'String2' },
    })

    expect(result.uid).toEqual('String2')
  })

  scenario('deletes a mockUser', async (scenario: StandardScenario) => {
    const original = (await deleteMockUser({
      uid: scenario.mockUser.one.uid,
    })) as MockUser
    const result = await mockUser({ uid: original.uid })

    expect(result).toEqual(null)
  })
})
