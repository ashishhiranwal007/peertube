// videoUploadSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoDetails: {
    name: '',
    description: '',
    playlist: '',
    madeForKids: false,
    includesPaidPromotion: false,
  },
  editor: null,
  mediaFiles: {
    video: null,
    thumbnail: null,
  },
};

const videoUploadSlice = createSlice({
  name: "videoUpload",
  initialState,
  reducers: {
    setVideoDetails: (state, action) => {
      state.videoDetails = { ...action.payload };
    },
    setEditor: (state, action) => {
      state.editor = action.payload;
    },
    setMediaFiles: (state, action) => {
      state.mediaFiles = { ...action.payload };
    },
    resetVideoUploadState: () => initialState, // Optional, to reset the state if needed
  },
});

export const { setVideoDetails, setEditor, setMediaFiles, resetVideoUploadState } = videoUploadSlice.actions;
export default videoUploadSlice.reducer;
