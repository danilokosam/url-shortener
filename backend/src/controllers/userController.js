import { tryCatchFn } from "../utils/tryCatch.js";
import userService from "../services/userService.js"
import client from "../config/redis.js";
const Service = new userService()

export const logout = tryCatchFn(async (req, res, _next) => {
    const userData = req.user
    const logout = await Service.logout(userData)
    res.clearCookie('accessToken').clearCookie('refreshToken').json(logout)
})

export const login = tryCatchFn(async (req, res, _next) => {
    const { email, password } = req.body
    const { accessToken, refreshToken, user } = await Service.login(email, password)
    res.status(201).cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
        sameSite: 'strict',
        secure: false
    }).cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: false
    }).json(user)
})

export const register = tryCatchFn(async (req, res, _next) => {
    const userData = req.body
    const newUser = await Service.register(userData)
    res.status(201).json(newUser)
})

export const me = tryCatchFn(async (req, res, _next) => {
    const { id } = req.user
    const recovery = await client.get(`users:me:${id}`)

    if (recovery) {
        return res.json(JSON.parse(recovery))
    }
    
    const user = await Service.findUser(id)
    await client.set(`users:me:${id}`, JSON.stringify(user), { EX: 60 * 5 })
    return res.json(user)
})

export const refresh = tryCatchFn(async (req, res, _next) => {
    const refreshToken = req.cookies.refreshToken
    const { accessToken, newRefreshToken } = await Service.refresh(refreshToken)
    return res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
        sameSite: 'strict',
        secure: false
    }).cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: false
    }).json(accessToken)
})