import { userModel } from '~/models/userModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { MailerSendProvider } from '~/providers/MailerSendProvider'

const createNew = async (reqBody) => {
  try {
    // kiểm tra email đã tồn tại trong hệ thống hay chưa
    const exitsUser = await userModel.findOnebyEmail(reqBody.email)
    if (exitsUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exits!')
    }
    // tạo data để lưu vào trong DB
    const nameFromEmail = reqBody.email.split('@')[0]
    const createdUser = await userModel.createNew({
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // tham số thứ 2 là số lần băm, càng nhiều thì càng an toàn nhưng sẽ tốn thời gian hơn
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    })
    const getNewUser = await userModel.findOnebyId(createdUser.insertedId)
    // gửi email để cho người dùng xác thực
    const verificatonLink = `http://localhost:5173/account/verifycation?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject =
      'Create account successfully: Please verify email before using our services'
    const htmlContent = `
      <h1> Welcome ${getNewUser.username}</h1>
      <h3>Here is your verificaton link: </h3>
      <h3>${verificatonLink} </h3>
    `
    await MailerSendProvider.sendEmail(
      getNewUser.email,
      getNewUser.username,
      customSubject,
      htmlContent
    )
    // return data đã lưu vào trong DB
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

export const userService = { createNew }
