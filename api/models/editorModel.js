import mongoose from "mongoose";

const editorSchema = new mongoose.Schema({
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
        default: "editor",
        required: true,
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "videoModel",
        }
    ],
    socialLinks: [
        {
            type: String,
        }
    ]
}, { timestamps: true });

export default mongoose.model("Editor", editorSchema);