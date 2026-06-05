/* eslint-disable no-console */
import express, { json } from 'express'
import cors from 'cors'
import {corsOptions} from '~/config/cors'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { CONNECT_DB } from '~/config/mongodb'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/v1', APIs_V1)
  //middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`
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
