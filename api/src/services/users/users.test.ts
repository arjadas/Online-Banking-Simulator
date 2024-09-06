import type { User } from '@prisma/client'

import { users, user, createUser, updateUser, deleteUser } from './users'
import type { StandardScenario } from './users.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('users', () => {
  scenario('returns all users', async (scenario: StandardScenario) => {
    const result = await users()

    expect(result.length).toEqual(Object.keys(scenario.user).length)
  })

  scenario('returns a single user', async (scenario: StandardScenario) => {
    const result = await user({ uid: scenario.user.one.uid })

    expect(result).toEqual(scenario.user.one)
  })

  scenario('creates a user', async () => {
    const result = await createUser({
      input: {
        uid: 'String',
        first_name: 'String',
        surname: 'String',
        email: 'String',
        creation_timestamp: '2024-09-06T12:53:05.476Z',
      },
    })

    expect(result.uid).toEqual('String')
    expect(result.first_name).toEqual('String')
    expect(result.surname).toEqual('String')
    expect(result.email).toEqual('String')
    expect(result.creation_timestamp).toEqual(
      new Date('2024-09-06T12:53:05.476Z')
    )
  })

  scenario('updates a user', async (scenario: StandardScenario) => {
    const original = (await user({ uid: scenario.user.one.uid })) as User
    const result = await updateUser({
      uid: original.uid,
      input: { uid: 'String2' },
    })

    expect(result.uid).toEqual('String2')
  })

  scenario('deletes a user', async (scenario: StandardScenario) => {
    const original = (await deleteUser({ uid: scenario.user.one.uid })) as User
    const result = await user({ uid: original.uid })

    expect(result).toEqual(null)
  })
})
