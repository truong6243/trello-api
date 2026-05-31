/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().message({
      'any.required': 'title is required (TruongLamDev)',
      'string.empty': 'title is not allow a empty string' // custom error message
    }),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })
  try {
    console.log('reqbody', req.body)
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    res.status(StatusCodes.CREATED).json({ message: 'POST API' })
  } catch (error) {
    console.log('error', error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}
export const boardValidation = {
  createNew
}
