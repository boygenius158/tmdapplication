"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"
import authService from "../services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, Pencil, Trash2, LogOut } from 'lucide-react'
import { useSocket } from "../context/useSocket"
import toast from "react-hot-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function HomePage() {
  const socket = useSocket()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [editingTask, setEditingTask] = useState(null)
  const [editableTaskTitle, setEditableTaskTitle] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (!socket) return

    const token = localStorage.getItem("authToken")
    socket.emit("getTasks", token)

    socket.on("fetchTask", (tasks) => {
      setTasks(tasks)
    })

    return () => {
      socket.off("fetchTask")
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return

    socket.on("taskAdded", (res) => {
      toast.success("Task Added")
      setNewTask("")
      setTasks((tasks) => [res, ...tasks])
    })

    socket.on("taskUpdated", (res) => {
      if (res.success) {
        toast.success("Marked Complete")
      } else {
        toast.error("Marked Incomplete")
      }
    })

    return () => {
      socket.off("taskAdded")
      socket.off("taskUpdated")
    }
  }, [socket])

  async function handleLogout() {
    try {
      const response = await authService.logoutUser()
      if (response.status === 200) {
        navigate("/login")
      }
    } catch (error) {
      console.error("Error during logout", error)
    }
  }

  function addTask() {
    if (!newTask.trim()) return
    const userTask = {
      title: newTask,
      isCompleted: false,
    }

    if (socket) {
      const token = localStorage.getItem("authToken")
      socket.emit("addTask", { userTask, token })
    }
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task._id !== id))
    socket.emit("deleteTask", id)
    toast.success("Deleted")
  }

  function toggleTaskCompletion(id) {
    setTasks(
      tasks.map((task) =>
        task._id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    )

    try {
      const token = localStorage.getItem("authToken")
      socket.emit("isCompleted", { token, id })
    } catch (error) {
      console.error("Error toggling task completion:", error)
    }
  }

  function startEditingTask(task) {
    setEditingTask(task)
    setEditableTaskTitle(task.title)
  }

  function handleSave(editingTask) {
    if (!editableTaskTitle) {
      console.error("No title provided")
      return
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === editingTask._id
          ? { ...task, title: editableTaskTitle }
          : task
      )
    )

    try {
      const token = localStorage.getItem("authToken")
      if (token) {
        socket.emit("handleTaskEdit", {
          editingTask,
          editableTaskTitle,
          token,
        })
      }
    } catch (error) {
      console.error("Error saving task", error)
      toast.error("An error occurred while updating the task")
    }

    setEditableTaskTitle("")
    setEditingTask(null)
  }

  const completedTasks = tasks.filter((task) => task.isCompleted).length
  const uncompletedTasks = tasks.length - completedTasks

  const chartData = [
    { name: "Completed", value: completedTasks },
    { name: "Uncompleted", value: uncompletedTasks },
  ]

  const COLORS = ["#10B981", "#EF4444"]

  if (!isAuthenticated || !socket) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user?.avatarUrl} alt={user?.email} />
                <AvatarFallback>{user?.email[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Welcome back!
                </CardTitle>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Add a new task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                  className="flex-1"
                />
                <Button onClick={addTask}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
              <Separator />
              <ScrollArea className="h-[300px] pr-4">
                <ul className="space-y-2">
                  {tasks.map((task) => (
                    <li
                      key={task._id}
                      className="flex items-center space-x-2 py-2"
                    >
                      <Checkbox
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion(task._id)}
                        className="mr-2"
                      />
                      <div className="flex-1">
                        {editingTask && editingTask._id === task._id ? (
                          <div className="flex space-x-2">
                            <Input
                              value={editableTaskTitle}
                              onChange={(e) =>
                                setEditableTaskTitle(e.target.value)
                              }
                            />
                            <Button
                              onClick={() => handleSave(task)}
                              variant="outline"
                              size="sm"
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <span
                            className={`${
                              task.isCompleted
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {task.title}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {!editingTask || editingTask._id !== task._id ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditingTask(task)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">Task Completion</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            {completedTasks} completed
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}