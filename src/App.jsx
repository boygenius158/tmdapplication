// src/App.jsx
import React from "react";
import { SocketProvider } from "./context/SocketProvider"; // Import provider
import TaskList from "./context/TaskList"; // Import task list component
import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Corrected import
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import toast, { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import authService from "./services/authService";
import ErrorBoundary from "./components/ErrorBoundary"; // Import ErrorBoundary
import HelloWorld from "./pages/HelloWorld";

const App = () => {
  return (
    <AuthProvider>
      {/* Wrap with AuthProvider */}
      <SocketProvider>
        {/* Wrap with SocketProvider */}
        <Router>
          {/* Keep only this Router */}
          <div>
            <Toaster />
            
            {/* Wrap the Routes inside the ErrorBoundary */}
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/helloworld" element={<HelloWorld />} />
                {/* Task list route */}
              </Routes>
            </ErrorBoundary>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
