
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'admin' | 'user';

export interface User {
  username: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    // Hardcoded credentials for demonstration
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      setUser({ username: 'admin', role: 'admin' });
      return true;
    }
    if (username.toLowerCase() === 'user' && password === 'user') {
        setUser({ username: 'user', role: 'user' });
        return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
