
import { useParams } from "react-router-dom";
import ChatDetails from "../components/chatSection";
import SideLayout from "../components/sideBar";
import ChatList, { RandomProfile } from "../components/chatList";
import {  useEffect, useState } from "react";
import { LoginService } from "../service/authService";
import { ChatService } from "../service/chatService";
import { ChatHooks } from "./chatHooks";
import { useNavigate } from 'react-router-dom';

const ChatLayout = () => {
  const { id } = useParams();
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideLayout />
      <div style={{ flex: 1, display: "flex" }}>
        <div className="chat-list">
          <ChatList />
        </div>
        <div className="chat-thread">
          {id ? <ChatDetails /> : <NewChatThread/>}
        </div>
      </div>
    </div>
  );
}
export default ChatLayout;

const NewChatThread = () =>{
  return (
    <div>
      <NewChat/>
    </div>
  )
}
const NewChat = () => {
  return (
    <div className="chat-header"> 
    <div className="new-title">New Message</div>
    <SearchInput/>
    </div>
  )
}
const SearchInput = () => {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState('');
  const { searchUsers } = LoginService();
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const { createChatThread }= ChatService();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput(e.target.value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const newTimeout = setTimeout(async () => {
      if (e.target.value.trim() !== '') {
        const res = await searchUsers(e.target.value);
        setResults(res);
      } else {
        setResults([]);
      }
    }, 500);
    setDebounceTimeout(newTimeout);
  };
  const handleChatClick = async(user) => {
     setResults([]);
     const payload = {
      receiver: user._id,
     }
     const res = await createChatThread(payload);
    if(res){
    navigate(`/chat/${res._id}`)
    }
  }
 

  return (
    <div className="search-input">
      <input
        type="search"
        placeholder="Search People...."
        value={input}
        onChange={handleChange}
      />
      {results && results.length > 0 && (
        < div className="search-results">
          {results.map((user) => (
          <UserResults key={user._id} user={user} handleChatClick={handleChatClick}/>
          ))}
        </div>
      )}
    </div>
  );
};
const UserResults = ({user , handleChatClick}) =>{
  return (
    <div className="user-results" onClick={() => handleChatClick(user)}>
      {user?.username && <RandomProfile username={user.username} />}
      <div className="user-title">{user.username}</div>
    </div>
  );
}

