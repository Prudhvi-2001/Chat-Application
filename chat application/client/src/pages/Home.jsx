import React, { use, useEffect } from "react"
import { useSocket } from '../sockets/sockets';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Login } from "../components/Login/login";
import '../assets/home.css'
const HomePage = ()=>{
    const { socket } = useSocket();
    const [email, setEmail] = useState('');
    const [roomId, setRoomId] = useState('');   
    const navigate = useNavigate();
    const handleJoinRoom =  () =>{
        socket.emit('join-room', {roomId: roomId, emailId: email})
    }
    const handleRoom = useCallback(({roomId}) =>{
        navigate(`/room/${roomId}`)
    },[navigate])
    useEffect(() => {
        socket.on('joined-room', handleRoom);
        return () => {
            socket.off('joined-room', handleRoom);
        }
    }, [ socket])
    return (
        <div className="homepage-container">
            {/* <div className="input-container">
                <input type="email" placeholder="Enter your email Id" onChange={(e) => setEmail(e.target.value)}/>
                <input type="text" placeholder="Enter Room code" onChange={(e) => setRoomId(e.target.value)}/>
                <button onClick={handleJoinRoom}>Enter Room code</button>
            </div> */}

            <Login/>
        </div>
    )
}
export default HomePage