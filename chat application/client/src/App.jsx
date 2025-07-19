import { Login } from "./components/Login/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatLayout from "./components/ChatLayout";
import ChatDetails from "./components/chatSection";
import { ToastProvider } from "./contexts/toastContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <ToastContainer />
    <Routes>
      {/* Login Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes for Chat */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<ChatLayout />}>
          <Route path=":id" element={<ChatLayout />} />
          <Route path="new" element = {<ChatDetails/>}></Route>
        </Route>
      </Route>
    </Routes>
    </ToastProvider>
  </AuthProvider>
  );
}

export default App;
