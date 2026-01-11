import { useState, useEffect } from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  onComplete: () => void;
}

const loadingSteps = [
  { text: 'Securing data channels...', duration: 600 },
  { text: 'Booting anomaly engines...', duration: 700 },
  { text: 'Calibrating risk models...', duration: 600 },
  { text: 'Preparing dashboard...', duration: 500 },
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // let stepIndex = 0;
    let totalDelay = 0;

    const timers: NodeJS.Timeout[] = [];

    loadingSteps.forEach((step, index) => {
      // Start step
      const startTimer = setTimeout(() => {
        setCurrentStep(index);
      }, totalDelay);
      timers.push(startTimer);

      // Complete step
      totalDelay += step.duration;
      const completeTimer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
      }, totalDelay);
      timers.push(completeTimer);
    });

    // Start exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, totalDelay + 300);
    timers.push(exitTimer);

    // Complete and call onComplete
    const finalTimer = setTimeout(() => {
      onComplete();
    }, totalDelay + 800);
    timers.push(finalTimer);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-background flex flex-col items-center justify-center transition-all duration-500',
        isExiting && 'opacity-0 scale-105'
      )}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          {/* Rotating rings */}
          <div className="absolute inset-0 border border-primary/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-[10%] border border-primary/15 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          <div className="absolute inset-[20%] border border-primary/10 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-[30%] border border-primary/5 rounded-full animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
        </div>
        
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with pulse animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
          <div className="relative">
            <Shield className="h-20 w-20 text-primary animate-pulse" />
            
            {/* Scanning line effect */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
              }}
            >
              <div 
                className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-bounce"
                style={{ animationDuration: '1.5s' }}
              />
            </div>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-2xl font-bold text-foreground mb-12">
          ChitraGupt<span className="text-primary">AI</span>
        </h1>

        {/* Loading steps */}
        <div className="space-y-4 w-80">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-3 transition-all duration-300',
                index > currentStep && 'opacity-30',
                index <= currentStep && 'opacity-100'
              )}
            >
              {/* Status indicator */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                {completedSteps.includes(index) ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-scale-in" />
                ) : index === currentStep ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-3 h-3 bg-muted rounded-full" />
                )}
              </div>

              {/* Step text */}
              <span
                className={cn(
                  'text-sm transition-colors duration-300',
                  completedSteps.includes(index) && 'text-emerald-500',
                  index === currentStep && 'text-foreground',
                  index > currentStep && 'text-muted-foreground'
                )}
              >
                {step.text}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-80 h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
            style={{
              width: `${((completedSteps.length) / loadingSteps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
