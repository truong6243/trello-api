import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookies phía client - withCredentials phía cấu hình axios
  const clientAccessToken = req.cookies?.accessToken
  if (!clientAccessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found')
    )
    return
  }
  try {
    // Bước 1 : thực hiện giải mã token xem có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // Bước 2: Nếu token hợp lệ thì phải lưu thông tin đã giải mã vào Jwt.Decoded để sử
    // dụng cho các tầng cần xử lý phía sau
    req.jwtDecoded = accessTokenDecoded
    // Bước 3: Cho phép request đi tiếp
    next()
  } catch (error) {
    // Nếu accessToken bị hết hạn(expired) thì trả về lỗi cho FE để sử dụng api rereshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token'))
      return
    }
    // Nếu accessToken bị lỗi vì bất kỳ lý do nào khác ngoài expired thì trả về lỗi 410
    // cho phía FE gọi api sign out
    next( new ApiError(StatusCodes.UNAUTHORIZED, 'unathorized!'))
  }
}
export const authMiddleware = { isAuthorized }
