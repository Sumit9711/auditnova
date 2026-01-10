import { useState, useEffect, useCallback } from 'react';
import { CredentialResponse } from '@react-oauth/google';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  provider: 'google';
  createdAt: string;
}

interface AuthState {
  user: GoogleUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const STORAGE_KEY = 'anomalyguard-google-user';

// Decode JWT token to get user info
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function useGoogleAuth() {
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
        const user = JSON.parse(savedUser) as GoogleUser;
        setAuthState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const handleGoogleSuccess = useCallback((credentialResponse: CredentialResponse): { success: boolean; error?: string } => {
    if (!credentialResponse.credential) {
      return { success: false, error: 'No credential received' };
    }

    const decoded = decodeJwt(credentialResponse.credential);
    if (!decoded) {
      return { success: false, error: 'Failed to decode credential' };
    }

    const user: GoogleUser = {
      id: decoded.sub as string,
      email: decoded.email as string,
      name: decoded.name as string,
      picture: decoded.picture as string,
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true, isLoading: false });

    return { success: true };
  }, []);

  const handleGoogleError = useCallback(() => {
    console.error('Google Sign-In failed');
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return {
    ...authState,
    handleGoogleSuccess,
    handleGoogleError,
    signOut,
  };
}

export default useGoogleAuth;
