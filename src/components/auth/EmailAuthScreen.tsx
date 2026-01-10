import { useState } from 'react';
import { Shield, Sparkles, Lock, BarChart3, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EmailAuthScreenProps {
  onSubmit: (email: string) => void;
}

export function EmailAuthScreen({ onSubmit }: EmailAuthScreenProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onSubmit(email);
  };

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
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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

        {/* Floating orbs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 animate-fade-in">
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

        {/* Glassmorphic Auth Card */}
        <div 
          className={cn(
            "w-full rounded-2xl p-8 animate-scale-in transition-all duration-500",
            "bg-card/40 backdrop-blur-xl border border-white/10",
            "shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
            "hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]",
            "hover:border-primary/30 hover:-translate-y-1",
            isFocused && "border-primary/50 shadow-[0_8px_32px_rgba(var(--primary)/0.2)]"
          )}
        >
          {/* Card glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          
          <div className="relative">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome</h2>
              <p className="text-muted-foreground">
                Enter your email to access the dashboard
              </p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
                  isFocused ? "text-primary" : "text-muted-foreground"
                )}>
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={cn(
                    "pl-12 pr-4 py-6 text-base rounded-xl",
                    "bg-background/50 border-white/10",
                    "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                    "placeholder:text-muted-foreground/60",
                    "transition-all duration-300",
                    error && "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/20"
                  )}
                />
                
                {/* Input glow */}
                {isFocused && (
                  <div className="absolute inset-0 rounded-xl bg-primary/5 pointer-events-none animate-pulse" />
                )}
              </div>

              {error && (
                <p className="text-sm text-destructive animate-fade-in flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className={cn(
                  "w-full py-6 text-base font-semibold rounded-xl",
                  "bg-gradient-to-r from-primary to-primary/80",
                  "hover:from-primary/90 hover:to-primary/70",
                  "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
                  "transition-all duration-300 group"
                )}
              >
                Continue to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Secure Access
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-center text-xs text-muted-foreground max-w-sm animate-fade-in">
          Your data is protected with enterprise-grade encryption.
          <br />
          No credit card required.
        </p>
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `pulse ${2 + Math.random() * 3}s infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

export default EmailAuthScreen;
