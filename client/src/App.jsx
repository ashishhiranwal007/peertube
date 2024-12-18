import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import EditorDashboard from "./pages/EditorDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import Tasks from "./pages/editorPages/Task";
import EditorVideoList from "./components/EditorVideoList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Role-Based Protected Routes */}
        <Route path="editor-dashboard" element={
          <ProtectedRoute role="editor">
            <EditorDashboard />
          </ProtectedRoute>}>
          <Route path="" element={<EditorVideoList/>}/>
          <Route path="tasks" element={<Tasks />} />
        </Route>

        <Route path="creator-dashboard" element={
          <ProtectedRoute role="creator">
            <CreatorDashboard />
          </ProtectedRoute>}>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
