import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import { env } from '~/config/environment'
import ms from 'ms'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}
const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}
const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)

    /*  xử lý trả về httpOnlyCookie phía trình duyệt
      maxAge là thời gian sống của cookie khác với accessToken trong payload,
      nếu maxAge < accessToken thì khi cookie hết hạn trình duyệt sẽ xóa cookie nhưng
      accessToken vẫn còn sống và ngược lại
    */
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
      // env.ACCESS_TOKEN_LIFE
    })
    res.cookie('refreshToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
      // env.ACCESS_TOKEN_LIFE
    })
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = { createNew, verifyAccount, login }
