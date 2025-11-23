import React from 'react'
import assetsLogo from '../assets/logo.png'
import assetsMenu from '../assets/menu_icon.png'
import assetsSearch_icon from '../assets/search_icon.png'
import { useNavigate } from 'react-router-dom'
import assets, {userDummyData} from '../assets/assets'
const SideBar = ({selectedUser,setSelectedUser}: {selectedUser: boolean | any, setSelectedUser: React.Dispatch<React.SetStateAction<boolean | any>>}) => {
  const navigate = useNavigate();
  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-roll text-white ${selectedUser ? 'max-md-hidden' : ''} `}>
        <div className='pb-5'>
            
            <div className='flex justify-center items-center'>
                <img src={assetsLogo} alt="logo" className='max-w-40' />
                <div className='relative py-2 group'>
                  <img src={assetsMenu} alt="menu" className='max-h-5 cursor-pointer'/>
                  <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142]  border border-gray-600 text-gray-100 hidden group-hover:block'>
                    <p className='cursor-pointer text-sm' onClick={() => navigate('/profile')} >
                      Edit Profile
                    </p>
                    <h2 className='my-2 border-t border-gray-500'></h2>
                    <p className='cursor-pointer text-sm' onClick={() => navigate('/logout')}>Logout</p>
                  </div>  
                     
                </div>
            </div>
            <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
              <img src={assetsSearch_icon} alt="search" className='w-3' />
              <input type="text" placeholder='Search User...' className='bg-transparent border-none outline-none text-white text-xs  placeholder-[#c8c8c8] flex-1'/>
            </div>
        </div>
        <div className='flex flex-col' >
          {userDummyData.map((user,index) => (
            <div key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm  ${selectedUser?._id === user._id && 'bg-[#282142]/50' }`} onClick={() => setSelectedUser(user)}>
              <img src={user?.profilePic|| assets.avatar_icon} alt={user.fullName} className='w-[35px] aspect-[1/1] rounded-full ' />
              <div className='flex flex-col leading-5'>
                <p className='text-sm font-semibold'>{user.fullName}</p>
                <p className='text-xs text-gray-400'>{user.email}</p>
                {
                  index<3?<span className='text-xs text-green-400'>Online</span> : <span className='text-neutral-400 text-xs'>Offline</span>
                }
              </div>
              {index>2 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{index}</p>}
            </div>
          ))}
        </div>
    </div>
  )
}

export default SideBar