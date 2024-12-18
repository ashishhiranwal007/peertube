import express from "express";
import { auth, isCreator, isEditor } from "../middlewares/auth.js";
import { getAssignedVideos, uploadEditedVideo } from "../controllers/editorController.js";

const router = express.Router();

// router.get();

// In your routes file
router.get('/assigned-videos',  auth, isEditor, getAssignedVideos);
router.patch('/upload-edited-video', auth, isEditor, uploadEditedVideo);


export default router;