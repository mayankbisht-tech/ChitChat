import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  seen: boolean;
  createdAt: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  bio?: string;
}

interface ChatContextType {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  getUsers: () => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (messageData: any) => Promise<void>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  unseenMessages: Record<string, number>;
  setUnseenMessages: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  getMessages: (userId: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>({});
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("ChatProvider must be used within AuthProvider");
  }

  const { socket, axios } = authContext;

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getMessages = async (userId: string) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const sendMessage = async (messageData: any) => {
    try {
      if (!selectedUser) return;
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage: Message) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unSubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unSubscribeFromMessages();
  }, [socket, selectedUser]);

  const value: ChatContextType = {
    messages,
    users,
    selectedUser,
    getUsers,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};
