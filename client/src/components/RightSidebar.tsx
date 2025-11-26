import { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState<string[]>([]);

  if (!chatContext || !authContext) {
    return null;
  }

  const { selectedUser, messages } = chatContext;
  const { onlineUser } = authContext;

  useEffect(() => {
    setMsgImages(
      messages.filter((msg) => msg.image).map((msg) => msg.image as string)
    );
  }, [messages]);

  return selectedUser ? (
    <div className="glass-panel rounded-3xl h-full overflow-y-auto max-md:hidden">
      <div className="p-6 border-b border-white/5">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
            {onlineUser.includes(selectedUser._id) && (
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-[#141414] rounded-full shadow-lg"></span>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-white">{selectedUser.fullName}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {onlineUser.includes(selectedUser._id) ? (
                <span className="text-green-400 font-medium">Active now</span>
              ) : (
                <span className="text-gray-500">Offline</span>
              )}
            </p>
          </div>

          {selectedUser.bio && (
            <div className="w-full">
              <p className="text-sm text-gray-400 glass-input rounded-xl p-4">
                {selectedUser.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="glass-input rounded-xl p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Contact Info</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-300 truncate">{selectedUser.email}</p>
              </div>
            </div>
          </div>
        </div>

        {msgImages.length > 0 && (
          <div className="glass-input rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Shared Media</h3>
              <span className="text-xs text-gray-500">{msgImages.length} items</span>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
              {msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition"
                >
                  <img src={url} alt={`media-${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export { RightSidebar };
export default RightSidebar;
