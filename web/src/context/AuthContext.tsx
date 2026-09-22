import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse, ApiResponse } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (payload: { idToken: string; email?: string; name?: string; avatarUrl?: string }) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const syncToken = urlParams ? (urlParams.get('sync_token') || urlParams.get('token')) : null;

        if (syncToken) {
          try {
            const res = await api.get<ApiResponse<User>>('/auth/me', {
              headers: { Authorization: `Bearer ${syncToken}` },
            });
            if (res.data.success && res.data.data) {
              const verifiedUser = res.data.data;
              setToken(syncToken);
              setUser(verifiedUser);
              localStorage.setItem('jobtrack_access_token', syncToken);
              localStorage.setItem('jobtrack_user', JSON.stringify(verifiedUser));

              // Clean up sync parameter from address bar cleanly without page refresh
              if (urlParams) {
                urlParams.delete('sync_token');
                urlParams.delete('token');
                const remaining = urlParams.toString() ? `?${urlParams.toString()}` : '';
                window.history.replaceState(
                  {},
                  document.title,
                  window.location.pathname + remaining + window.location.hash
                );
              }
              setIsLoading(false);
              return;
            }
          } catch (syncErr) {
            console.warn('Cross-origin token sync failed or expired', syncErr);
          }
        }

        const savedToken = localStorage.getItem('jobtrack_access_token');
        const savedUser = localStorage.getItem('jobtrack_user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem('jobtrack_user');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });

    if (response.data.success && response.data.data) {
      const authData = response.data.data;
      setToken(authData.accessToken);
      setUser(authData.user);
      localStorage.setItem('jobtrack_access_token', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('jobtrack_refresh_token', authData.refreshToken);
      }
      localStorage.setItem('jobtrack_user', JSON.stringify(authData.user));
    } else {
      throw new Error(response.data.error?.message || 'Login failed');
    }
  };

  const loginWithGoogle = async (payload: { idToken: string; email?: string; name?: string; avatarUrl?: string }) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/google', payload);

    if (response.data.success && response.data.data) {
      const authData = response.data.data;
      setToken(authData.accessToken);
      setUser(authData.user);
      localStorage.setItem('jobtrack_access_token', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('jobtrack_refresh_token', authData.refreshToken);
      }
      localStorage.setItem('jobtrack_user', JSON.stringify(authData.user));
    } else {
      throw new Error(response.data.error?.message || 'Google authentication failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (response.data.success && response.data.data) {
      const authData = response.data.data;
      setToken(authData.accessToken);
      setUser(authData.user);
      localStorage.setItem('jobtrack_access_token', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('jobtrack_refresh_token', authData.refreshToken);
      }
      localStorage.setItem('jobtrack_user', JSON.stringify(authData.user));
    } else {
      throw new Error(response.data.error?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jobtrack_access_token');
    localStorage.removeItem('jobtrack_refresh_token');
    localStorage.removeItem('jobtrack_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
