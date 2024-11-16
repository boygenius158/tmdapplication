import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status on component mount or refresh
    const token = localStorage.getItem("authToken");
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));

    if (token && userProfile) {
      setIsAuthenticated(true);
      setUser(userProfile); // Set user profile from localStorage
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
