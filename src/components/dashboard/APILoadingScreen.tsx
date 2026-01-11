import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Brain, CloudUpload, Shield, Activity, Database, Sparkles, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface APILoadingScreenProps {
  progress: number;
  progressStep: string;
}

const loadingSteps = [
  { id: 1, text: 'Validating file format...', icon: Database, threshold: 5 },
  { id: 2, text: 'Preparing file for upload...', icon: CloudUpload, threshold: 15 },
  { id: 3, text: 'Uploading to ML server...', icon: Activity, threshold: 25 },
  { id: 4, text: 'Connecting to fraud detection API...', icon: Cpu, threshold: 35 },
  { id: 5, text: 'Processing with ML model...', icon: Brain, threshold: 50 },
  { id: 6, text: 'Receiving analysis results...', icon: Shield, threshold: 70 },
  { id: 7, text: 'Generating insights and charts...', icon: Sparkles, threshold: 85 },
  { id: 8, text: 'Analysis complete!', icon: CheckCircle2, threshold: 100 },
];

export function APILoadingScreen({ progress, progressStep }: APILoadingScreenProps) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const newVisible = loadingSteps
      .filter(step => progress >= step.threshold)
      .map(step => step.id);
    setVisibleSteps(newVisible);
  }, [progress]);

  // Create floating particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev];
        if (newParticles.length < 20) {
          newParticles.push({
            id: Date.now(),
            x: Math.random() * 100,
            y: 100 + Math.random() * 20,
          });
        }
        return newParticles.filter(p => p.y > -20).map(p => ({ ...p, y: p.y - 0.5 }));
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-background/98 backdrop-blur-md" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple/5 to-cyan/10 animate-pulse" />
      
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-primary/30 rounded-full blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transition: 'top 0.2s linear',
          }}
        />
      ))}

      {/* Radial glow behind spinner */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative w-full max-w-2xl px-6 animate-fade-in">
        {/* Central spinner with brain icon */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-32 h-32 rounded-full border-4 border-primary/20">
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
                style={{ animationDuration: '1.5s' }}
              />
              <div 
                className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple animate-spin"
                style={{ animationDuration: '2s', animationDirection: 'reverse' }}
              />
            </div>
            
            {/* Center brain icon with glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Brain className="h-14 w-14 text-primary animate-pulse" />
                <div className="absolute inset-0 h-14 w-14 bg-primary blur-xl opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
          Analyzing Your Data
        </h2>
        <p className="text-center text-lg text-muted-foreground mb-10">
          Our ML model is processing your transactions in real-time
        </p>

        {/* Progress bar */}
        <div className="mb-10 px-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-3">
            <span className="font-medium">Processing</span>
            <span className="font-bold text-primary text-lg">{Math.round(progress)}%</span>
          </div>
          <div className="h-4 bg-secondary rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-primary via-purple to-cyan transition-all duration-700 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shimmer */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{ 
                  animation: 'shimmer 1.5s infinite',
                  transform: 'skewX(-20deg)',
                }}
              />
              {/* Glow effect at the end */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 blur-sm" />
            </div>
          </div>
        </div>

        {/* Steps list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4">
          {loadingSteps.map((step, idx) => {
            const isVisible = visibleSteps.includes(step.id);
            const isComplete = progress > step.threshold;
            const isCurrent = isVisible && !isComplete;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
                  isCurrent && "bg-primary/10 border border-primary/30 shadow-lg shadow-primary/10",
                  isComplete && "bg-emerald/10 border border-emerald/30"
                )}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isComplete ? "bg-emerald text-white shadow-lg shadow-emerald/30" : 
                  isCurrent ? "bg-primary/20 text-primary" : 
                  "bg-secondary text-muted-foreground"
                )}>
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isComplete ? "text-emerald" :
                  isCurrent ? "text-foreground" :
                  "text-muted-foreground"
                )}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current step indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>{progressStep}</span>
          </div>
        </div>

        {/* API info */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by Isolation Forest ML Model • Real-time Analysis
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
}
