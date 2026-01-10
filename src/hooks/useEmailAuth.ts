import { useState, useEffect, useCallback } from 'react';

export interface EmailUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  createdAt: string;
}

interface AuthState {
  user: EmailUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const STORAGE_KEY = 'anomalyguard-user';

// Generate avatar URL from email
function generateAvatar(email: string): string {
  const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ['0ea5e9', '8b5cf6', '10b981', 'f59e0b', 'ef4444', '6366f1'];
  const color = colors[hash % colors.length];
  const initial = email.charAt(0).toUpperCase();
  return `https://ui-avatars.com/api/?name=${initial}&background=${color}&color=fff&bold=true`;
}

// Extract name from email
function extractName(email: string): string {
  const localPart = email.split('@')[0];
  return localPart
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function useEmailAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as EmailUser;
        setAuthState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const signIn = useCallback((email: string): { success: boolean; error?: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email address' };
    }

    const user: EmailUser = {
      id: crypto.randomUUID(),
      email,
      name: extractName(email),
      picture: generateAvatar(email),
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
    signOut,
  };
}

export default useEmailAuth;
