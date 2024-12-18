import express from "express";
import { auth, isCreator, isEditor } from "../middlewares/auth.js";
import { getVideos, uploadVideo, assignEditor, uploadVideoToYouTube, getAllEditors } from "../controllers/videoController.js";


const router = express.Router();

router.post("/creator-upload-video", auth, isCreator, uploadVideo);
router.get("/creator-get-videos", auth, getVideos);
router.get('/getEditors', getAllEditors);
router.post("/assign-editor", auth, assignEditor);

router.post("/creator-upload-to-youtube", uploadVideoToYouTube);

export default router;