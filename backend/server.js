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

app.set("trust proxy", 1)
app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: "7mb" }))

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is healthy", timestamp: new Date().toISOString() })
})

app.use('/api/product',productRoute)
app.use('/api/user',userRoute)

export default app

const isMainModule = () => {
  if (!process.argv[1]) return false;
  try {
    return import.meta.url.toLowerCase() === pathToFileURL(process.argv[1]).href.toLowerCase();
  } catch {
    return false;
  }
};

const PORT = Number(process.env.PORT) || 3000;
if (isMainModule()) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🦖 Server running on http://0.0.0.0:${PORT}...`);
  });
}