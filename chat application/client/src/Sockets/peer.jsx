import React, { useEffect, useMemo, useState, useCallback } from "react";

const PeerContext = React.createContext(null);
export const usePeerContext = () => React.useContext(PeerContext);
export const PeerProvider = (props) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };
  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const ans = await peer.createAnswer();
    await peer.setLocalDescription(ans);
    return ans;
  };
  const setRemoteAnswer = async (ans) => {
    await peer.setRemoteDescription(ans);
  };
  const sendStream = async (stream) => {
    const videoTrack = stream.getVideoTracks();
    for (const track of videoTrack) {
      peer.addTrack(track, stream);
    }
  };
  const handleTrackEvent = useCallback((e) => {
    const stream = streams[0];
    setRemoteStream(stream);
  }, []);

  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);
    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, [peer, handleTrackEvent]);
  return (
    <PeerContext.Provider
      value={{ peer, createOffer, createAnswer, setRemoteAnswer, sendStream ,remoteStream}}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
