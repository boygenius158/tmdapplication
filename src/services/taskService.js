// src/services/taskService.js

import axiosInstance from "./axiosInstance";

// Fetch all tasks
const getTasks = async () => {
  try {
    const response = await axiosInstance.get("/tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Add a new task
const addTask = async (task) => {
  try {
    const response = await axiosInstance.post("/tasks", task);
    return response.data;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Update an existing task
const updateTask = async (taskId, updatedTask) => {
  try {
    const response = await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// taskService.js
const isCompleted = async (id) => {
  try {
    const task = { completed: true }; // or false, depending on toggle
    const response = await axiosInstance.patch(`/tasks/${id}/completed`, task);
    return response.data;
  } catch (error) {
    console.error("Error updating task completion:", error);
    throw error;
  }
};

// Export all service functions
export default {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  isCompleted,
};
