import express from  "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhook from "./controllers/clerkWebhooks.js"

await connectDB()
const app = express()
app.use(cors())

// middleware
app.use(express.json())
app.use(clerkMiddleware())

app.use("/api/clerk", clerkWebhook);
app.get("/" , (req , res)=>res.send("Api is Working fine everything."))


const PORT = process.env.PORT || 3000 ;

app.listen(PORT, ()=>console.log(`Server running on ${PORT}`))