// src/components/TaskList.jsx
import React, { useState, useEffect } from "react";
import { useSocket } from "./useSocket"; // Import useSocket hook
import taskService from "../services/taskService"; // Import task service

const TaskList = () => {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Inidtial Task 1", completed: false },
    { id: "2", title: "Initial Task 2", completed: true },
    { id: "3", title: "Initial Task 3", completed: false },
  ]);
  const socket = useSocket();

  useEffect(() => {
    // Fetch tasks on component mount
    const fetchTasks = async () => {
      const data = await taskService.getTasks();
      setTasks(data);
    };
    fetchTasks();

    // Listen for real-time task updates from the server via socket
    if (socket) {
      socket.on("updateTasks", (update) => {
        switch (update.type) {
          case "added":
            setTasks((prevTasks) => [...prevTasks, update.task]);
            break;
          case "updated":
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === update.task.id ? update.task : task
              )
            );
            break;
          case "deleted":
            setTasks((prevTasks) =>
              prevTasks.filter((task) => task.id !== update.taskId)
            );
            break;
          default:
            break;
        }
      });
    }

    // Clean up socket listener on component unmount
    return () => {
      if (socket) socket.off("updateTasks");
    };
  }, [socket]);

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
};

export default TaskList;
