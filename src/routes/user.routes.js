import { Router } from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser, updateUserAvatar } from "../controllers/user.controller.js"
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

router.post("/changeAvatar",
    verifyJWT,
    upload.fields([{name:"avatar",maxCount:1}]),
    updateUserAvatar)

export default router 