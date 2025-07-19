import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../sockets/sockets";
import { usePeerContext } from "../sockets/peer";
import ReactPlayer from 'react-player'
const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream,remoteStream } = usePeerContext();
  const [remoteEmailId, setRemoteEmailId] = useState('');
  const[useStream, setUseStream] = useState(null)
  const handlenNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId);
    },

    [socket, createOffer]
  );
  const gettingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("from", from, "offer", offer);
      const ans = await createAnswer(offer);
      setRemoteEmailId(from);
      socket.emit("call-accepted", { emailId: from, ans });
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { emailId, ans } = data;
      console.log("call got accepted", ans);
      await setRemoteAnswer(ans);
    },
    [setRemoteAnswer]
  );



  useEffect(() => {
    socket.on("user-joined", handlenNewUserJoined);
    socket.on("incoming-call", gettingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handlenNewUserJoined);
      socket.off("incoming-call", gettingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handlenNewUserJoined, gettingCall, handleCallAccepted]);
  const handleUserStream = useCallback(
    async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setUseStream(stream);
    },
    [ sendStream ]
  )
  useEffect(() =>{
    handleUserStream();
  }, [handleUserStream])

  const handleNegotiationNeeded = useCallback(
    async () => {
      const localoffer = peer.localDescription;
      socket.emit("call-user", { emailId: remoteEmailId, offer: localoffer });
    },
    [peer.localDescription, socket, remoteEmailId]
  )
  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  },[handleNegotiationNeeded])
  const sendS = async() =>{
    await sendStream(useStream)
  }
  return <div className="room-container">
    <h1>You are connected to {remoteEmailId}</h1>
    <button onClick={sendS}>send my video</button>
    <ReactPlayer url = {useStream} playing controls={true} width="100%" height="100%" muted></ReactPlayer>
    <ReactPlayer url = {remoteStream} playing controls={true} width="100%" height="100%"></ReactPlayer>

  </div>;
};

export default Room;
