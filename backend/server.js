import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { pathToFileURL } from "node:url"
import connectDB from "./config/db.js"
import productRoute from "./route/productRoute.js"
import userRoute from "./route/userRoute.js"
import orderRoute from "./route/orderRoute.js"

const app=express()
dotenv.config()
connectDB()

app.set("trust proxy", 1)
app.use(cookieParser())
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ecommerce-hypmax.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "7mb" }))

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is healthy", timestamp: new Date().toISOString() })
})

app.use('/api/product', productRoute)
app.use('/api/user', userRoute)
app.use('/api/order', orderRoute)

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