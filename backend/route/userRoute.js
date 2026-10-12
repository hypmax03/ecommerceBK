import express from 'express'
import { loginUser, registerUser,getProfile } from '../controller/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const route=express.Router()

route.post("/register",registerUser)
route.post("/login",loginUser)
route.get("/profile",authMiddleware,getProfile)

export default route