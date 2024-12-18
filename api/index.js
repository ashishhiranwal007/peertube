import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import editorRoutes from "./routes/editorRoutes.js";

dotenv.config();
import connectToDatabase from "./config/database.js";
connectToDatabase();

import cloudinaryConnect from "./config/cloudinary.js";
cloudinaryConnect();

const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin:"http://localhost:5173",
}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp"
}))
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/videos",videoRoutes);
app.use("/api/editor",editorRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});