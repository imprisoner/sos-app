import { Firebase } from "./firebase.class.js"

export const firebase = (app) => {
  app.use('firebase', new Firebase())
}