// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'
import { dataValidator, queryValidator } from '../../validators.js'
import { StringEnum } from '@feathersjs/typebox'
import { enums } from '../../constants/databaseTypes.js'
// Main data model schema
export const userSchema = Type.Object(
  {
    id: Type.String({
      format: "uuid"
    }),

    email: Type.String({
      format: 'email',
      minLength: 5,
      maxLength: 200
    }),

    password: Type.String({
      minLength: 8,
      maxLength: 200
    }),

    name: Type.String(
      {
        maxLength: 120,
      }
    ),

    role: StringEnum(enums.userRole),

    preferredLang: StringEnum(enums.userPreferredLang),

    emailVerified: Type.Boolean({
      default: false
    }),

    emailVerificationToken: Type.Optional(Type.String({
      maxLength: 11
    })),

    avatar: Type.Optional(Type.String({
      format: "uri"
    })),

    rememberMe: Type.Optional(Type.Boolean({
      default: false
    }))
  },
  { $id: 'User', additionalProperties: false }
)
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve({})

export const userExternalResolver = resolve({
  // The password should never be visible externally
  password: async () => undefined,
  emailVerificationToken: async () => undefined
})

// Schema for creating new entries
export const userDataSchema = Type.Pick(userSchema, ['email', 'password', 'name', 'role', 'preferredLang', 'avatar'], {
  $id: 'UserData'
})
export const userDataValidator = getValidator(userDataSchema, dataValidator)

export const userDataResolver = resolve({
  password: passwordHash({ strategy: 'local' })
})

// Schema for updating existing entries
export const userPatchSchema = Type.Partial(userSchema, {
  $id: 'UserPatch'
})

export const userPatchValidator = getValidator(userPatchSchema, dataValidator)

export const userPatchResolver = resolve({
  password: passwordHash({ strategy: 'local' })
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['id', 'email', 'emailVerificationToken'])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: async (value, __, context) => {
    if (context.params.user) {
      return context.params.user.id
    }

    return value
  }
})
