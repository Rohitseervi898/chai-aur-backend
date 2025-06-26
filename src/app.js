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
import tweetRouter from "./routes/tweet.route.js"
import videoRouter from "./routes/video.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import PlaylistRouter from "./routes/playlist.route.js"

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/subscription",subscriptionRouter)
app.use("/api/v1/playlist",PlaylistRouter)

export default app;