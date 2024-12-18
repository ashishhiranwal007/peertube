import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    },
    role: {
        type: String,
        default: "creator",
        required: true,
    },
    youtubeChannelId: {
        type: String,
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "videoModel"
        }
    ],
    preferredEditors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "editorModel"
        }
    ],
    socialLinks: [
        {
            type: String
        }
    ]
}, { timestamps: true });

export default mongoose.model("Creator", userSchema);
