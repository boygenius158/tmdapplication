import { io } from "socket.io-client";

// const socket = io("http://localhost:5000"); // Replace with your backend URL
const socket = io('https://task-management-app-server-vsp6.onrender.com'); // Replace with your backend URL

export default socket;
