import { SNSClient } from '@aws-sdk/client-sns'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.development')
  })
}

export const client = new SNSClient({
  apiVersion: 3,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
})