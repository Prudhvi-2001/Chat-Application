import { useEffect } from "react";
import SocketService from "../service/socketService";

const useSocket = (threadId, userId, onNewMessage) => {
  useEffect(() => {
    if (userId) {
      SocketService.connect(userId);
      SocketService.joinThread(threadId, userId);
    }

    SocketService.onNewMessage(onNewMessage);

    return () => {
      SocketService.disconnect();
    };
  }, [threadId, userId]);
};

export default useSocket;
