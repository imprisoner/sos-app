// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const notificationsSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    topic: Type.String(),
    messageId: Type.String(),
    recipientId: Type.String({ format: 'uuid' })
  },
  { $id: 'Notifications', additionalProperties: false }
)
export const notificationsValidator = getValidator(notificationsSchema, dataValidator)
export const notificationsResolver = resolve({})

export const notificationsExternalResolver = resolve({})

// Schema for creating new entries
export const notificationsDataSchema = Type.Pick(notificationsSchema, ['message', 'recipientId', 'awsMessageId'], {
  $id: 'NotificationsData'
})
export const notificationsDataValidator = getValidator(notificationsDataSchema, dataValidator)
export const notificationsDataResolver = resolve({})

// Schema for updating existing entries
export const notificationsPatchSchema = Type.Partial(notificationsSchema, {
  $id: 'NotificationsPatch'
})
export const notificationsPatchValidator = getValidator(notificationsPatchSchema, dataValidator)
export const notificationsPatchResolver = resolve({
  updatedAt: async () => new Date().toISOString()
})

// Schema for allowed query properties
export const notificationsQueryProperties = Type.Pick(notificationsSchema, ['id'])
export const notificationsQuerySchema = Type.Intersect(
  [
    querySyntax(notificationsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const notificationsQueryValidator = getValidator(notificationsQuerySchema, queryValidator)
export const notificationsQueryResolver = resolve({})
