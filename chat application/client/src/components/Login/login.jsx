import React, { useState } from "react";
import "./login.css";
import videoCameraIcon from "../../assets/icons/video-camera.png";
import { LoginService } from "../../service/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
export const Login = () => {
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { loginT } = LoginService();
  const handleLogin = (event) => {
    setLoginDetails({ ...loginDetails, [event.target.id]: event.target.value });
  };
  const clickSubmit = async () => {
    const response = await loginT(loginDetails);
    login();
    if (response) {
      navigate("/chat");
    }
  };
  return (
    <div className="login-container">
      <div className="title-section">
        <img className="video-icon" src={videoCameraIcon} />
        <div className="title">Video Call</div>
      </div>
      <div className="message">Hi there! Welcome to Video Calling App</div>
      <div className="login-section">
        <label for="username">Email Id</label>
        <input
          type="email"
          id="username"
          placeholder="Enter you Email Id"
          onChange={handleLogin}
        />
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter you Password"
          onChange={handleLogin}
        />
        <button onClick={clickSubmit}>Login</button>
      </div>
    </div>
  );
};
