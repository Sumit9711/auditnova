import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Shield, Sparkles, Lock, BarChart3 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface GoogleAuthScreenProps {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onError: () => void;
}

export function GoogleAuthScreen({ onSuccess, onError }: GoogleAuthScreenProps) {
  const { theme } = useTheme();

  const features = [
    { icon: BarChart3, text: 'AI-Powered Anomaly Detection' },
    { icon: Lock, text: 'Enterprise-Grade Security' },
    { icon: Sparkles, text: 'Real-Time Fraud Analysis' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="relative">
            <Shield className="h-14 w-14 text-primary" />
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Anomaly<span className="text-primary">Guard</span>
            </h1>
            <p className="text-sm text-muted-foreground">AI Fraud Detection Platform</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8 w-full animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">
              Sign in to access your fraud detection dashboard
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="flex justify-center mb-8">
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              useOneTap
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
              size="large"
              width="280"
              text="continue_with"
              shape="rectangular"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Secure Authentication
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-muted-foreground"
              >
                <feature.icon className="h-4 w-4 text-primary" />
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-center text-xs text-muted-foreground max-w-sm animate-fade-in">
          By signing in, you agree to our Terms of Service and Privacy Policy.
          Your data is protected with enterprise-grade encryption.
        </p>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

export default GoogleAuthScreen;
