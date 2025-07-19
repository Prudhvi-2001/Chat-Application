import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ChatService } from "../service/chatService";
import { ChatHooks } from "./chatHooks";
import moment from "moment";
import { io } from "socket.io-client";
import { RandomProfile } from "./chatList";
import { useToast } from '../contexts/toastContext';
import { useDispatch, useSelector } from "react-redux";
import { setActiveChatThread } from "../store/profileSlice";


export const socket = io("http://localhost:8001");
const ChatDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile } = ChatHooks();
  const { getThreadMessages, sendMessage } = ChatService();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [participants, setParticipants] = useState([]);
  const { showSuccess, showError } = useToast();
  // eslint-disable-next-line no-undef


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getMessages = async () => {
    const res = await getThreadMessages(id);
    setMessages(res?.messages);
    setParticipants(res?.participants);
    const participantId = res?.participants?.filter(
      (participant) => participant?._id !== profile._id
    )[0]
      ?._id;
     dispatch(setActiveChatThread(participantId));
    
  };
  useEffect(() => {
    getMessages();
  }, [id]);
  const groupMessagesByDate = () => {
    const groupedMessages = messages.reduce((acc, message) => {
      const dateKey = moment(message.createdAt).format("YYYY-MM-DD");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(message);
      return acc;
    }, {});

    return groupedMessages;
  };
  useEffect(() => {
    if (profile?._id) {
      socket.emit("register-user", profile._id);
    }
  }, [profile]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleReceiveMessage = (messageData) => {
    console.log("📩 Message received:", messageData);
    //get the currentChatParticipantId from local storage 
    console.log("currentChatParticipantId", profile?.activeChatThread);
    if (messageData?.sender?._id === profile?.activeChatThread) {
      // showSuccess(`${messageData?.content} from ${messageData?.sender?.username}`)
      setMessages((prevMessages) => [...prevMessages, messageData]);
    }   
  }
  useEffect(() => {
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message");
    };
  }, [handleReceiveMessage, socket]);

  const formattedMessages = groupMessagesByDate();
  const formatDateHeader = (date) => {
    if (moment(date).isSame(moment(), "day")) return "Today";
    if (moment(date).isSame(moment().subtract(1, "day"), "day"))
      return "Yesterday";
    return moment(date).format("DD MMM YYYY");
  };
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    const partipantId = participants?.filter(
      (participant) => participant?._id !== profile?._id
    )[0]?._id;
    const payload = {
      receiver: partipantId,
      content: input,
    };
    const res = await sendMessage(payload);
    const newMessage = {
      ...res,
      sender: { _id: profile?._id  , username: profile?.username },
    };
    setMessages([...messages, newMessage]);
    socket.emit("send-message", newMessage, partipantId);
    setInput("");
  };

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <>
      <ChatHeader participants={participants} profile={profile} />
      <div className="chat-container" ref={chatRef}>
        {Object.keys(formattedMessages).map((date) => (
          <>
            <div className="date-header">{formatDateHeader(date)}</div>
            {formattedMessages[date].map((message, index, messagesArray) => {
              const showTime =
                index === 0 ||
                !moment(message.createdAt).isSame(
                  messagesArray[index - 1].createdAt,
                  "minute"
                ); // Check if the previous message has the same time

              return (
                <Message
                  key={message._id}
                  message={message}
                  isMine={message.sender._id === profile?._id}
                  showTime={showTime}
                />
              );
            })}
          </>
        ))}

        <ChatInputBox
          handleInputChange={handleInputChange}
          inputValue={input}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </>
  );
};

const Message = ({ message, isMine, showTime }) => {
  return (
    <>
      {showTime && (
        <span className={`${isMine ? "time-right" : "time-left"}`}>
          {moment(message?.createdAt).format("hh:mm A")} {isMine && " • You"}
        </span>
      )}
      <div className={`msg ${isMine ? "msg-right" : "msg-left"}`}>
        {message?.content}
      </div>
    </>
  );
};

const ChatInputBox = ({ handleInputChange, inputValue, handleSendMessage }) => {
  return (
    <div className="input-box">
      <input
        type="text"
        placeholder="Type a message"
        value={inputValue}
        onChange={(e) => handleInputChange(e)}
        onKeyPress={(e) => {
          if (e.key === "Enter" && inputValue.trim()) {
            handleSendMessage();
          }
        }}
        className="chat-input"
      />
      <button
        onClick={handleSendMessage}
        className="send-button"
        disabled={!inputValue.trim()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 2L11 13.5L6 9l-1 7 7-5.5L22 2z" />
        </svg>
      </button>
    </div>
  );
};

const ChatHeader = ({ participants, profile }) => {
  const username = participants?.filter(
    (participant) => participant?._id !== profile?._id
  )[0]?.username;
  return (
    <div className="chat-header">
      <div className="profile-section">
        {username && (
          <RandomProfile username={username} width="45px" height="45px" />
        )}
        <div className="profile-title">{username}</div>
      </div>
    </div>
  );
};

export default ChatDetails;
