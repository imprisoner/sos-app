import { AWS } from "./aws.class.js"

export const aws = (app) => {
  app.use('aws', new AWS())
}