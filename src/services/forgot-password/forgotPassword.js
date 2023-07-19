// import { authenticate } from '@feathersjs/authentication'
import { checkEmailPresence } from "../../hooks/check-email-presence.js";
import { approvePasswordCreation } from "../../hooks/forgot-password/approve-password-creation.js";
import { ForgotPasswordService } from "./forgotPassword.class.js";
import { hooks as schemaHooks } from '@feathersjs/schema'
import swagger from 'feathers-swagger';

import { createTemporaryPassword } from "../../hooks/forgot-password/create-temporary-password.js";
import { sendPasswordEmail } from "../../hooks/forgot-password/send-password-email.js";
import { forgotPasswordExternalResolver } from "./forgotPassword.schema.js";

export const forgotPasswordPath = 'forgot-password'
export const forgotPasswordMethods = ['create']
export * from './forgotPassword.class.js'

export const forgotPassword = (app) => {
  app.use(forgotPasswordPath, new ForgotPasswordService(), {
    methods: ['create'],
    events: [],
    docs: swagger.createSwaggerServiceOptions({
      schemas: {},
      docs: {

      }
    })
  })

  app.service(forgotPasswordPath).hooks({
    around: {
      all: [ schemaHooks.resolveExternal(forgotPasswordExternalResolver)]
    },
    before: {
      create: [checkEmailPresence, approvePasswordCreation, createTemporaryPassword]
    },
    after: {
      create: [
        sendPasswordEmail
      ]
    }
  })
}
