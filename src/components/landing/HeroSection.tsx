import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

// Animated network node component
function NetworkNode({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={cn(
        "absolute w-3 h-3 rounded-full bg-primary/60 animate-pulse-slow",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
    </div>
  );
}

// Animated connection line
function ConnectionLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={cn(
        "absolute h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent",
        className
      )}
      style={{ 
        animationDelay: `${delay}s`,
        opacity: 0.5,
      }}
    />
  );
}

// Floating anomaly card
function AnomalyCard({ 
  title, 
  value, 
  status, 
  className,
  delay = 0 
}: { 
  title: string; 
  value: string; 
  status: 'alert' | 'warning' | 'normal';
  className?: string;
  delay?: number;
}) {
  const statusColors = {
    alert: 'border-coral/50 bg-coral/10',
    warning: 'border-amber/50 bg-amber/10',
    normal: 'border-emerald/50 bg-emerald/10',
  };

  const statusDot = {
    alert: 'bg-coral',
    warning: 'bg-amber',
    normal: 'bg-emerald',
  };

  return (
    <div
      className={cn(
        "absolute glass-card p-3 min-w-[140px] animate-float",
        statusColors[status],
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={cn("w-2 h-2 rounded-full", statusDot[status])} />
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function HeroSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.2 });

  const scrollToFeatures = () => {
    const element = document.querySelector('#features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      
      {/* Animated Network Visualization */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Nodes */}
        <NetworkNode className="top-[20%] left-[15%]" delay={0} />
        <NetworkNode className="top-[35%] left-[25%]" delay={0.5} />
        <NetworkNode className="top-[25%] right-[20%]" delay={1} />
        <NetworkNode className="top-[45%] right-[30%]" delay={1.5} />
        <NetworkNode className="bottom-[30%] left-[20%]" delay={2} />
        <NetworkNode className="bottom-[25%] right-[15%]" delay={2.5} />
        
        {/* Connection Lines */}
        <ConnectionLine className="top-[28%] left-[15%] w-[15%] rotate-12" delay={0.2} />
        <ConnectionLine className="top-[30%] right-[20%] w-[12%] -rotate-6" delay={0.8} />
        <ConnectionLine className="bottom-[32%] left-[18%] w-[18%] rotate-3" delay={1.4} />
        
        {/* Floating Anomaly Cards */}
        <AnomalyCard
          title="Vendor Payment"
          value="₹2.4M flagged"
          status="alert"
          className="top-[18%] right-[8%] md:right-[12%]"
          delay={0}
        />
        <AnomalyCard
          title="Scheme Distribution"
          value="Pattern break"
          status="warning"
          className="top-[40%] left-[5%] md:left-[8%]"
          delay={1.5}
        />
        <AnomalyCard
          title="Transaction Batch"
          value="Verified ✓"
          status="normal"
          className="bottom-[25%] right-[10%] md:right-[18%]"
          delay={3}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 transition-all duration-700",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-sm text-muted-foreground">
              AI-Powered Governance Analytics
            </span>
          </div>

          {/* Headline */}
          <h1
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight transition-all duration-700 delay-100",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            AI Fraud Detection for{' '}
            <span className="gradient-text">Government Policies</span>
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              "text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Detect anomalies in welfare, subsidies, payroll, and procurement data. 
            Reduce leakages and increase transparency with advanced AI-powered analytics.
          </p>

          {/* CTAs */}
          <div
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Button
              size="lg"
              onClick={() => {
                const analysisSection = document.querySelector('#analysis');
                if (analysisSection) {
                  analysisSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-base px-8 py-6 glow-primary hover:scale-105 transition-all duration-300 group"
            >
              Start Analysis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToFeatures}
              className="text-base px-8 py-6 hover:bg-secondary/50 transition-all duration-300"
            >
              View Sample Insights
            </Button>
          </div>

          {/* Trust Indicators */}
          <div
            className={cn(
              "mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground transition-all duration-700 delay-500",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald" />
              <span className="text-sm">Enterprise Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm">99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber" />
              <span className="text-sm">ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-700",
          isInView ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="text-sm text-muted-foreground">Scroll to explore</span>
        <ChevronDown className="h-5 w-5 text-muted-foreground animate-bounce-slow" />
      </div>
    </section>
  );
}

export default HeroSection;
