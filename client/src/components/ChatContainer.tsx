import { useContext, useEffect, useRef, useState } from 'react';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { VideoCallContext } from '../../context/VideoCallContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);
  const videoCallContext = useContext(VideoCallContext);

  if (!chatContext || !authContext) {
    return null;
  }

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = chatContext;
  const { authUser, onlineUser } = authContext;

  const [input, setInput] = useState('');
  const scrollEnd = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return null;
    await sendMessage({ text: input.trim() });
    setInput('');
  };

  const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="glass-panel rounded-3xl h-full flex flex-col overflow-hidden">

      <div className="flex items-center gap-4 px-6 py-3 border-b border-white/5 flex-shrink-0">
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-2 hover:bg-white/5 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative">
          <img
            src={selectedUser.profilePic}
            alt=""
            className="w-11 h-11 rounded-full object-cover"
          />
          {onlineUser.includes(selectedUser._id) && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#141414] rounded-full"></span>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-white">{selectedUser.fullName}</h3>
          <p className="text-xs text-gray-400">
            {onlineUser.includes(selectedUser._id) ? 'Active now' : 'Offline'}
          </p>
        </div>

        {onlineUser.includes(selectedUser._id) && videoCallContext && (
          <button
            onClick={() => videoCallContext.initiateCall(selectedUser._id, selectedUser.fullName)}
            className="p-3 bg-white/10 hover:bg-white/15 rounded-xl transition-all"
            title="Start video call"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg font-medium text-gray-400">No messages yet</p>
            <p className="text-sm text-gray-500">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isOwn = message.senderId === authUser._id;
              return (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {!isOwn && (
                    <img
                      src={selectedUser?.profilePic }
                      alt=""
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}

                  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    {message.image ? (
                      <div className={`rounded-2xl overflow-hidden ${isOwn ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                        <img src={message.image} alt="" className="max-w-[280px] w-full" />
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          isOwn
                            ? 'message-sent text-white rounded-br-sm'
                            : 'message-received text-gray-200 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm break-words">{message.text}</p>
                      </div>
                    )}
                    <span className="text-xs text-gray-500 mt-1 px-1">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </div>

                  {isOwn && (
                    <img
                      src={authUser?.profilePic }
                      alt=""
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                </div>
              );
            })}
            <div ref={scrollEnd}></div>
          </div>
        )}
      </div>

      <div className="p-2.5 border-t border-white/5 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input type="file" accept="image/png,image/jpeg" id="image" hidden onChange={handleSendImage} />
          <label htmlFor="image" className="p-3 hover:bg-white/5 rounded-xl cursor-pointer transition">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </label>

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 glass-input rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
          />

          <button
            type="submit"
            className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim()}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full glass-panel rounded-3xl max-md:hidden">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome to ChitChat</h2>
        <p className="text-gray-400 max-w-md">
          Select a conversation from the sidebar to start messaging
        </p>
      </div>
    </div>
  );
};

export default ChatContainer;
