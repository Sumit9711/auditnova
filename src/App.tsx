import { useState, useCallback } from 'react';
import { GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { GoogleAuthScreen } from '@/components/auth/GoogleAuthScreen';
import { LoadingScreen } from '@/components/auth/LoadingScreen';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Google OAuth Client ID - Replace with your own
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function AppContent() {
  const { user, isAuthenticated, isLoading, handleGoogleSuccess, handleGoogleError, signOut } = useGoogleAuth();
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [hasCompletedLoading, setHasCompletedLoading] = useState(false);

  const onGoogleSuccess = useCallback((credentialResponse: CredentialResponse) => {
    const result = handleGoogleSuccess(credentialResponse);
    if (result.success) {
      setShowLoadingScreen(true);
    }
  }, [handleGoogleSuccess]);

  const onLoadingComplete = useCallback(() => {
    setShowLoadingScreen(false);
    setHasCompletedLoading(true);
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
    setHasCompletedLoading(false);
  }, [signOut]);

  // Initial loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show loading screen after successful login
  if (showLoadingScreen) {
    return <LoadingScreen onComplete={onLoadingComplete} />;
  }

  // Show loading screen briefly for returning users (already authenticated)
  if (isAuthenticated && !hasCompletedLoading) {
    return <LoadingScreen onComplete={onLoadingComplete} />;
  }

  // Not authenticated - show Google sign-in
  if (!isAuthenticated) {
    return (
      <GoogleAuthScreen
        onSuccess={onGoogleSuccess}
        onError={handleGoogleError}
      />
    );
  }

  // Authenticated and loading complete - show main app
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index onSignOut={handleSignOut} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
