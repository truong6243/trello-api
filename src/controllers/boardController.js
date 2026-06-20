import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
import { ObjectId } from 'mongodb'
const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error) // nếu truyền tham số error vào next thì sẽ nhảy vào xử lý lỗi tập  trung
  }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    console.log('boardId', boardId)
    const updateBoard = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updateBoard)
  } catch (error) {
    next(error) // nếu truyền tham số error vào next thì sẽ nhảy vào xử lý lỗi tập  trung
  }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(new ObjectId(boardId))
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error) // nếu truyền tham số error vào next thì sẽ nhảy vào xử lý lỗi tập  trung
  }
}
export const boardController = {
  createNew,
  update,
  getDetails
}
