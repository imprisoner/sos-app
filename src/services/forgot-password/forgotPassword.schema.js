import { Type } from "@feathersjs/typebox/lib/index.js";
import { resolve } from "@feathersjs/schema/lib/resolver.js";

export const forgotPasswordRequest = Type.Object(
  {
    email: Type.String({
      format: 'email',
      minLength: 5,
      maxLength: 200
    })
  }
)

export const forgotPasswordExternalResolver = resolve({
  password: async () => {}
})