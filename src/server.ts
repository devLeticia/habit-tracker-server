import fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'
import { initializeApp } from 'firebase-admin/app'

const app = fastify()

const admin = require('firebase-admin')
const serviceAccount = require('path/to/serviceAccountKey.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

// app.register(cors, {
//   origin: ['http://localhost:3000'],
// })

app.register(cors)
let authorized = true

function checkAuth(req: any, res: any) {
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken)
      .then(() => {
        console.log('verificado, ok')
      })
      .catch(() => {
        res.status(403).send('Unauthorized')
      })
  } else {
    res.status(403).send('Unauthorized')
  }
}
app.addHook('preHandler', async (request, response) => {
  // validação global das rotas desse arquivo.
  checkAuth(request, response)
})

app.register(appRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then((url) => {
    console.log(`HTTP Server running on ${url}!`)
  })
