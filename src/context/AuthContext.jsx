import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('godseye_user');
    return saved ? JSON.parse(saved) : { name: 'Demo User', email: 'user@godseye.ai', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', isAuth: true };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('godseye_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('godseye_user');
    }
  }, [user]);

  const login = (email, password) => {
    const loggedInUser = {
      name: email.split('@')[0] || 'User',
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      isAuth: true
    };
    setUser(loggedInUser);
    return true;
  };

  const register = (name, email, password) => {
    const newUser = {
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      isAuth: true
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
