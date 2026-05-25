/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { CONNECT_DB } from '~/config/mongodb'
const START_SERVER = () => {
  const app = express()
  const hostname = 'localhost'
  const port = 8017
  app.get('/', async (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })
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
