import { userModel } from '~/models/userModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { MailerSendProvider } from '~/providers/MailerSendProvider'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'

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
    const verificatonLink = `http://localhost:5173/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
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

const verifyAccount = async (reqBody) => {
  try {
    const exitsUser = await userModel.findOnebyEmail(reqBody.email)
    if (!exitsUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (exitsUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is alredy active'
      )
    if (reqBody.token !== exitsUser.verifyToken)
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')
    // Nếu như mọi thứ oke thì update lại thông tin của user
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    const updatedUser = await userModel.update(exitsUser._id, updateData)
    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    const exitsUser = await userModel.findOnebyEmail(reqBody.email)
    if (!exitsUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!exitsUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is not active'
      )
    if (!bcryptjs.compareSync(reqBody.password, exitsUser.password))
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Email or password is incorrect'
      )
    // Nếu mọi thứ ok thì bắt đầu tạo Token đăng nhập để trả về cho phía FE
    // Tạo thông tin để đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = {
      _id: exitsUser._id,
      email: exitsUser.email
    }

    // Tạo ra 2 loại accessToken và refreshToken
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // 15
      env.REFRESH_TOKEN_LIFE
    )
    return { accessToken, refreshToken, ...pickUser(exitsUser) }
  } catch (error) {
    throw error
  }
}

const refreshToken = (clientRefreshToken) => {
  try {
    // verify token xem có hợp lệ không
    const refreshTokenDecoded = JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const InfoUser = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }
    // Tạo accessToken mới
    const accessToken = JwtProvider.generateToken(
      InfoUser,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    )
    return { accessToken }
  } catch (error) {
    throw error
  }
}

export const userService = { createNew, verifyAccount, login, refreshToken }
