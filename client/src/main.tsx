import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {AuthProvider} from '../context/AuthContext.tsx'
import './index.css'
import App from './App.tsx'
import {ChatProvider} from '../context/ChatContext.tsx'
createRoot(document.getElementById('root')!).render(
  
    <BrowserRouter>
    <AuthProvider>
<ChatProvider>
      <App />
      </ChatProvider>
    </AuthProvider>
    </BrowserRouter>
  
)
