import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"})) //limit the size of the request body
app.use(express.urlencoded({extended: true, limit: "16kb"})) //extended:true means that the urlencoded data will be parsed as a string or array
app.use(express.static("public")) //serve static files from the public directory , also stores the pdf or files in the public directory 
app.use(cookieParser()) //parse cookies from the request

//routes import
import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)

export default app;