/* eslint-disable no-console */
import express, { json } from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { CONNECT_DB } from '~/config/mongodb'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()

  // Fix cache from disk của expressjs
  app.use( (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // cấu hình cookieParser để xử lý cookie từ phía trình duyệt
  app.use(cookieParser())

  // Xử lý CORS
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  app.use('/v1', APIs_V1)
  //middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)
  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(
        `Hello ${env.AUTHOR}, I am running at :${process.env.PORT}/`
      )
    })
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(
        `Hello ${env.AUTHOR}, I am running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`
      )
    })
  }

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
