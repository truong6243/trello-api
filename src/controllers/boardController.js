import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { boardService } from '~/services/boardService'
const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error) // nếu truyền tham số error vào next thì sẽ nhảy vào xử lý lỗi tập  trung
  }
}
export const boardController = {
  createNew
}
