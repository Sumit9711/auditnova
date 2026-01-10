import { Upload, Brain, Search, Zap } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StepProps {
  number: number;
  icon: ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
}

function Step({ number, icon, title, description, isLast = false }: StepProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div ref={ref} className="relative flex-1">
      {/* Step Content */}
      <div
        className={cn(
          "text-center transition-all duration-600",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: `${number * 150}ms` }}
      >
        {/* Icon Circle */}
        <div className="relative inline-flex mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <div className="text-primary">
              {icon}
            </div>
          </div>
          {/* Step Number */}
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
            {number}
          </div>
        </div>

        {/* Text */}
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
          {description}
        </p>
      </div>

      {/* Connector Line (hidden on last item and mobile) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px">
          <div 
            className={cn(
              "h-full bg-gradient-to-r from-primary/50 via-primary/30 to-transparent transition-all duration-1000",
              isInView ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            )}
            style={{ 
              transitionDelay: `${number * 150 + 300}ms`,
              transformOrigin: 'left'
            }}
          />
        </div>
      )}
    </div>
  );
}

const steps = [
  {
    icon: <Upload className="h-8 w-8" />,
    title: 'Ingest',
    description: 'Connect datasets via CSV upload or secure APIs',
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'Analyze',
    description: 'AI models scan for statistical and behavioral anomalies',
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: 'Review',
    description: 'Analysts validate high-risk records in the dashboard',
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Act',
    description: 'Trigger investigations, corrective actions, or policy changes',
  },
];

export function HowItWorksSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-24 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span
            className={cn(
              "inline-block text-sm font-medium text-primary mb-4 transition-all duration-500",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            SIMPLE WORKFLOW
          </span>
          <h2
            className={cn(
              "text-3xl md:text-4xl font-bold text-foreground mb-4 transition-all duration-500 delay-100",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            From Data to{' '}
            <span className="gradient-text">Actionable Insights</span>
          </h2>
          <p
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-200",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Four simple steps to transform raw policy data into 
            verified, actionable intelligence.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-4 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Step
              key={step.title}
              number={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
