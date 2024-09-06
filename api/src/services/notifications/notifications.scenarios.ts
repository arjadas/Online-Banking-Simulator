import type { Prisma, Notification } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NotificationCreateArgs>({
  notification: {
    one: {
      data: {
        notification_id: 'String',
        timestamp: '2024-09-06T12:53:32.435Z',
        content: 'String',
        read: true,
        user: {
          create: {
            uid: 'String',
            first_name: 'String',
            surname: 'String',
            email: 'String',
            creation_timestamp: '2024-09-06T12:53:32.435Z',
          },
        },
      },
    },
    two: {
      data: {
        notification_id: 'String',
        timestamp: '2024-09-06T12:53:32.435Z',
        content: 'String',
        read: true,
        user: {
          create: {
            uid: 'String',
            first_name: 'String',
            surname: 'String',
            email: 'String',
            creation_timestamp: '2024-09-06T12:53:32.435Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Notification, 'notification'>
