import React from "react";
import { 
  Video,
  Upload,
  Home,
  FolderOpen,
  Settings,
  Clock,
  Youtube,
  PlusCircle,
  Bell,
  Search
} from 'lucide-react';

const Dock = () => {
  const links = [
    { title: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/editor-dashboard" },
    { title: "Tasks", icon: <Video className="h-5 w-5" />, href: "/editor-dashboard/tasks" },
    { title: "Files", icon: <FolderOpen className="h-5 w-5" />, href: "/editor-dashboard/files" },
    { title: "Upload", icon: <Upload className="h-5 w-5" />, href: "/editor-dashboard/uploads" },
    { title: "History", icon: <Clock className="h-5 w-5" />, href: "/editor-dashboard/history" },
  ];

  const DockItem = ({ title, icon, href }) => (
    <a href={href} className="group relative flex flex-col items-center">
      <div className="p-3 rounded-full hover:bg-zinc-800 transition-colors">
        {icon}
      </div>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 transition-all group-hover:scale-100">
        <div className="bg-zinc-800 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
          {title}
        </div>
      </div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-all" />
    </a>
  );

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="bg-zinc-900/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-zinc-800">
        <div className="flex items-center gap-2">
          {links.map((link, index) => (
            <DockItem key={index} {...link} />
          ))}
          <div className="w-px h-8 bg-zinc-800 mx-2" />
          <button className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors group relative">
            <PlusCircle className="h-5 w-5" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 transition-all group-hover:scale-100">
              <div className="bg-zinc-800 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                New Task
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dock;
