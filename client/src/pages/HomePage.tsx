import { useContext } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  const { selectedUser }:any = useContext(ChatContext)

  return (
    <div className="w-full h-screen overflow-hidden px-4 md:px-10">
      
      <div className="h-full grid grid-cols-1 md:grid-cols-[340px_1fr] overflow-hidden">
        
        <div className="h-full overflow-hidden">
          <SideBar />
        </div>

        <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_320px] overflow-hidden">
          
          <div className="h-full overflow-hidden">
            <ChatContainer />
          </div>

          {selectedUser && (
            <div className="h-full overflow-hidden">
              <RightSidebar />
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default HomePage
