import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Upload, FileVideo, X } from "lucide-react";

const EditedVideoUploadPage = ({ videoId, onClose }) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a video file to upload",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('editedVideoFile', file);
    formData.append('videoId', videoId);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create a controller to track upload progress
      const controller = new AbortController();
      const signal = controller.signal;

      // Track upload progress
      const uploadTracker = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percentComplete);
          }
        };
        
        signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new Error('Upload cancelled'));
        });
      });

      // Fetch API call
      const response = await Promise.race([
        fetch('http://localhost:3000/api/editor/upload-edited-video', {
          method: 'POST',
          body: formData,
          signal: signal
        }),
        uploadTracker
      ]);

      // Check response status
      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Success",
          description: "Video uploaded successfully",
          variant: "default"
        });

        // Optional: additional success handling
        onClose && onClose();
      } else {
        const errorResponse = await response.json();
        
        toast({
          title: "Upload Failed",
          description: errorResponse.message || "Failed to upload video",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Video upload error:', error);
      
      if (error.name === 'AbortError') {
        toast({
          title: "Upload Cancelled",
          description: "Upload was cancelled",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Upload Edited Video
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Upload the edited version of the video
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-4">
          <Label htmlFor="video-file">Video File</Label>
          <Input 
            id="video-file" 
            type="file" 
            accept="video/*"
            disabled={isUploading}
            onChange={handleFileChange}
            className="hidden" 
          />
          <label 
            htmlFor="video-file" 
            className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            {file ? (
              <div className="flex items-center space-x-2">
                <FileVideo className="h-8 w-8 text-primary" />
                <div>
                  <p>{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Drag and drop or click to upload
                </p>
              </div>
            )}
          </label>

          {isUploading && (
            <Progress value={uploadProgress} className="w-full" />
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditedVideoUploadPage;