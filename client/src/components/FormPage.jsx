import { useState } from 'react';
import { Upload, FileText, Image, Video, X } from 'lucide-react';

const FormPage = ({ setShowUploadForm }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail) {
      alert('Both video file and thumbnail are required.');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('videofile', videoFile);
      formData.append('thumbnail', thumbnail);
      formData.append('title', title);
      formData.append('description', description);
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

  const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (type === 'video') {
      setVideoFile(file);
    } else if (type === 'thumbnail') {
      setThumbnail(file);
    }
  };

  const clearFile = (type) => {
    if (type === 'video') {
      setVideoFile(null);
    } else if (type === 'thumbnail') {
      setThumbnail(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-6 space-y-6 relative">
      <button 
        onClick={() => setShowUploadForm(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Upload Your Video
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Share your content with the world
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <FileText className="inline-block w-4 h-4 mr-2 mb-1" />
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your video"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="videofile" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <Video className="inline-block w-4 h-4 mr-2 mb-1" />
            Video File
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="videofile"
              name="videofile"
              accept="video/*"
              onChange={(e) => handleFileChange('video', e)}
              className="hidden"
              required
            />
            <label 
              htmlFor="videofile" 
              className="flex-grow px-4 py-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {videoFile 
                ? `${videoFile.name} (${(videoFile.size / 1024 / 1024).toFixed(2)} MB)` 
                : "Select Video"}
            </label>
            {videoFile && (
              <button 
                type="button" 
                onClick={() => clearFile('video')}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label 
            htmlFor="thumbnail" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <Image className="inline-block w-4 h-4 mr-2 mb-1" />
            Thumbnail
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={(e) => handleFileChange('thumbnail', e)}
              className="hidden"
              required
            />
            <label 
              htmlFor="thumbnail" 
              className="flex-grow px-4 py-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {thumbnail 
                ? `${thumbnail.name} (${(thumbnail.size / 1024 / 1024).toFixed(2)} MB)` 
                : "Select Thumbnail"}
            </label>
            {thumbnail && (
              <button 
                type="button" 
                onClick={() => clearFile('thumbnail')}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-grow bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>{loading ? 'Uploading...' : 'Upload Video'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPage;