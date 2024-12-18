import React from "react";

const CreatorVideoList = ({ videos, onAssignEditor, onWatchVideo, onUploadToYouTube }) => {
  const getProgress = (status) => {
    const statusSteps = ["uploaded", "assigned", "edited", "approved", "published"];
    return ((statusSteps.indexOf(status) + 1) / statusSteps.length) * 100;
  };

  return (
    <div className="container mx-auto p-5 space-y-6 overflow-y-auto max-h-screen">
      <div className="flex flex-col space-y-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="flex border rounded-lg shadow-md overflow-hidden bg-gray-800"
          >
            {/* Thumbnail */}
            <div
              className="w-40 h-40 bg-cover bg-center"
              style={{
                backgroundImage: `url(${video.thumbnail || "https://via.placeholder.com/150"})`,
              }}
            ></div>

            {/* Video Info */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                <p className="text-sm text-gray-400">
                  Uploaded on: {new Date(video.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">Status: {video.status.toUpperCase()}</p>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${getProgress(video.status)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 p-4 justify-center">
              {video.status !== "published" && (
                <>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    onClick={() => onWatchVideo(video.creatorUploadedVideo)}
                  >
                    Watch Uploaded
                  </button>
                  {video.editorUploadedVideo && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      onClick={() => onWatchVideo(video.editorUploadedVideo)}
                    >
                      Watch Edited
                    </button>
                  )}
                  {
                    video.editor ? (
                      <button
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                    onClick={() => onAssignEditor(video._id)}
                  >
                    {video.editor.name} 
                  </button>
                    ) : (
                      <button
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                    onClick={() => onAssignEditor(video._id)}
                  >
                    Assign Editor
                  </button>
                    )
                  }
                  
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    onClick={() => onUploadToYouTube(video._id)}
                  >
                    Upload to YouTube
                  </button>
                </>
              )}
              {video.status === "published" && (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  onClick={() => onWatchVideo(video.editorUploadedVideo)}
                >
                  Watch YouTube Video
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorVideoList;