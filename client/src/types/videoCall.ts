export interface VideoCallState {
  isInCall: boolean;
  isCalling: boolean;
  isReceivingCall: boolean;
  caller: {
    id: string;
    name: string;
  } | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export interface VideoCallContextType {
  videoCallState: VideoCallState;
  initiateCall: (receiverId: string, receiverName: string) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  cancelCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  isMuted: boolean;
  isVideoOff: boolean;
}
