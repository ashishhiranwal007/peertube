import React from "react";
import { Bell, Search } from "lucide-react";

const Navbar = () => (
  <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-lg">
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Editor Studio</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full bg-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-zinc-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-8 w-px bg-zinc-800"></div>
        <button className="flex items-center gap-2 bg-zinc-800 rounded-full p-1 pr-4 hover:bg-zinc-700 transition-colors">
          <img src="/api/placeholder/32/32" alt="Profile" className="h-8 w-8 rounded-full" />
          <span className="text-sm font-medium">John Editor</span>
        </button>
      </div>
    </div>
  </div>
);

export default Navbar;
