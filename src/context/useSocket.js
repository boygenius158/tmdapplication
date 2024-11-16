// src/context/useSocket.js
import { useContext } from 'react';
import { SocketContext } from './SocketContext'; // Import the context

export const useSocket = () => {
  return useContext(SocketContext); // Return socket from context
};
