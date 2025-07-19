import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  return true ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
