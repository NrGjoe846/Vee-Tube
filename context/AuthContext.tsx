
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import api from '../services/api';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        // Optionally verify token validity with backend here
    }
  }, []);

  const login = async (email: string, password?: string) => {
    try {
        // If password is provided, try real backend login
        if (password) {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            const userData = { id: data._id, name: data.name, email: data.email, avatar: data.avatar };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
        } else {
            // Fallback/Simulated login for simple email entry (legacy/demo)
             const mockUser = {
                id: 'user_mock',
                email,
                name: email.split('@')[0],
                avatar: 'https://picsum.photos/id/64/200/200'
            };
            setUser(mockUser);
            setIsAuthenticated(true);
        }
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      const userData = { id: data._id, name: data.name, email: data.email };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};