import { useContext } from 'react';
import { VideoCallContext } from '../../context/VideoCallContext';

const IncomingCallNotification = () => {
  const videoCallContext = useContext(VideoCallContext);

  if (!videoCallContext) return null;

  const { videoCallState, acceptCall, rejectCall } = videoCallContext;
  const { isReceivingCall, caller } = videoCallState;

  if (!isReceivingCall || !caller) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fadeIn">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Incoming Video Call</h2>
            <p className="text-lg text-gray-300">{caller.name}</p>
            <p className="text-sm text-gray-400 mt-1">wants to video call with you</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={rejectCall}
              className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Decline
            </button>
            <button
              onClick={acceptCall}
              className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
