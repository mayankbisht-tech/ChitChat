import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { ChatContext } from './ChatContext';
import toast from 'react-hot-toast';
import peer from '../src/service/peer';
import type { VideoCallContextType } from '../src/types/videoCall';

export const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const VideoCallProvider = ({ children }: { children: React.ReactNode }) => {
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);
  
  const [isInCall, setIsInCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [caller, setCaller] = useState<{ id: string; name: string } | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const receiverIdRef = useRef<string | null>(null);

  if (!authContext || !chatContext) return null;
  
  const { socket, authUser } = authContext;

  const getMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      toast.error('Failed to access camera/microphone');
      throw error;
    }
  };

  const initiateCall = async (receiverId: string, _receiverName: string) => {
    try {
      setIsCalling(true);
      receiverIdRef.current = receiverId;
      
      const stream = await getMediaStream();
      
      stream.getTracks().forEach(track => {
        (peer as any).peer.addTrack(track, stream);
      });
      
      socket?.emit('video-call-request', {
        callerId: authUser._id,
        receiverId,
        callerName: authUser.fullName
      });
    } catch (error) {
      setIsCalling(false);
      toast.error('Failed to initiate call');
    }
  };

  const acceptCall = async () => {
    try {
      const stream = await getMediaStream();
      
      stream.getTracks().forEach(track => {
        (peer as any).peer.addTrack(track, stream);
      });
      
      setIsReceivingCall(false);
      setIsInCall(true);

      socket?.emit('video-call-accept', {
        callerId: caller?.id
      });
    } catch (error) {
      toast.error('Failed to accept call');
    }
  };

  const rejectCall = () => {
    socket?.emit('video-call-reject', {
      callerId: caller?.id
    });
    setIsReceivingCall(false);
    setCaller(null);
  };

  const cancelCall = () => {
    if ((peer as any).peer) {
      (peer as any).peer.close();
      (peer as any).peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478"
            ]
          }
        ]
      });
    }
    
    localStream?.getTracks().forEach(track => track.stop());
    
    socket?.emit('video-call-cancelled', {
      targetId: receiverIdRef.current
    });
    
    setIsCalling(false);
    setLocalStream(null);
    receiverIdRef.current = null;
    toast('Call cancelled');
  };

  const endCall = () => {
    if ((peer as any).peer) {
      (peer as any).peer.close();
      (peer as any).peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478"
            ]
          }
        ]
      });
    }
    
    localStream?.getTracks().forEach(track => track.stop());
    
    socket?.emit('end-video-call', {
      targetId: receiverIdRef.current || caller?.id
    });
    
    setIsInCall(false);
    setIsCalling(false);
    setLocalStream(null);
    setRemoteStream(null);
    receiverIdRef.current = null;
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('incoming-video-call', ({ callerId, callerName }: { callerId: string; callerName: string }) => {
      setCaller({ id: callerId, name: callerName });
      setIsReceivingCall(true);
    });

    socket.on('video-call-accepted', async () => {
      const offer = await peer.getOffer();
      socket.emit('video-offer', {
        offer,
        receiverId: receiverIdRef.current
      });
    });

    socket.on('video-call-rejected', () => {
      toast.error('Call rejected');
      endCall();
    });

    socket.on('video-offer', async ({ offer, callerId }: { offer: any; callerId: string }) => {
      const answer = await peer.getAnswer(offer);
      socket.emit('video-answer', {
        answer,
        callerId
      });
      setIsInCall(true);
      setIsCalling(false);
    });

    socket.on('video-answer', ({ answer }: { answer: any }) => {
      peer.setLocalDescription(answer);
      setIsInCall(true);
      setIsCalling(false);
    });

    socket.on('ice-candidate', ({ candidate }: { candidate: any }) => {
      peer.addIceCandidate(candidate);
    });

    socket.on('video-call-ended', () => {
      toast('Call ended');
      endCall();
    });

    socket.on('video-call-cancelled', () => {
      toast('Call was cancelled');
      setIsReceivingCall(false);
      setCaller(null);
    });

    return () => {
      socket.off('incoming-video-call');
      socket.off('video-call-accepted');
      socket.off('video-call-rejected');
      socket.off('video-offer');
      socket.off('video-answer');
      socket.off('ice-candidate');
      socket.off('video-call-ended');
      socket.off('video-call-cancelled');
    };
  }, [socket]);

  useEffect(() => {
    peer.onIceCandidate((candidate: any) => {
      const targetId = receiverIdRef.current || caller?.id;
      if (targetId) {
        socket?.emit('ice-candidate', {
          candidate,
          targetId
        });
      }
    });

    peer.onTrack((stream: any) => {
      console.log("Remote stream received:", stream);
      setRemoteStream(stream);
    });
  }, [socket, caller]);

  const value: VideoCallContextType = {
    videoCallState: {
      isInCall,
      isCalling,
      isReceivingCall,
      caller,
      localStream,
      remoteStream
    },
    initiateCall,
    acceptCall,
    rejectCall,
    cancelCall,
    endCall,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoOff
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
};
