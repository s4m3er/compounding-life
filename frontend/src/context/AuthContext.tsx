import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface User {
  email: string;
  fullName: string;
  role: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await axios.post('/api/auth/login', { email, password: pass });
    const { token: jwt, email: userEmail, fullName, role, picture } = res.data;
    setToken(jwt);
    const userData = { email: userEmail, fullName, role, picture };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (email: string, pass: string, name: string) => {
    const res = await axios.post('/api/auth/register', { email, password: pass, fullName: name });
    const { token: jwt, email: userEmail, fullName, role, picture } = res.data;
    setToken(jwt);
    const userData = { email: userEmail, fullName, role, picture };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const loginWithGoogle = async (credential: string) => {
    const res = await axios.post('/api/auth/google', { credential });
    const { token: jwt, email: userEmail, fullName, role, picture } = res.data;
    setToken(jwt);
    const userData = { email: userEmail, fullName, role, picture };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        loginWithGoogle,
        logout,
        isAdmin: user?.role === 'ROLE_ADMIN'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
