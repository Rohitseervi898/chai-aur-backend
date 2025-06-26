import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylist, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.post("/",createPlaylist)
router.route("/:playlistId")
.get(getPlaylistById)
.patch(updatePlaylist)
.delete(deletePlaylist)

router.patch("/add/:videoId/:playlistId",addVideoToPlaylist)
router.patch("/remove/:videoId/:playlistId",removeVideoFromPlaylist)
router.get("/user/:userId",getUserPlaylist);

export default router