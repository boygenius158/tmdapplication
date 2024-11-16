// src/context/SocketProvider.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { SocketContext } from './SocketContext'; // Import the context

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the Socket.io server
    // const newSocket = io('http://localhost:5000'); // Replace with your backend URL
    const newSocket = io('https://task-management-app-server-vsp6.onrender.com'); // Replace with your backend URL
    setSocket(newSocket);

    // Clean up socket on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

