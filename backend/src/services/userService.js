import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js'
import { hash, compare } from 'bcrypt'
import Users from '../models/userModel.js'
import { AppError } from '../utils/appError.js'
import jwt from 'jsonwebtoken'
import { JWT_REFRESH_SECRET } from '../config/env.js'

export default class UserService {

    register = async (userData) => {
        const hashPassword = await hash(userData.password, 10)

        const newUser = {
            ...userData,
            password: hashPassword
        }

        const user = await Users.create(newUser)
        return user
    }

    login = async (email, password) => {
        const user = await Users.findOne({ email })
        if (!user) {
            throw new AppError('The user not exists', 404)
        }
        
        const isMatch = await compare(password, user.password)
        if (!isMatch) {
            throw new AppError('incorrect credentials', 401)
        }

        const payload = { id: user._id, username: user.username }

        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        user.refreshToken = refreshToken
        await user.save()

        return { accessToken, refreshToken, user }
    }

    logout = async (userData) => {
        const { id } = userData
        const user = await Users.findById(id)

        if (!user) {
            throw new AppError('User does not exists', 404)
        }

        user.refreshToken = null
        await user.save()
        
        return { message: 'logout succesfull' }
    }

    findUser = async (id) => {
        const user = await Users.findById(id)
        
        if (!user) {
            throw new AppError('User does not exists', 404)
        }

        return user
    }

    refresh = async (refreshToken) => {
        const userData = jwt.verify(refreshToken, JWT_REFRESH_SECRET)

        const user = await Users.findById(userData.id)

        if (!user || user.refreshToken !== refreshToken) {
            throw new AppError('Invalid refresh token', 403);
        }

        const payload = {
            id: user._id,
            username: user.username
        }

        const newAccessToken = generateAccessToken(payload)
        const newRefreshToken = generateRefreshToken(payload)

        user.refreshToken = newRefreshToken
        await user.save()

        return { accessToken: newAccessToken, newRefreshToken }
    }

}