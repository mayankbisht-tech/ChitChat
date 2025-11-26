import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import peer from '../service/peer';
const RoomPage = () => {
    const socket = useSocket();
    const [_myStream, setMyStream] = useState<MediaStream | null>(null);
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
    const [_remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const myVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    const handleCallUser = useCallback(async () => {
        if (!socket) return;
        
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        
        stream.getTracks().forEach(track => {
            peer.peer.addTrack(track, stream);
        });

        const offer=await peer.getOffer();
        socket.emit("user:join",{to:remoteSocketId,offer})
        setMyStream(stream);
        if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
        }
    }, [remoteSocketId, socket]);

    const handleUserJoined = useCallback(({ email, id }: { email: string; id: string }) => {
        console.log(`email ${email} joined the room`);
        setRemoteSocketId(id);
    }, []);

    const handleIncomingCall=useCallback(async({from,offer}: {from: string; offer: RTCSessionDescriptionInit})=>{
        if (!socket) return;
        
        setRemoteSocketId(from)
        const stream=await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        })
        
        stream.getTracks().forEach(track => {
            peer.peer.addTrack(track, stream);
        });

        setMyStream(stream)
        const ans=await peer.getAnswer(offer)
        socket.emit("call:accepted",{to:from,ans})
    },[socket])

    const handleCallAccepted=useCallback(({ans}: {from: string; ans: RTCSessionDescriptionInit})=>{
        peer.setLocalDescription(ans)
        console.log("call accepted")
    },[])

    const handleIceCandidate = useCallback(({to, candidate}: {to: string; candidate: RTCIceCandidate}) => {
        if (!socket) return;
        socket.emit("ice-candidate", {to, candidate});
    }, [socket]);

    const handleRemoteIceCandidate = useCallback(({candidate}: {from: string; candidate: RTCIceCandidateInit}) => {
        peer.addIceCandidate(candidate);
    }, []);

    useEffect(() => {
        if (!socket) return;
        
        socket.on("user:joined", handleUserJoined);
        socket.on("incoming:call",handleIncomingCall)
        socket.on("call:accepted",handleCallAccepted)
        socket.on("ice-candidate", handleRemoteIceCandidate);
        
        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incoming:call",handleIncomingCall);
            socket.off("call:accepted",handleCallAccepted);
            socket.off("ice-candidate", handleRemoteIceCandidate);
        }
    }, [socket, handleUserJoined, handleCallAccepted, handleIncomingCall, handleRemoteIceCandidate]);

    useEffect(() => {
        peer.onIceCandidate((candidate) => {
            if (remoteSocketId) {
                handleIceCandidate({to: remoteSocketId, candidate});
            }
        });

        peer.onTrack((stream) => {
            console.log("Remote stream received:", stream);
            setRemoteStream(stream);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
        });
    }, [remoteSocketId, handleIceCandidate]);

    return (
        <div style={{display: "flex", gap: "20px"}}>
            <div>
                <h1>My Video</h1>
                <video
                    ref={myVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: "400px", height: "300px", background: "#000" }}
                />
            </div>
            <div>
                <h1>Room Page</h1>
                <h4>{remoteSocketId ? "Connected" : "no one in room"}</h4>

                {remoteSocketId && <button onClick={handleCallUser}>Call</button>}

                <h2>Remote Video</h2>
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{ width: "400px", height: "300px", background: "#000" }}
                />
            </div>
        </div>
    );
};

export default RoomPage;
