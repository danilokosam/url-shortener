import { AppError } from "../utils/appError.js"
import jwt  from "jsonwebtoken"
import { JWT_ACCESS_SECRET } from "../config/env.js"

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken

    if (!token) {
        throw new AppError('Unhautorized', 401)
    }

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        throw new AppError(err.message, 401)
    }
}

export default verifyToken