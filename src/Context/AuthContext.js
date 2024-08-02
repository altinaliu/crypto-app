
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = (username, password) => {
    const token = localStorage.getItem('token');
    if (username === 'user' && password === 'user') {
      localStorage.setItem('token', 'dummy-token'); 
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = (username, password) => {
    if (username && password) {
      localStorage.setItem('token', 'dummy-token');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
