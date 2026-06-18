import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoutes'
import { columnRoute } from '~/routes/v1/columnRoutes'
import { cardRoute } from '~/routes/v1/cardRoutes'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API v1 ready to use' })
})
// Board API
Router.use('/boards', boardRoute)
// Column API
Router.use('/columns', columnRoute)
// Card API
Router.use('/cards', cardRoute)
export const APIs_V1 = Router
