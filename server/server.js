import express from  "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhook from "./controllers/clerkWebhooks.js"
import userRouter from "./routes/userRoutes.js"
import hotelRouter from "./routes/hotelRoutes.js"
import connectCloudinary from "./configs/cloudinary.js"
import roomRouter from "./routes/roomRoutes.js"

await connectDB()
connectCloudinary()

const app = express()
app.use(cors()) // Enable Cross-Origin Resource Sharing

// middleware
app.use(express.json())
app.use(clerkMiddleware())

// API to Listen to Clerk Webhooks
app.use("/api/clerk", clerkWebhook);

app.get("/" , (req , res)=>res.send("Api is Working fine everything."))
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)


const PORT = process.env.PORT || 3000 ;

app.listen(PORT, () => console.log(`Server running on ${PORT}`))