import { useContext } from 'react'
import { Navigate, Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'
import { VideoCallProvider, VideoCallContext } from '../context/VideoCallContext'
import VideoCallModal from './components/VideoCallModal'
import IncomingCallNotification from './components/IncomingCallNotification'

function App() {
  const authContext = useContext(AuthContext)
  const authUser = authContext?.authUser
  return (
    <div className='min-h-screen'>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
        }}
      />
      <VideoCallProvider>
        <Routes>
          <Route path='/' element={authUser?<HomePage />:<Navigate to="/login"/>}/>
          <Route path='/login' element={!authUser?<LoginPage />:<Navigate to="/"/>}/>
          <Route path='/profile' element={authUser?<ProfilePage />:<Navigate to="/login"/>}/>
        </Routes>
        <VideoCallModals />
      </VideoCallProvider>
    </div>
  )
}

const VideoCallModals = () => {
  const videoCallContext = useContext(VideoCallContext);
  
  if (!videoCallContext) return null;
  
  const { videoCallState } = videoCallContext;
  
  return (
    <>
      {videoCallState.isInCall && <VideoCallModal />}
      {videoCallState.isReceivingCall && <IncomingCallNotification />}
      {videoCallState.isCalling && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="glass-panel rounded-3xl p-10 text-center shadow-2xl animate-fadeIn">
            <div className="mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto flex items-center justify-center animate-pulse shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-semibold text-white mb-2">Calling...</p>
            <p className="text-gray-400 mb-6">Waiting for response</p>
            <button
              onClick={() => videoCallContext?.cancelCall()}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition font-semibold"
            >
              Cancel Call
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App