import Creator from "../models/creatorModel.js";
import Editor from "../models/editorModel.js";
import Video from "../models/videoModel.js";
import cloudinaryUploader from "../utils/cloudinaryUploader.js"

import { google } from "googleapis";
import axios from "axios";

const youtube = google.youtube("v3");

export async function uploadVideo(req, res) {
  try {
    const { title, description } = req.body;
    if (req.user.role != "creator") {
      return res.status(403).json({ message: "Forbidden: Only creators can start" });
    }

    if (!req.files || !req.files.videofile || !req.files.thumbnail) {
      return res.status(400).json({ message: "Video file and thumbnail are required" });
    }

    const videoFile = req.files.videofile;
    const thumbnailFile = req.files.thumbnail;

    const videoUploadResponse = await cloudinaryUploader(
      videoFile,
      process.env.FOLDER_NAME
    );

    const thumbnailUploadResponse = await cloudinaryUploader(
      thumbnailFile,
      process.env.FOLDER_NAME
    );

    const newVideo = new Video({
      creatorUploadedVideo: videoUploadResponse.secure_url,
      thumbnail: thumbnailUploadResponse.secure_url,
      title,
      description,
      creator: req.user.id,
    })

    await newVideo.save();

    const updatedCreator = await Creator.findByIdAndUpdate(req.user.id,
      { $push: { videos: newVideo._id } },
      { new: true }
    );

    console.log(updatedCreator);

    return res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
      creator: updatedCreator,
    });

  }
  catch (error) {
    console.error("Error in uploading video ", error.message);
    return res.status(500).json({ message: "Error in uploading video", error: error.message });
  }
}

export async function getVideos(req, res) {
  try {
    const videos = await Video.find({ creator: req.user.id })
      .populate("creator", "name username email")
      .populate("editor", "name username email")
      .select("-__v");

    // console.log(videos);
    return res.status(200).json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch videos", error: error.message });
  }
};

// Assign an editor to a video
export const getAllEditors = async (req, res) => {
  console.log("hi from edit");
  
  try {
    // Fetch all editors
    const editors = await Editor.find({})
      .select('_id name email username avatar');

    // If no editors found
    if (editors.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No editors found',
        editors: [] 
      });
    }

    // Return list of editors
    res.status(200).json({ 
      success: true,
      message: 'Editors retrieved successfully',
      editors 
    });
  } catch (error) {
    console.error('Error fetching editors:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Existing assignEditor function is already well-implemented in the provided code
export const assignEditor = async (req, res) => {
  const { videoId, editorId } = req.body;
  try {
    // Check if editor exists
    const editor = await Editor.findById(editorId);
    if (!editor) {
      return res.status(404).json({ success: false, message: "Editor not found" });
    }

    // Update the video
    const video = await Video.findByIdAndUpdate(
      videoId,
      { editor: editorId, status: "assigned" },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    // Update the editor's assigned videos
    const updatedEditor = await Editor.findByIdAndUpdate(
      editorId,
      { $push: { videos: videoId } },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Editor assigned successfully", 
      video, 
      editor: updatedEditor 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to assign editor", error: error.message });
  }
};

export const uploadVideoToYouTube = async (req, res) => {
  const { googleToken, videoId } = req.body;

  if (!googleToken || !videoId) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {

    const video = await Video.findById(videoId);


    const videoStream = await axios({
      method: "GET",
      url: video.creatorUploadedVideo,
      responseType: "stream",
    });

    // Authenticate the YouTube API client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: googleToken });

    // Upload video to YouTube

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: video.title,
          description: video.description,
          tags: ["example", "video"],
        },
        status: {
          privacyStatus: "public",
        },
      },
      media: {
        body: videoStream.data,
      },
      auth: oauth2Client,
    });

    video.status = "published";
    video.editorUploadedVideo = `https://www.youtube.com/watch?v=${response.data.id}`

    await video.save();
    console.log("upload to youtube fn")

    // Respond with the uploaded video details
    return res.status(200).json({
      message: "Video uploaded successfully",
      videoId: response.data.id,
      link: `https://www.youtube.com/watch?v=${response.data.id}`,
    });

  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Failed to upload video", error });
  }
};
