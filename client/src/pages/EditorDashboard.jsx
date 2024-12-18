import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/editorComponents/Navbar";
import Dock from "../components/editorComponents/Dock";

const EditorDashboard = () => {
  const [assignedVideos, setAssignedVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleVideoUpload = async (videoId, formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/editor/upload-edited-video/${videoId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Video upload failed');
      }

      const updatedVideo = await response.json();
      setAssignedVideos(prevVideos => 
        prevVideos.map(video => 
          video._id === videoId ? updatedVideo : video
        )
      );

      return updatedVideo;
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    }
  };

  const handleWatchVideo = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  if(assignedVideos == null) {
    <div>
      assinging videos
    </div>
  }

  return (
    <div className="flex min-h-screen flex-col h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
        
      </main>
      <Dock />
    </div>
  );
};

export default EditorDashboard;