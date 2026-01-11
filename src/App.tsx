import { useState, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEmailAuth } from '@/hooks/useEmailAuth';
import { EmailAuthScreen } from '@/components/auth/EmailAuthScreen';
import { LoadingScreen } from '@/components/auth/LoadingScreen';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
// import ModelConfig from "./pages/ModelConfig";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useEmailAuth();
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [hasCompletedLoading, setHasCompletedLoading] = useState(false);

  const onEmailSubmit = useCallback((email: string) => {
    const result = signIn(email);
    if (result.success) {
      setShowLoadingScreen(true);
    }
  }, [signIn]);

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

  // Not authenticated - show email sign-in
  if (!isAuthenticated) {
    return <EmailAuthScreen onSubmit={onEmailSubmit} />;
  }

  // Authenticated and loading complete - show main app
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index onSignOut={handleSignOut} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/model-config" element={<ModelConfig />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
