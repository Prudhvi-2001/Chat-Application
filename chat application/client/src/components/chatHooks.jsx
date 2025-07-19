import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../store/profileSlice";
import { ChatService } from "../service/chatService";
import { LoginService } from "../service/authService";
import { useState } from "react";

export const ChatHooks = () => {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);

  const { getThreadMessages, getAllThreads } = ChatService();
  const { getProfile } = LoginService();
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);

  const handleChatThread = async (id) => {
    const res = await getThreadMessages(id);
    setMessages(res);
  };

  const fetchProfile = async () => {
    const res = await getProfile();
    dispatch(setProfile(res));
  };

  const getThreads = async () => {
    const res = await getAllThreads();
    setThreads(res);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    handleChatThread,
    fetchProfile,
    getThreads,
    threads,
    profile,
    messages,
    clearMessages,
  };
};
