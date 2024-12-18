import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';

const EditorAssignmentModal = ({ videoId, onClose, onAssign }) => {
  const [editors, setEditors] = useState([]);
  const [selectedEditor, setSelectedEditor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/videos/getEditors');
        if (!response.ok) {
          throw new Error('Failed to fetch editors');
        }
        const data = await response.json();
        setEditors(data.editors);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEditors();
  }, []);

  const handleAssign = () => {
    if (selectedEditor) {
      onAssign(videoId, selectedEditor);
      onClose();
    }
  };

  if (loading) return <div>Loading editors...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Assign Editor</h2>
        <select
          value={selectedEditor}
          onChange={(e) => setSelectedEditor(e.target.value)}
          className="w-full p-2 mb-4 bg-zinc-700 text-white rounded"
        >
          <option value="">Select an Editor</option>
          {editors.map((editor) => (
            <option key={editor._id} value={editor._id}>
              {editor.name} | {editor.email}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="text-white border border-zinc-600"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={!selectedEditor}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorAssignmentModal;