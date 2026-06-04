import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // gọi tới tầng model để xử lý lưu bản ghi newBoard vào DB
    const createdBoard = await boardModel.createNew(newBoard)
    // lấy bản ghi board sau khi gọi (tùy mục đích dự án mà có cần bước này hay không)
    const getNewBoard = boardModel.findOnebyId(createdBoard.insertedId)
    // trả về kết quả, trong service luôn phải return
    return getNewBoard
  } catch (error) {
    //
  }
}
export const boardService = { createNew }
