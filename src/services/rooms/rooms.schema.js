// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'
import { StringEnum } from '@feathersjs/typebox/lib/index.js'
import { enums } from '../../constants/databaseTypes.js'
// Main data model schema
export const roomsSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    createdAt: Type.Integer(),
    updatedAt: Type.Integer(),
    patientId: Type.String({ format: 'uuid' }),
    description: Type.String(),
    affliction: StringEnum(enums.bodyParts),
    conditionRate: Type.Number({ minimum: 0, maximum: 5 }),
    isOpen: Type.Optional(Type.Boolean({ default: true })),
    status: Type.Optional(StringEnum(enums.roomStatus)),
  },
  { $id: 'Rooms', additionalProperties: false }
)
export const roomsValidator = getValidator(roomsSchema, dataValidator)
export const roomsResolver = resolve({})

export const roomsExternalResolver = resolve({})

// Schema for creating new entries
export const roomsDataSchema = Type.Pick(roomsSchema, ['id', 'patientId', 'description', 'affliction', 'conditionRate'], {
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
export const roomsQueryProperties = Type.Pick(roomsSchema, ['id', 'text'])
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
