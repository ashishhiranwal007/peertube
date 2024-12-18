import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreatorVideoList from "../components/CreatorVideoList.jsx";
import VideoUploadWorkflow from "./CreatorVideoUploadWorkflow.jsx";
import EditorAssignmentModal from "../components/EditorAssignmentModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/userSlice";
import { MdMenuOpen } from "react-icons/md";

// Sidebar Component
import { IoHomeOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import { Button } from "../components/ui/button.jsx";

// Sidebar Menu Items
const menuItems = [
  {
    icons: <IoHomeOutline size={30} />,
    label: "Home",
  },
  {
    icons: <MdOutlineDashboard size={30} />,
    label: "Dashboard",
  },
  {
    icons: <CiSettings size={30} />,
    label: "Setting",
  },
];

// Sidebar Component
function Sidebar({ open, setOpen }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      dispatch(logout());
    } catch (e) {
      console.log(e);
      console.log("logout fail");
    }
  };

  return (
    <nav
      className={`shadow-md h-screen p-2 flex flex-col duration-500 bg-zinc-900 text-zinc-50 border-r border-zinc-400 z-20 absolute md:relative ${
        open ? "w-60" : "w-16"
      }`}
    >
      {/* Header */}
      <div className={`h-20 flex justify-between items-center px-2 py-2`}>
        <div className={"rounded-md w-10"}>
          <img
            src={`https://www.youtube.com/s/desktop/208496d9/img/logos/favicon_144x144.png`}
            alt="Logo"
            className={`${open ? "w-10" : "w-16"} rounded-md`}
          />
        </div>
      </div>

      {/* Body */}
      <ul className="flex-1 text-zinc-50">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="px-3 py-2 my-2 hover:bg-blue-800 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group"
          >
            <div>{item.icons}</div>
            <p
              className={`${
                !open && "w-0 -translate-x-4"
              } duration-500 overflow-hidden`}
            >
              {item.label}
            </p>
            <p
              className={`${
                open && "hidden"
              } absolute shadow-md rounded-md w-0 p-0 text-zinc-50 duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16`}
            >
              {item.label}
            </p>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex flex-col items-start gap-2 px-3 py-2">
        <div className="flex gap-3">
          <div>
            <FaUserCircle size={30} />
          </div>
          <div
            className={`leading-5 ${
              !open && "w-0 -translate-x-4"
            } duration-500 overflow-hidden`}
          >
            <p>{user ? user.username : 'User'}</p>
            <span className="text-xs">{user ? user.email : 'user@example.com'}</span>
          </div>
        </div>
        <button className="" onClick={() => setShow(!show)}>
          Log Out
        </button>
      </div>

      {show && (
        <div
          onClick={() => setShow(!show)}
          className="w-screen h-screen absolute bg-black/20 flex items-center justify-center backdrop-blur-md"
        >
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      )}
    </nav>
  );
}

// Main CreatorDashboard Component
export default function CreatorDashboard() {
  const navigate = useNavigate();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for editor assignment modal
  const [showEditorAssignmentModal, setShowEditorAssignmentModal] = useState(false);
  const [selectedVideoForEditor, setSelectedVideoForEditor] = useState(null);

  const { googleToken } = useSelector((state) => state.user);

  // Fetching video data
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "http://localhost:3000/api/videos/creator-get-videos",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch videos");
        }
        console.log(data.videos);
        setVideoData(data.videos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Modified handleAssignEditor to show modal
  const handleAssignEditor = (videoId) => {
    setSelectedVideoForEditor(videoId);
    setShowEditorAssignmentModal(true);
  };

  // New method to handle actual editor assignment
  const assignEditorToVideo = async (videoId, editorId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/videos/assign-editor`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoId: videoId,
            editorId: editorId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to assign editor");
      }

      // Update UI after successful editor assignment
      setVideoData((prev) =>
        prev.map((video) =>
          video._id === videoId ? { ...video, status: "assigned", editor: editorId } : video
        )
      );
    } catch (err) {
      console.error("Error assigning editor:", err.message);
      alert("Failed to assign editor");
    }
  };

  // Watch Video handler
  const handleWatchVideo = (videoUrl) => {
    window.open(videoUrl, "_blank");
  };

  const handleUploadToYouTube = async (videoId) => {
    try {
      console.log(videoId, "-", googleToken);
      const res = await fetch(
        `http://localhost:3000/api/videos/creator-upload-to-youtube`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoId,
            googleToken,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload to YouTube");
      }

      // Update the status of the video in the UI
      setVideoData((prev) =>
        prev.map((video) =>
          video._id === videoId ? { ...video, status: "published" } : video
        )
      );

      alert("Video successfully uploaded to YouTube!");
    } catch (err) {
      console.error("Error uploading to YouTube:", err.message);
      alert("Failed to upload video to YouTube.");
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Section */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className={`flex justify-between ${
            sidebarOpen ? "ps-[240px] md:px-8 " : "ps-[85px] md:px-8"
          } transition-all  py-4 border-b border-zinc-400`}
        >
          <div>
            <MdMenuOpen
              size={34}
              className={`cursor-pointer ${!sidebarOpen && "rotate-180"}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-zinc-50 text-zinc-950 px-4 py-2 rounded"
          >
            <span>Upload Video</span>
          </button>
        </header>

        {/* Content */}
        <div className="w-full h-screen flex items-start justify-center">
          <div className="flex-1 flex justify-center items-center overflow-y-auto">
            {loading ? (
              <p>Loading videos...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : videoData.length === 0 ? (
              <p>No videos found. Start uploading!</p>
            ) : (
              <div className="w-full h-[calc(100vh-4rem)] overflow-y-auto px-4">
                <CreatorVideoList
                  videos={videoData}
                  onAssignEditor={handleAssignEditor}
                  onWatchVideo={handleWatchVideo}
                  onUploadToYouTube={handleUploadToYouTube}
                />
              </div>
            )}
          </div>

          <div
            className={`w-full h-screen absolute flex  items-center justify-center ${
              showUploadForm ? " bg-black/20 backdrop-blur-md" : "hidden"
            }`}
          >
            <div className="flex-1 flex justify-center items-center absolute z-10">
              {showUploadForm ? (
                <VideoUploadWorkflow setShowUploadForm={setShowUploadForm} />
              ) : (
                " "
              )}
            </div>
          </div>
        </div>

        {/* Editor Assignment Modal */}
        {showEditorAssignmentModal && (
          <EditorAssignmentModal
            videoId={selectedVideoForEditor}
            onClose={() => {
              setShowEditorAssignmentModal(false);
              setSelectedVideoForEditor(null);
            }}
            onAssign={assignEditorToVideo}
          />
        )}
      </main>
    </div>
  );
}