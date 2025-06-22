import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/Auth.middleware.js"; 


const router = Router();
router.use(verifyJWT);

router.post("/",createTweet);
router.get("/user/:username",getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router