import { Router } from "express"
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changePassword, 
    getCurrentUser, 
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory 
} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/Auth.middleware.js"

const router = Router()

router.post("/register", 
    upload.fields([
        {
            name:'avatar',
            maxCount:1
        },
        {
            name:'coverImage',
            maxCount:1
        }
    ]),
    registerUser
)

router.post("/login",loginUser);

//secure routes
router.post("/logout",verifyJWT,logoutUser)

router.post("/refresh-token",refreshAccessToken)

router.post("/change-password",verifyJWT,changePassword)

router.post("current-user",getCurrentUser)

router.patch("update-account",verifyJWT,updateAccountDetails)

router.patch("/changeAvatar",
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
)

router.post("/changecoverImage",
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
)

router.get("/c/:username", verifyJWT, getUserChannelProfile)

router.get("/watchHistory", verifyJWT, getWatchHistory)

export default router 