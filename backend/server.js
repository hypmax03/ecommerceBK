import express from "express"
import connectDB from "./config/db.js"
import productRoute from './route/productRoute.js'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './route/userRoute.js'
import cookieParser from "cookie-parser"
import { pathToFileURL } from "node:url"

const app=express()
dotenv.config()
connectDB()

app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: "7mb" }))

app.use('/api/product',productRoute)
app.use('/api/user',userRoute)

export default app

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(Number(process.env.PORT) || 3000, () => {
    console.log("🦖...")
  })
}