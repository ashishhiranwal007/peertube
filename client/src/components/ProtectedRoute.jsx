import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const userRole = useSelector((state) => state.user.role);

  if (!userRole || userRole !== role) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
