import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface FinancialHealthAssessment {
  overallScore: number;
  rating: string;
  targetNetWorthForAge: number;
  recommendedEquityPercent: number;
  recommendedDebtPercent: number;
  recommendedMonthlySip: number;
  recommendedTermInsurance: number;
  mungerInsight: string;
}

export interface UserProfile {
  id?: number;
  email: string;
  fullName: string;
  role: string;
  provider?: string;
  picture?: string;
  age?: number;
  gender?: string;
  monthlyIncome?: number;
  currentInvestments?: number;
  emergencyFundMonths?: number;
  primaryGoal?: string;
  onboardingCompleted?: boolean;
  assessment?: FinancialHealthAssessment;
}

export interface User {
  email: string;
  fullName: string;
  role: string;
  picture?: string;
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  fetchProfile: () => Promise<UserProfile | null>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      fetchProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUserProfile(null);
    }
  }, [token]);

  const fetchProfile = async (): Promise<UserProfile | null> => {
    try {
      const res = await axios.get<UserProfile>('/api/user/profile');
      setUserProfile(res.data);
      if (user && res.data.onboardingCompleted !== user.onboardingCompleted) {
        const updatedUser = { ...user, onboardingCompleted: res.data.onboardingCompleted };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return res.data;
    } catch {
      return null;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const res = await axios.put<UserProfile>('/api/user/profile', data);
    setUserProfile(res.data);
    if (user) {
      const updatedUser = {
        ...user,
        fullName: res.data.fullName,
        onboardingCompleted: res.data.onboardingCompleted
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return res.data;
  };

  const login = async (email: string, pass: string) => {
    const res = await axios.post('/api/auth/login', { email, password: pass });
    const { token: jwt, email: userEmail, fullName, role, picture, onboardingCompleted } = res.data;
    setToken(jwt);
    const userData = { email: userEmail, fullName, role, picture, onboardingCompleted };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (email: string, pass: string, name: string) => {
    const res = await axios.post('/api/auth/register', { email, password: pass, fullName: name });
    const { token: jwt, email: userEmail, fullName, role, picture, onboardingCompleted } = res.data;
    setToken(jwt);
    const userData = { email: userEmail, fullName, role, picture, onboardingCompleted: false };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const loginWithGoogle = async (credential: string) => {
    const res = await axios.post('/api/auth/google', { credential });
    const { token: jwt, email: userEmail, fullName, role, picture, onboardingCompleted } = res.data;
    setToken(jwt);
    const userData = { email: userEmail, fullName, role, picture, onboardingCompleted };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        token,
        login,
        register,
        loginWithGoogle,
        fetchProfile,
        updateProfile,
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
