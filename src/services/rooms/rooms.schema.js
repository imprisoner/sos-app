// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'
import { StringEnum } from '@feathersjs/typebox/lib/index.js'
import { enums } from '../../constants/databaseTypes.js'
import { v4 as uuid } from 'uuid'
import { parsePgArray } from '../../helpers/parsePgArray.js'
// Main data model schema
export const roomsSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    patient: Type.String({ format: 'uuid' }),
    volunteer: Type.Optional(Type.String({ format: 'uuid' })),
    description: Type.String({ minLength: 1 }),
    affliction: Type.Optional(Type.Array(StringEnum(enums.bodyParts))),
    conditionRate: Type.Number({ minimum: 0, maximum: 10 }),
    resultAffliction: Type.Optional(Type.Array(StringEnum(enums.bodyParts))),
    resultConditionRate: Type.Optional(Type.Number({ minimum: 0, maximum: 10 })),
    isOpen: Type.Boolean({
      default: true
    }),
    isActive: Type.Boolean({
      default: true
    })
  },
  { $id: 'Rooms', additionalProperties: false }
)
export const roomsValidator = getValidator(roomsSchema, dataValidator)
export const roomsResolver = resolve({
  affliction: parsePgArray,
  resultAffliction: parsePgArray,
  patient: virtual(async (room, context) => {
    if (room.patient) {
      return context.app.service('users').get(room.patient)
    }
  })
})

export const roomsExternalResolver = resolve({})

// Schema for creating new entries
export const roomsDataSchema = Type.Pick(roomsSchema, ['description', 'affliction', 'conditionRate'], {
  $id: 'RoomsData'
})
export const roomsDataValidator = getValidator(roomsDataSchema, dataValidator)
export const roomsDataResolver = resolve({
  id: async () => uuid(),
  isOpen: async () => true,
  isActive: async () => true,
  patient: async (value, room, context) => {
    if (!value) {
      return context.params?.user.id
    }
  }
  // affliction: async (value) => value ? value : ['none']
})

// Schema for updating existing entries
export const roomsPatchSchema = Type.Partial(roomsSchema, {
  $id: 'RoomsPatch'
})
export const roomsPatchValidator = getValidator(roomsPatchSchema, dataValidator)
export const roomsPatchResolver = resolve({
  updatedAt: async () => new Date().toISOString(),
  volunteer: async (value, data, context) => {
    const { user } = context.params

    if (user && user.role === 'volunteer') {
      return user.id
    }
  },
  id: async(_, __, context) => {
    if (context.params.provider !== 'socketio') {
      return
    }

    const room = context.params.connection.room

    return room.id
  }
  // resultAffliction: async (value) => value ? value : ['none']
})

// Schema for allowed query properties
export const roomsQueryProperties = Type.Pick(roomsSchema, [
  'id',
  'patient',
  'volunteer',
  'createdAt',
  'isOpen',
  'isActive'
])
export const roomsQuerySchema = Type.Intersect(
  [
    querySyntax(roomsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const roomsQueryValidator = getValidator(roomsQuerySchema, queryValidator)
export const roomsQueryResolver = resolve({})
