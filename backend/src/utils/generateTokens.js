import jwt from 'jsonwebtoken'
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config/env.js'

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' })
}

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}