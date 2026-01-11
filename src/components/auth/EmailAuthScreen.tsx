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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password: string) => {
  return (
    password.length >= 6 
    && /[A-Za-z]/.test(password) 
    && /[0-9]/.test(password)
  );
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
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
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
      {/* Animated background - Enhanced */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs with enhanced animation */}
        <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-[10%] right-[10%] w-48 h-48 bg-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[20%] left-[15%] w-64 h-64 bg-emerald/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating geometric shapes */}
        <div className="absolute top-[15%] left-[10%] w-16 h-16 border border-primary/20 rounded-lg rotate-45 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[60%] right-[8%] w-12 h-12 border border-accent/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-[25%] left-[20%] w-8 h-8 bg-primary/10 rounded-full animate-pulse-slow" />
        <div className="absolute top-[40%] right-[15%] w-20 h-20 border border-purple/15 rounded-xl rotate-12 animate-float" style={{ animationDelay: '2.5s' }} />
        
        {/* Floating connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <line x1="10%" y1="20%" x2="25%" y2="35%" stroke="hsl(var(--primary))" strokeWidth="1" className="animate-pulse">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="75%" y1="15%" x2="85%" y2="30%" stroke="hsl(var(--accent))" strokeWidth="1">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="20%" y1="70%" x2="35%" y2="85%" stroke="hsl(var(--purple))" strokeWidth="1">
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3.5s" repeatCount="indefinite" />
          </line>
        </svg>

        {/* Floating orbs with varied sizes */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute rounded-full animate-float",
              i % 3 === 0 ? "w-3 h-3 bg-primary/30" : i % 3 === 1 ? "w-2 h-2 bg-accent/40" : "w-1.5 h-1.5 bg-purple/30"
            )}
            style={{
              left: `${5 + i * 10}%`,
              top: `${15 + (i % 5) * 18}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
        
        {/* Glowing dots */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`glow-${i}`}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))',
              animation: `pulse ${2 + Math.random() * 2}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
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
            <h1 className="text-3xl font-bold text-foreground pt-3">
              ChitraGupt<span className="text-primary">AI</span>
            </h1>
            <p className="text-sm text-muted-foreground ml-3">AI Fraud Detection Platform</p>
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
              <h2 className="text-2xl font-bold text-foreground mb-2">Login </h2>
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
              </div>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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
                Login to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

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
          <br />
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
