/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPE } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().message({
      'any.required': 'title is required (TruongLamDev)',
      'string.empty': 'title is not allow a empty string' // custom error message
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // validate dữ liệu xong thì chuyển sang controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid request data')) // nhảy vào xử lý lỗi tập trung
  }
}
export const boardValidation = {
  createNew
}
