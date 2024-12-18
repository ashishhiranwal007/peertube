import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Play, 
  Upload, 
  Edit, 
  VideoIcon 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditedVideoUploadPage from '../components/editorComponents/EditedVideoUploadPage'; // Import the new component

const EditorVideoList = () => {
  const [assignedVideos, setAssignedVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    const fetchAssignedVideos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/editor/assigned-videos", {
          method: 'GET',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        setAssignedVideos(data.videos);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchAssignedVideos();
  }, []);

  const handleFileUpload = async (videoId, event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedVideoId(videoId);
      setShowUploadForm(true);
    }
  };

  const VideoPreviewDialog = ({ video }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Play className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>
        <video controls className="w-full">
          <source src={video.creatorUploadedVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading assigned videos...</p>
      </div>
    );
  }

  if (assignedVideos.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>No assigned videos</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {assignedVideos.map((video) => (
          <Card key={video._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {video.title}
                <Badge variant={
                  video.status === 'assigned' ? 'secondary' :
                  video.status === 'edited' ? 'outline' :
                  'default'
                }>
                  {video.status}
                </Badge>
              </CardTitle>
              <CardDescription>{video.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-48 object-cover rounded-md"
                />
                <div className="absolute top-2 right-2">
                  <VideoPreviewDialog video={video} />
                </div>
              </div>

              <div className="space-y-2">
                {/* Download Original */}
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => window.open(video.creatorUploadedVideo, '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Original
                </Button>

                {/* Upload Edited Video */}
                <input 
                  type="file" 
                  accept="video/*"
                  id={`upload-${video._id}`}
                  className="hidden"
                  onChange={(e) => handleFileUpload(video._id, e)}
                />
                <label htmlFor={`upload-${video._id}`} className="w-full">
                  <Button variant="default" className="w-full" >
                    <Edit className="mr-2 h-4 w-4" /> Upload Edited Video
                  </Button>
                </label>

                {/* Upload Progress */}
                {uploadProgress[video._id] && (
                  <div className="mt-2">
                    {uploadProgress[video._id].status === 'uploading' && (
                      <Progress 
                        value={uploadProgress[video._id].progress} 
                        className="w-full"
                      />
                    )}
                    {uploadProgress[video._id].status === 'success' && (
                      <Badge variant="success" className="w-full justify-center">
                        <Upload className="mr-2 h-4 w-4" /> Upload Complete
                      </Badge>
                    )}
                    {uploadProgress[video._id].status === 'error' && (
                      <Badge variant="destructive" className="w-full justify-center">
                        Upload Failed
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <EditedVideoUploadPage 
            videoId={selectedVideoId}
            onClose={() => {
              setShowUploadForm(false);
              setSelectedVideoId(null);
            }} 
          />
        </div>
      )}
    </>
  );
};

export default EditorVideoList;