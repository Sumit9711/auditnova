import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Brain, Database, Shield, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisLoadingScreenProps {
  progress: number;
  progressStep: string;
}

const loadingSteps = [
  { id: 1, text: 'Reading file data...', icon: Database, threshold: 10 },
  { id: 2, text: 'Loading ML models...', icon: Brain, threshold: 25 },
  { id: 3, text: 'Preprocessing features...', icon: Activity, threshold: 40 },
  { id: 4, text: 'Running anomaly detection...', icon: Shield, threshold: 60 },
  { id: 5, text: 'Generating analysis...', icon: Activity, threshold: 80 },
  { id: 6, text: 'Preparing results...', icon: CheckCircle2, threshold: 95 },
];

export function AnalysisLoadingScreen({ progress, progressStep }: AnalysisLoadingScreenProps) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    const newVisible = loadingSteps
      .filter(step => progress >= step.threshold)
      .map(step => step.id);
    setVisibleSteps(newVisible);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-lg px-6 animate-fade-in">
        {/* Central spinner */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20">
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
                style={{ animationDuration: '1s' }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-10 w-10 text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-foreground mb-2">
          Analyzing Your Data
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Our AI model is detecting anomalies and patterns
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-purple to-cyan transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                style={{ 
                  animation: 'shimmer 1.5s infinite',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Steps list */}
        <div className="space-y-3">
          {loadingSteps.map((step, idx) => {
            const isVisible = visibleSteps.includes(step.id);
            const isComplete = progress > step.threshold + 10;
            const isCurrent = isVisible && !isComplete;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
                  isCurrent && "bg-primary/10 border border-primary/30",
                  isComplete && "bg-emerald/10 border border-emerald/30"
                )}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300",
                  isComplete ? "bg-emerald text-white" : 
                  isCurrent ? "bg-primary/20 text-primary" : 
                  "bg-secondary text-muted-foreground"
                )}>
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={cn(
                  "text-sm transition-colors duration-300",
                  isComplete ? "text-emerald font-medium" :
                  isCurrent ? "text-foreground font-medium" :
                  "text-muted-foreground"
                )}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current step text */}
        <p className="text-center text-sm text-muted-foreground mt-6 animate-pulse">
          {progressStep}
        </p>
      </div>
    </div>
  );
}
