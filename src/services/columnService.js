import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

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

export const columnService = { createNew }
