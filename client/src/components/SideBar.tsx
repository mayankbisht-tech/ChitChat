import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const SideBar = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  if (!chatContext || !authContext) {
    return null;
  }

  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = chatContext;

  const { logout, onlineUser, authUser } = authContext;

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUser]);

  return (
    <div className={`glass-panel rounded-3xl h-full flex flex-col ${selectedUser ? 'max-md:hidden' : ''}`}>
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-white">Chats</h1>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white font-semibold transition-all"
            >
              {authUser?.fullName?.charAt(0).toUpperCase()}
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute top-12 right-0 z-20 w-48 glass-panel rounded-xl py-2 shadow-2xl animate-fadeIn">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-medium text-white truncate">{authUser?.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{authUser?.email}</p>
                  </div>
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 transition"
                    onClick={() => {
                      navigate('/profile');
                      setShowMenu(false);
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition"
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((user, index) => (
              <div
                key={index}
                className={`chat-item rounded-2xl p-3 cursor-pointer ${
                  selectedUser?._id === user._id ? 'active' : ''
                }`}
                onClick={() => {
                  setSelectedUser(user);
                  setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={user?.profilePic || assets.avatar_icon}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {onlineUser.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#141414] rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                      {unseenMessages[user._id] > 0 && (
                        <span className="flex-shrink-0 ml-2 px-2 py-0.5 text-xs font-bold text-white bg-blue-500 rounded-full">
                          {unseenMessages[user._id]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
