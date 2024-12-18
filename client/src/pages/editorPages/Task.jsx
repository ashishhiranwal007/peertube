import React from 'react';
import { 
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Tasks = () => {
  const tasks = [
    {
      id: 1,
      title: "Summer Vlog Edit",
      creator: "Sarah Smith",
      status: "pending",
      deadline: "2024-12-20",
      thumbnail: "/api/placeholder/320/180"
    },
    {
      id: 2,
      title: "Product Review",
      creator: "John Doe",
      status: "in_progress",
      deadline: "2024-12-15",
      thumbnail: "/api/placeholder/320/180"
    },
    {
      id: 3,
      title: "Travel Highlights",
      creator: "Mike Johnson",
      status: "completed",
      deadline: "2024-12-10",
      thumbnail: "/api/placeholder/320/180"
    }
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editing Tasks</h1>
        <div className="flex gap-4">
          <select className="bg-zinc-800 rounded-lg px-4 py-2">
            <option>All Tasks</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select className="bg-zinc-800 rounded-lg px-4 py-2">
            <option>Sort by Deadline</option>
            <option>Sort by Status</option>
            <option>Sort by Creator</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ title, creator, status, deadline, thumbnail }) => {
  const statusColors = {
    pending: "text-yellow-500",
    in_progress: "text-blue-500",
    completed: "text-green-500"
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    in_progress: <AlertCircle className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />
  };

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
      <img 
        src={thumbnail} 
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-zinc-400">Created by: {creator}</p>
        
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 ${statusColors[status]}`}>
            {statusIcons[status]}
            {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <span className="text-zinc-400">|</span>
          <span className="text-zinc-400">Due: {deadline}</span>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex-1">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex-1">
            <Upload className="w-4 h-4" />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;