import Video from '../models/videoModel.js';
import Editor from '../models/editorModel.js';
import Creator from '../models/creatorModel.js';

// Get all videos assigned to the current editor
export const getAssignedVideos = async (req, res) => {
  try {
    // Check if the user is an editor
    if (req.user.role !== 'editor') {
      return res.status(403).json({ 
        message: "Forbidden: Only editors can access assigned videos" 
      });
    }

    // Find videos assigned to the current editor
    const assignedVideos = await Video.find({ 
      editor: req.user.id, 
    //   status: { $nin: ['published'] } 
    })
    .populate('creator', 'name email avatar') // Populate creator details
    .sort({ createdAt: -1 }); // Sort by most recently created

    res.status(200).json({
      message: "Assigned videos retrieved successfully",
      results: assignedVideos.length,
      videos: assignedVideos
    });
  } catch (error) {
    console.error("Error in getting assigned videos:", error.message);
    res.status(500).json({ 
      message: "Failed to fetch assigned videos", 
      error: error.message 
    });
  }
};

// Upload edited video by an editor
export const uploadEditedVideo = async (req, res) => {
  try {
    // Check if the user is an editor
    if (req.user.role !== 'editor') {
      return res.status(403).json({ 
        message: "Forbidden: Only editors can upload edited videos" 
      });
    }

    const { videoId } = req.body;
    
    // Check if video files are uploaded
    if (!req.files || !req.files.editedVideoFile) {
      return res.status(400).json({ 
        message: "Edited video file is required" 
      });
    }

    // Upload edited video file to cloudinary
    const editedVideoFile = req.files.editedVideoFile;
    const videoUploadResponse = await cloudinaryUploader(
      editedVideoFile, 
      process.env.FOLDER_NAME
    );

    // Find and update the video
    const video = await Video.findOneAndUpdate(
      { 
        _id: videoId, 
        editor: req.user.id 
      }, 
      { 
        editorUploadedVideo: videoUploadResponse.secure_url,
        status: 'edited'
      }, 
      { new: true }
    ).populate('creator', 'name email');

    // Check if video exists and was updated
    if (!video) {
      return res.status(404).json({ 
        message: "Video not found or you are not authorized to edit this video" 
      });
    }

    // Update editor's videos list (optional, based on your current model)
    await Editor.findByIdAndUpdate(req.user.id, 
      { $addToSet: { videos: videoId } },
      { new: true }
    );

    res.status(200).json({
      message: "Edited video uploaded successfully",
      video: video
    });
  } catch (error) {
    console.error("Error in uploading edited video:", error.message);
    res.status(500).json({ 
      message: "Failed to upload edited video", 
      error: error.message 
    });
  }
};