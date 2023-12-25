// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import fileUploader from '#extensions/multer/index.js'
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  uploadDataValidator,
  uploadPatchValidator,
  uploadQueryValidator,
  uploadResolver,
  uploadExternalResolver,
  uploadDataResolver,
  uploadPatchResolver,
  uploadQueryResolver
} from './upload.schema.js'
import { UploadService, getOptions } from './upload.class.js'
import { uploadPath, uploadMethods } from './upload.shared.js'

export * from './upload.class.js'
export * from './upload.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const upload = (app) => {
  // Register our service on the Feathers application
  app.use(uploadPath, new UploadService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: uploadMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    koa: {
      before: [
        fileUploader.single('file'),
        async (ctx, next) => {
          ctx.feathers = {
            ...ctx.feathers,
            file: ctx.file
          }

          await next()
        }
      ]
    }
  })
  // Initialize hooks
  app.service(uploadPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(uploadExternalResolver),
        schemaHooks.resolveResult(uploadResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(uploadQueryValidator), schemaHooks.resolveQuery(uploadQueryResolver)],
      find: [],
      get: [],
      // create: [schemaHooks.validateData(uploadDataValidator), schemaHooks.resolveData(uploadDataResolver)],
      create: [],
      patch: [schemaHooks.validateData(uploadPatchValidator), schemaHooks.resolveData(uploadPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
