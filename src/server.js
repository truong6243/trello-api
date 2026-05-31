/* eslint-disable no-console */
import express, { json } from 'express'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { CONNECT_DB } from '~/config/mongodb'
import { APIs_V1 } from './routes/v1'
const START_SERVER = () => {
  const app = express()
  const hostname = 'localhost'
  const port = 8017
  app.use(express.json())
  app.use('/v1', APIs_V1)
  app.listen(port, hostname, () => {
    console.log(
      `Hello ${env.AUTHOR}, I am running at http://${hostname}:${port}/`
    )
  })
  exitHook(() => {
    console.log('Exit App')
  })
}
;(async () => {
  try {
    console.log('Connecting to MongGoDb')
    await CONNECT_DB()
    console.log('Connected to MongoDb')
    START_SERVER()
  } catch (error) {
    console.error(error)
  }
})()
