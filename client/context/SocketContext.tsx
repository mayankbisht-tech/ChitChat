import { createContext, useMemo, useContext } from "react";
import { io, Socket } from 'socket.io-client';

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socket = useMemo(() => io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"), []);
    
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}