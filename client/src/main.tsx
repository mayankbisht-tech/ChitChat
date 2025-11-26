import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.tsx'
import './index.css'
import { SocketProvider } from '../context/SocketContext.tsx'
import App from './App.tsx'
import { ChatProvider } from '../context/ChatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
)
