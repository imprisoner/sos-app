// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const messagesSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    userId: Type.String({ format: 'uuid' }), // foreign key
    userName: Type.String({ minLength: 1 }),
    roomId: Type.String({ format: 'uuid' }),
    createdAt: Type.Integer(),
    content: Type.String({ minLength: 1 })
  },
  { $id: 'Messages', additionalProperties: false }
)
export const messagesValidator = getValidator(messagesSchema, dataValidator)
export const messagesResolver = resolve({
  createdAt: (value) => {
    const date = new Date(value)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    return `${hours}:${minutes}`
  },
  from: virtual(async (data) => {
    return {
      id: data.userId,
      name: data.userName
    }
  })
})

export const messagesExternalResolver = resolve({})

// Schema for creating new entries
export const messagesDataSchema = Type.Pick(messagesSchema, ['roomId', 'content'], {
  $id: 'MessagesData'
})

export const messagesDataValidator = getValidator(messagesDataSchema, dataValidator)
export const messagesDataResolver = resolve({
  userId: async (_, __, { params }) => params.user.id,
  userName: async (_, __, { params }) => params.user.name
})

// Schema for updating existing entries
export const messagesPatchSchema = Type.Partial(messagesSchema, {
  $id: 'MessagesPatch'
})
export const messagesPatchValidator = getValidator(messagesPatchSchema, dataValidator)
export const messagesPatchResolver = resolve({})

// Schema for allowed query properties
export const messagesQueryProperties = Type.Pick(messagesSchema, ['id', 'roomId'])
export const messagesQuerySchema = Type.Intersect(
  [
    querySyntax(messagesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const messagesQueryValidator = getValidator(messagesQuerySchema, queryValidator)
export const messagesQueryResolver = resolve({})
