import { slugify } from '~/utils/formatters'
const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    return newBoard
  } catch (error) {
    //
  }
}
export const boardService = { createNew }
