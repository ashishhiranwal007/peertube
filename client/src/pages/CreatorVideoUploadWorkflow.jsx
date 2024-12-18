import React, { useState } from 'react';
import { 
  CircleCheck, 
  CircleX, 
  PlayCircle,
  Check,
  ChevronsUpDown,
  XCircle,
  FileVideo,
  ImageIcon,
  UploadCloud,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const VideoUploadWorkflow = ({ setShowUploadForm }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState({
    title: '',
    description: '',
    playlist: '',
    visibility: 'private',
    videoFile: null,
    thumbnailFile: null,
    selectedEditor: null
  });
  const [editorOpen, setEditorOpen] = useState(false);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  const [playlists] = useState([
    { id: '1', name: 'Tutorials', description: 'Learning guides', videoCount: 5 },
    { id: '2', name: 'Vlogs', description: 'Personal stories', videoCount: 3 },
    { id: '3', name: 'Reviews', description: 'Product and media reviews', videoCount: 7 }
  ]);

  const [editors] = useState([
    { id: '1', name: 'John Doe', speciality: 'Cutting', availability: true },
    { id: '2', name: 'Jane Smith', speciality: 'Color Grading', availability: false },
    { id: '3', name: 'Mike Johnson', speciality: 'Sound Design', availability: true }
  ]);

  const handleInputChange = (field, value) => {
    setVideoDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (type, file) => {
    setVideoDetails(prev => ({
      ...prev,
      [`${type}File`]: file
    }));
  };

  const handleRemoveFile = (type) => {
    setVideoDetails(prev => ({
      ...prev,
      [`${type}File`]: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoDetails.videoFile || !videoDetails.thumbnailFile) {
      alert('Both video file and thumbnail are required.');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('videofile', videoDetails.videoFile);
      formData.append('thumbnail', videoDetails.thumbnailFile);
      formData.append('title', videoDetails.title);
      formData.append('description', videoDetails.description);
      // formData.append('playlist', videoDetails.playlist);
      // formData.append('visibility', videoDetails.visibility);
      
      const response = await fetch("http://localhost:3000/api/videos/creator-upload-video", {
        method: "POST",
        credentials: "include", 
        body: formData,
      });
      
      console.log(formData);
      
      const result = await response.json();
      if (response.ok) {
        alert('Video uploaded successfully!');
        setShowUploadForm(false);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('An error occurred while uploading the video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDetailsStepValid = () => {
    return videoDetails.title.trim() !== '' && 
           videoDetails.description.trim() !== '' && 
           videoDetails.visibility !== '';
  };

  const isFileUploadStepValid = () => {
    return videoDetails.videoFile !== null && 
           videoDetails.thumbnailFile !== null;
  };

  const renderDetailsStep = () => (
    <Card className="w-full max-w-2xl relative bg-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PlayCircle className="mr-2" /> Video Details
        </CardTitle>
        <CardDescription>Provide comprehensive information about your video</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <Input 
              value={videoDetails.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter engaging video title"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Visibility</Label>
            <Popover open={visibilityOpen} onOpenChange={setVisibilityOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between mt-2"
                >
                  {videoDetails.visibility}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandList>
                    {['private', 'public', 'unlisted'].map((visibility) => (
                      <CommandItem
                        key={visibility}
                        onSelect={() => {
                          handleInputChange('visibility', visibility);
                          setVisibilityOpen(false);
                        }}
                      >
                        {visibility === 'private' ? (
                          <CircleX className="mr-2 text-red-500" />
                        ) : visibility === 'public' ? (
                          <CircleCheck className="mr-2 text-green-500" />
                        ) : (
                          <CircleCheck className="mr-2 text-yellow-500" />
                        )}
                        {visibility}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div>
          <Label>Description</Label>
          <Textarea 
            value={videoDetails.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your video in detail"
            className="mt-2 h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Playlist</Label>
            <Popover open={playlistOpen} onOpenChange={setPlaylistOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between mt-2"
                >
                  {videoDetails.playlist || 'Select Playlist'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandList>
                    {playlists.map(playlist => (
                      <CommandItem
                        key={playlist.id}
                        onSelect={() => {
                          handleInputChange('playlist', playlist.name);
                          setPlaylistOpen(false);
                        }}
                      >
                        {playlist.name} ({playlist.videoCount} videos)
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
      <div className="p-4 flex justify-end">
        <Button 
          onClick={() => setStep(2)} 
          disabled={!isDetailsStepValid()}
        >
          Next: Upload Files
        </Button>
      </div>
    </Card>
  );

  const renderFileUploadStep = () => (
    <Card className="w-full max-w-2xl relative bg-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UploadCloud className="mr-2" /> Upload Files
        </CardTitle>
        <CardDescription>Upload your video and thumbnail</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="flex items-center mb-2">
            <FileVideo className="mr-2" /> Video File
          </Label>
          <div className="flex items-center space-x-2">
            <Input 
              type="file" 
              accept="video/*"
              onChange={(e) => handleFileUpload('video', e.target.files[0])}
              className="flex-grow"
            />
            {videoDetails.videoFile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveFile('video')}
              >
                <XCircle className="text-red-500" />
              </Button>
            )}
          </div>
          {videoDetails.videoFile && (
            <div className="mt-2 text-sm text-muted-foreground">
              {videoDetails.videoFile.name} - {(videoDetails.videoFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
        </div>

        <div>
          <Label className="flex items-center mb-2">
            <ImageIcon className="mr-2" /> Thumbnail
          </Label>
          <div className="flex items-center space-x-2">
            <Input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleFileUpload('thumbnail', e.target.files[0])}
              className="flex-grow"
            />
            {videoDetails.thumbnailFile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveFile('thumbnail')}
              >
                <XCircle className="text-red-500" />
              </Button>
            )}
          </div>
          {videoDetails.thumbnailFile && (
            <div className="mt-2 text-sm text-muted-foreground">
              {videoDetails.thumbnailFile.name} - {(videoDetails.thumbnailFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
        </div>
      </CardContent>
      <div className="p-4 flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setStep(1)}
        >
          Back
        </Button>
        <Button 
          onClick={() => setStep(3)}
          disabled={!isFileUploadStepValid()}
        >
          Next: Review
        </Button>
      </div>
    </Card>
  );

  const renderReviewStep = () => (
    <Card className="w-full max-w-2xl relative bg-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Check className="mr-2" /> Review Upload
        </CardTitle>
        <CardDescription>Review and confirm your video details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Title</Label>
          <p className="mt-2">{videoDetails.title}</p>
        </div>

        <div>
          <Label>Description</Label>
          <p className="mt-2">{videoDetails.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Visibility</Label>
            <p className="mt-2">{videoDetails.visibility}</p>
          </div>
          <div>
            <Label>Playlist</Label>
            <p className="mt-2">{videoDetails.playlist || 'No playlist selected'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Video File</Label>
            <p className="mt-2">
              {videoDetails.videoFile.name} - {(videoDetails.videoFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div>
            <Label>Thumbnail</Label>
            <p className="mt-2">
              {videoDetails.thumbnailFile.name} - {(videoDetails.thumbnailFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      </CardContent>
      <div className="p-4 flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setStep(2)}
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Confirm Upload'}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Progress value={(step / 3) * 100} className="mb-6" />
      
      {step === 1 && renderDetailsStep()}
      {step === 2 && renderFileUploadStep()}
      {step === 3 && renderReviewStep()}
    </div>
  );
};

export default VideoUploadWorkflow;