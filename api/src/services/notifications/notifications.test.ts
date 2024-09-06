import type { Notification } from '@prisma/client'

import {
  notifications,
  notification,
  createNotification,
  updateNotification,
  deleteNotification,
} from './notifications'
import type { StandardScenario } from './notifications.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('notifications', () => {
  scenario('returns all notifications', async (scenario: StandardScenario) => {
    const result = await notifications()

    expect(result.length).toEqual(Object.keys(scenario.notification).length)
  })

  scenario(
    'returns a single notification',
    async (scenario: StandardScenario) => {
      const result = await notification({
        notification_id: scenario.notification.one.notification_id,
      })

      expect(result).toEqual(scenario.notification.one)
    }
  )

  scenario('creates a notification', async (scenario: StandardScenario) => {
    const result = await createNotification({
      input: {
        notification_id: 'String',
        uid: scenario.notification.two.uid,
        timestamp: '2024-09-06T12:53:32.426Z',
        content: 'String',
        read: true,
      },
    })

    expect(result.notification_id).toEqual('String')
    expect(result.uid).toEqual(scenario.notification.two.uid)
    expect(result.timestamp).toEqual(new Date('2024-09-06T12:53:32.426Z'))
    expect(result.content).toEqual('String')
    expect(result.read).toEqual(true)
  })

  scenario('updates a notification', async (scenario: StandardScenario) => {
    const original = (await notification({
      notification_id: scenario.notification.one.notification_id,
    })) as Notification
    const result = await updateNotification({
      notification_id: original.notification_id,
      input: { notification_id: 'String2' },
    })

    expect(result.notification_id).toEqual('String2')
  })

  scenario('deletes a notification', async (scenario: StandardScenario) => {
    const original = (await deleteNotification({
      notification_id: scenario.notification.one.notification_id,
    })) as Notification
    const result = await notification({
      notification_id: original.notification_id,
    })

    expect(result).toEqual(null)
  })
})
