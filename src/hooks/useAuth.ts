import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  provider: 'email' | 'google';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const STORAGE_KEY = 'anomalyguard-user';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as User;
        setAuthState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Basic validation
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Simulate successful login
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true, isLoading: false });

    return { success: true };
  }, []);

  const signUp = useCallback(async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email address' };
    }

    // Simulate successful registration
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true, isLoading: false });

    return { success: true };
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    // Simulate Google OAuth
    const email = window.prompt('Enter your Google email address:');
    
    if (!email) {
      return { success: false, error: 'Sign in cancelled' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email address' };
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const user: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true, isLoading: false });

    return { success: true };
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return {
    ...authState,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
}

export default useAuth;
