// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { StringEnum, Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'
import { enums } from '../../constants/databaseTypes.js'

export const sosSchema = Type.Object(
  {
    id: Type.Number({ format: 'uuid' }),
    createdAt: Type.Date(),
    patientId: Type.String({ format: 'uuid' }),
    description: Type.String(),
    affliction: StringEnum(enums.bodyParts),
    conditionRate: Type.Number({ minimum: 0, maximum: 5 }),
    isOpen: Type.Optional(Type.Boolean({ default: true })),
    status: Type.Optional(StringEnum(enums.sosStatus)),
  },
  { $id: 'Sos', additionalProperties: false }
)
export const sosValidator = getValidator(sosSchema, dataValidator)
export const sosResolver = resolve({})

export const sosExternalResolver = resolve({})

// Schema for creating new entries
export const sosDataSchema = Type.Pick(sosSchema, ['id'], {
  $id: 'SosData'
})
export const sosDataValidator = getValidator(sosDataSchema, dataValidator)
export const sosDataResolver = resolve({})

// Schema for updating existing entries
export const sosPatchSchema = Type.Partial(sosSchema, {
  $id: 'SosPatch'
})
export const sosPatchValidator = getValidator(sosPatchSchema, dataValidator)
export const sosPatchResolver = resolve({})

// Schema for allowed query properties
export const sosQueryProperties = Type.Pick(sosSchema, ['id', 'text'])
export const sosQuerySchema = Type.Intersect(
  [
    querySyntax(sosQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const sosQueryValidator = getValidator(sosQuerySchema, queryValidator)
export const sosQueryResolver = resolve({})
