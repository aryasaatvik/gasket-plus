'use client';

import React, { createContext, useEffect, useState, ReactNode } from 'react';

interface AuthUser {
  [key: string]: any;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch('/api/auth/verify');
      const { verified } = await res.json();

      if (verified && !verified.err) {
        setUser(verified.subject);
      } else {
        setUser(null);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Authentication error'));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const signIn = () => {
    window.location.href = '/api/auth/login';
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout');
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign out failed'));
    }
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    signIn,
    signOut,
    refresh
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}