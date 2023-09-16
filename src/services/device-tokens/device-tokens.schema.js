// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { StringEnum, Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'
import { enums } from '../../constants/databaseTypes.js'
// Main data model schema
export const deviceTokensSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid'
    }),
    token: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    device: Type.String(),
    endpoint: Type.String(),
    userId: Type.String({
      format: 'uuid'
    }),
    userRole: StringEnum(enums.userRole),
  },
  { $id: 'DeviceTokens', additionalProperties: false }
)
export const deviceTokensValidator = getValidator(deviceTokensSchema, dataValidator)
export const deviceTokensResolver = resolve({})

export const deviceTokensExternalResolver = resolve({})

// Schema for creating new entries
export const deviceTokensDataSchema = Type.Pick(deviceTokensSchema, ['token', 'device'], {
  $id: 'DeviceTokensData'
})
export const deviceTokensDataValidator = getValidator(deviceTokensDataSchema, dataValidator)
export const deviceTokensDataResolver = resolve({
  userId: async (_, __, { params }) => params.user.id,
  userRole: async (_, __, { params }) => {
    console.log(params.user)
    return params.user.role
  },
  endpoint: async (_, data, { app, params }) => {
    const endpoint = await app.service('aws').createEndpoint(data.token, params.user.id)
    return endpoint
  }
})

// Schema for updating existing entries
export const deviceTokensPatchSchema = Type.Partial(deviceTokensSchema, {
  $id: 'DeviceTokensPatch'
})
export const deviceTokensPatchValidator = getValidator(deviceTokensPatchSchema, dataValidator)
export const deviceTokensPatchResolver = resolve({})

// Schema for allowed query properties
export const deviceTokensQueryProperties = Type.Pick(deviceTokensSchema, ['userRole'])
export const deviceTokensQuerySchema = Type.Intersect(
  [
    querySyntax(deviceTokensQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const deviceTokensQueryValidator = getValidator(deviceTokensQuerySchema, queryValidator)
export const deviceTokensQueryResolver = resolve({})
