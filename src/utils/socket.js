import { io } from 'socket.io-client';

const socket = io('https://task-management-app-server-vsp6.onrender.com'); // Replace with your backend URL

export default socket;
