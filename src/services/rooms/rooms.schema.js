// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'
import { StringEnum } from '@feathersjs/typebox/lib/index.js'
import { enums } from '../../constants/databaseTypes.js'
// Main data model schema
export const roomsSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    patient: Type.String({ format: 'uuid' }),
    volunteer: Type.Optional(Type.String({ format: 'uuid' })),
    description: Type.String({ minLength: 1 }),
    affliction: Type.Optional(StringEnum(enums.bodyParts)),
    conditionRate: Type.Number({ minimum: 0, maximum: 5 }),
    resultAffliction: Type.Optional(StringEnum(enums.bodyParts)),
    resultConditionRate: Type.Optional(Type.Number({ minimum: 0, maximum: 5 })),
    isOpen: Type.Boolean(),
    isActive: Type.Boolean()
  },
  { $id: 'Rooms', additionalProperties: false }
)
export const roomsValidator = getValidator(roomsSchema, dataValidator)
export const roomsResolver = resolve({
  // isOpen: virtual(async (data, context) => {
  //   return data.volunteer === null
  // }),
  // isActive: virtual(async (data, context) => {
  //   const start = new Date(data.updatedAt).getTime()
  //   const now = Date.now()
  //   const diff = (now - start) / (1000 * 60)
  //   return diff > 5
  // })
})

export const roomsExternalResolver = resolve({})

// Schema for creating new entries
export const roomsDataSchema = Type.Pick(roomsSchema, ['id', 'patient', 'volunteer', 'description', 'affliction', 'conditionRate', 'isOpen', 'isActive'], {
  $id: 'RoomsData'
})
export const roomsDataValidator = getValidator(roomsDataSchema, dataValidator)
export const roomsDataResolver = resolve({})

// Schema for updating existing entries
export const roomsPatchSchema = Type.Partial(roomsSchema, {
  $id: 'RoomsPatch'
})
export const roomsPatchValidator = getValidator(roomsPatchSchema, dataValidator)
export const roomsPatchResolver = resolve({})

// Schema for allowed query properties
export const roomsQueryProperties = Type.Pick(roomsSchema, ['id', 'patient', 'volunteer', 'createdAt', 'isOpen', 'isActive'])
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
