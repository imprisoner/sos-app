import multer from 'multer'
import koaMulter from '@koa/multer'
import { NotAcceptable } from '@feathersjs/errors'
import { app } from '#src/app.js'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, app.get('uploadsDir') + req.body.scope)
    },
    filename: function (req, file, cb) {
        const suffix = Date.now() + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + suffix + '.' + file.mimetype.split('/')[1])
    }
})

const fileFilter = (ctx, file, cb) => {
    const type = file.mimetype.split('/')[1]
    if (!type.match(/(jpg|jpeg|png)$/)) {
        return cb(new NotAcceptable('Please provide a valid mime-type'))
    }

    cb(null, true)
}

const fileUploader = koaMulter({ storage, fileFilter })

export default fileUploader