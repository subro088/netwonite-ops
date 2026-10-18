import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Team } from '../types/index.ts';
import { api, storage } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  teamsLeading: Team[];
  teamsMemberOf: Team[];
  isLoading: boolean;
  isAdmin: boolean;
  isLeader: boolean;
  isViewer: boolean;
  login: (email: string, password?: string) => Promise<void>;
  switchPersona: (email: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(storage.getUser());
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [teamsLeading, setTeamsLeading] = useState<Team[]>([]);
  const [teamsMemberOf, setTeamsMemberOf] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshMe = useCallback(async () => {
    const curToken = storage.getToken();
    if (!curToken) {
      setUser(null);
      setTeamsLeading([]);
      setTeamsMemberOf([]);
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser(data.user);
      storage.setUser(data.user);
      setTeamsLeading(data.teamsLeading || []);
      setTeamsMemberOf(data.teamsMemberOf || []);
    } catch (err) {
      console.warn('Failed to verify session:', err);
      storage.clear();
      setUser(null);
      setToken(null);
      setTeamsLeading([]);
      setTeamsMemberOf([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = async (email: string, password = '123456') => {
    setIsLoading(true);
    try {
      const data = await api.login(email, password);
      storage.setToken(data.token);
      storage.setUser(data.user);
      setUser(data.user);
      setToken(data.token);
      setTeamsLeading(data.teamsLeading || []);
      setTeamsMemberOf(data.teamsMemberOf || []);
    } finally {
      setIsLoading(false);
    }
  };

  const switchPersona = async (email: string) => {
    await login(email, '123456');
  };

  const logout = () => {
    storage.clear();
    setUser(null);
    setToken(null);
    setTeamsLeading([]);
    setTeamsMemberOf([]);
  };

  const updateAvatar = async (newAvatar: string) => {
    if (!user) return;
    try {
      const res = await api.updateUserAvatar(user.id, newAvatar);
      setUser(res.user);
      storage.setUser(res.user);
    } catch (err) {
      const optimistic = { ...user, avatar: newAvatar };
      setUser(optimistic);
      storage.setUser(optimistic);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isLeader = teamsLeading.length > 0;
  const isViewer = user?.role === 'viewer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        teamsLeading,
        teamsMemberOf,
        isLoading,
        isAdmin,
        isLeader,
        isViewer,
        login,
        switchPersona,
        logout,
        refreshMe,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
