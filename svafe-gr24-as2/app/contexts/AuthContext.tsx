'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserInfo, getStoredToken, getStoredUserInfo, decodeJWT, getAccountType } from '@/lib/auth';

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  accountType: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      const userInfo = decodeJWT(storedToken);
      setToken(storedToken);
      setUser(userInfo);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    const userInfo = decodeJWT(newToken);
    setToken(newToken);
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    const accountType = getAccountType(user);
    
    const normalizedRole = role.toLowerCase();
    const normalizedAccountType = accountType?.toLowerCase();
    
    if (normalizedAccountType === normalizedRole) return true;
    if (normalizedAccountType === 'personaltrainer' && normalizedRole === 'personaltrainer') return true;
    if (normalizedAccountType === 'manager' && normalizedRole === 'manager') return true;
    if (normalizedAccountType === 'client' && normalizedRole === 'client') return true;
    
    return false;
  };

  const accountType = getAccountType(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        hasRole,
        accountType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

