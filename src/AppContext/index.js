import React, { useState, createContext, useContext } from 'react';

export const AppContext = createContext({
    isLoggedIn: false,
    user: null,
    logout: () => {},
    setUser: () => {}
  });
  
  export const useApp = () => useContext(AppContext);
  
  export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
  
    const login = (userData) => {
      sessionStorage.setItem('user', JSON.stringify(userData));
      setIsLoggedIn(true);
      setUser(userData);
    };
    const logout = () => {
      sessionStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
    };
    
    
  
    return (
      <AppContext.Provider value={{ isLoggedIn, user, login, logout }}>
        {children}
      </AppContext.Provider>
    );
  };
  