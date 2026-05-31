import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
const createNew = (req, res, next) => {
  try {
    // eslint-disable-next-line no-console
    console.log('reqbody', req.body)
    // res
    //   .status(StatusCodes.CREATED)
    //   .json({ message: 'POST from Controller: API create a new board' })
    throw new ApiError(StatusCodes.BAD_REQUEST, 'This is a bad request error')
  } catch (error) {
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
    next(error) // nếu truyền tham số error vào next thì sẽ nhảy vào xử lý lỗi tập  trung
  }
}
export const boardController = {
  createNew
}
