// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
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

import multer from 'multer'
import koaMulter from '@koa/multer'

export * from './upload.class.js'
export * from './upload.schema.js'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.body.scope)
    cb(null, 'public/uploads/' + req.body.scope)
  },
  filename: function (req, file, cb) {
    const suffix = Date.now() + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + suffix + '.' + file.mimetype.split('/')[1])
  }
})

const koaUpload = koaMulter({ storage })

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
        koaUpload.single('file'),
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
