import express from "express"
import * as userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', authMiddleware, userController.logout)
router.get('/me', authMiddleware, userController.me)
router.post('/refresh', userController.refresh)

export default router