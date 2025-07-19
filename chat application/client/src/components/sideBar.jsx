import React, { useState } from "react";
import "../assets/home.css";
import videoCameraIcon from "../assets/icons/video-camera.png";
import { ChatHooks } from "./chatHooks";
import { RandomProfile } from "./chatList";

const SidebarIcon = ({ icon, selectedIcon, onClick, children }) => {
    return (
        <div className="icon-container" onClick={() => onClick(icon)}>
            <div className={`icon ${selectedIcon === icon ? "active" : ""}`}>
                {children}
            </div>
            {selectedIcon === icon && <div className="side-border"></div>}
        </div>
    );
};

const SideLayout = () => {
    const [activeIcon, setActiveIcon] = useState("chat");
    const { profile } = ChatHooks();
    return (
        <div className="sidebar">
            <img className="video" src={videoCameraIcon} alt="Video" />
            <SidebarIcon icon="chat" selectedIcon={activeIcon} onClick={setActiveIcon}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30"
                    height="30"
                    fill={activeIcon === "chat" ? "rgb(170, 119, 226)" : "currentColor"}
                >
                    <path d="M12 3C6.48 3 2 6.91 2 12c0 1.94.56 3.73 1.53 5.25L2 21l4.05-1.11C7.22 20.3 9.5 21 12 21c5.52 0 10-3.91 10-9s-4.48-9-10-9zm-4 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </SidebarIcon>

        <div className="sidebar-profile">
         <RandomProfile username={profile?.username} />       
        </div>
        </div>
    );
};
export default SideLayout

// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <div style={{ width: "250px", background: "#333", color: "white", height: "100vh", padding: "20px" }}>
//       <h2>Chats</h2>
//       <ul>
//         <li><Link to="/chat/1" style={{ color: "white" }}>Chat 1</Link></li>
//         <li><Link to="/chat/2" style={{ color: "white" }}>Chat 2</Link></li>
//         <li><Link to="/chat/3" style={{ color: "white" }}>Chat 3</Link></li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
