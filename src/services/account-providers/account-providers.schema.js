// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'
// Main data model schema
export const accountProviderSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    userId: Type.String({ format: 'uuid' }),
    provider: Type.String(),
    profileId: Type.String(),
    email: Type.String({
      format: 'email'
    })
  },
  { $id: 'AccountProvider', additionalProperties: false }
)
export const accountProviderValidator = getValidator(accountProviderSchema, dataValidator)
export const accountProviderResolver = resolve({})

export const accountProviderExternalResolver = resolve({})

// Schema for creating new entries
export const accountProviderDataSchema = Type.Pick(accountProviderSchema, ['userId', 'provider', 'profileId', 'email'], {
  $id: 'AccountProviderData'
})
export const accountProviderDataValidator = getValidator(accountProviderDataSchema, dataValidator)
export const accountProviderDataResolver = resolve({})

// Schema for updating existing entries
export const accountProviderPatchSchema = Type.Partial(accountProviderSchema, {
  $id: 'AccountProviderPatch'
})
export const accountProviderPatchValidator = getValidator(accountProviderPatchSchema, dataValidator)
export const accountProviderPatchResolver = resolve({})

// Schema for allowed query properties
export const accountProviderQueryProperties = Type.Pick(accountProviderSchema, ['userId', 'profileId', 'email', 'provider'])
export const accountProviderQuerySchema = Type.Intersect(
  [
    querySyntax(accountProviderQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const accountProviderQueryValidator = getValidator(accountProviderQuerySchema, queryValidator)
export const accountProviderQueryResolver = resolve({})
