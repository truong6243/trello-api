import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOnebyId(createdColumn.insertedId)
    if (getNewColumn) {
      getNewColumn.cards = []
      // cập nhật mảng columnOrderIds vào trong board
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (error) {
    throw error
  }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOnebyId(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }
    // Xoa column
    await columnModel.deleteOneById(columnId)
    // Xoa cards thuoc column do
    await cardModel.deleteManyByColumnId(columnId)
    // Xoa columnId khoi board
    await boardModel.pullColumnOrderIds(targetColumn)
    return { deleteResult: 'Delete successfully' }
  } catch (error) {
    throw error
  }
}

export const columnService = { createNew, update, deleteItem }
