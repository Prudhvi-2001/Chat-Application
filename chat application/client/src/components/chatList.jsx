import React, { useEffect, useState} from 'react';
import '../assets/home.css';
import { ChatHooks } from './chatHooks';
import { useNavigate } from 'react-router-dom';
import { socket } from './chatSection';
const ChatList = () => {

   const { getThreads, fetchProfile, threads, profile } = ChatHooks();
   const [threadList , setThreadList ] =  useState(threads);

   
    useEffect(() => {
        getThreads();
        fetchProfile();
    }, []);

    const navigate = useNavigate();
    const handleChatSelect = async (threadId) => {
         navigate(`/chat/${threadId}`);
        const updatedThreads = threadList.map((thread) => {
            if (thread._id === threadId) {
                return { ...thread, unreadCount: 0 };
            }
            return thread;
        }
        );
        setThreadList(updatedThreads);
    };
   //update the thread when count chnages
   useEffect(() => {
    socket.on("update-count", ({ threadId }) => {
        setThreadList(prev => prev.map(thread =>
            thread._id === threadId
                ? { ...thread, unreadCount: 0 }
                : thread
        ));
    });

    return () => {
        socket.off("messages-read");
    };
}, []);


    
    useEffect(() => {
     setThreadList(threads);
    },[threads])

    const filteredThreads = threadList?.map((thread) => {
        const filteredParticipants = thread.participants.filter(
            (participant) => participant._id !== profile._id
        );

        return {
            ...thread,
            participants: filteredParticipants,
        };
    });
    

    return (
      <>
        <div className="chat-section">
          <div className="chat-title">Chats</div>
          <div className="create-chat">
            <svg
              class="feather feather-edit"
              fill="none"
              height="22"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="22"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
        </div>
        <div className="chat-list">
          {filteredThreads?.map((thread) => {
            const otherParticipant = thread.participants.find(
              (participant) => participant._id !== profile._id
            );
            if (otherParticipant) {
              return (
                <div key={thread._id} className="chat-thread-container">
                  <ChatThread
                    thread = {thread}
                    username={otherParticipant.username}
                    otherParticipant = {otherParticipant}
                    id={thread._id}
                    unreadCount={thread.unreadCount}
                    lastMessage={thread?.lastMessagePreview?.content}
                    handleChatSelect = {handleChatSelect}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </>
    );
};

const ChatThread = ({ username, id, unreadCount, lastMessage, handleChatSelect }) => {
     //i should see the count if send the message to the other participant
    return (
      <div className='thread-container' onClick={() => 
        handleChatSelect(id)}>
        <div className="single-thread">
            <RandomProfile username={username} />
            <div className="thread">
                <div className="title">{username}</div>
                <div className="last-message">{ lastMessage }</div>
            </div>
        </div>
        { unreadCount > 0 && (
        <div className="unread-count">
            {unreadCount}
        </div>
       )}
      </div>
    );
};

export const getDeterministicColor = (input) => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = (hash & 0x00FFFFFF)
        .toString(16)
        .padStart(6, '0');
    return `#${color}`;
};

export const RandomProfile = ({ username , width = '32px', height = '32px'}) => {
    const color = getDeterministicColor(username); 
    const initial = username.charAt(0).toUpperCase();

    return (
        <div className="profile" style={{ backgroundColor: color, width: width, height: height }}>
            <span className="initial">{initial}</span>
        </div>
    );
};

export default ChatList;
  