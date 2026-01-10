import { CheckCircle, TrendingDown, Clock, Target, Eye, Shield } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const benefits = [
  {
    icon: <TrendingDown className="h-5 w-5" />,
    text: 'Reduced financial leakages across welfare and subsidy programs',
  },
  {
    icon: <Eye className="h-5 w-5" />,
    text: 'Increased transparency in policy implementation and fund flow',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    text: 'Faster audit cycles with automated anomaly detection',
  },
  {
    icon: <Target className="h-5 w-5" />,
    text: 'Better targeting of subsidies and welfare to intended beneficiaries',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    text: 'Proactive fraud prevention instead of reactive investigation',
  },
];

const metrics = [
  { value: '40%', label: 'Faster Audits' },
  { value: '2.3B+', label: 'Records Analyzed' },
  { value: '₹850Cr', label: 'Leakages Identified' },
  { value: '99.2%', label: 'Detection Accuracy' },
];

export function WhyItMattersSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id="why-it-matters"
      ref={ref}
      className="py-24 relative"
    >
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <span
              className={cn(
                "inline-block text-sm font-medium text-primary mb-4 transition-all duration-500",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              THE IMPACT
            </span>
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold text-foreground mb-6 transition-all duration-500 delay-100",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Why{' '}
              <span className="gradient-text">AnomalyGuard</span>{' '}
              Matters
            </h2>
            <p
              className={cn(
                "text-lg text-muted-foreground mb-8 transition-all duration-500 delay-200",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              In the age of digital governance, policy implementation generates 
              massive data streams. AnomalyGuard transforms this data into 
              actionable intelligence for transparent, accountable governance.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex items-start gap-3 transition-all duration-500",
                    isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  )}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 mt-0.5 text-emerald">
                    {benefit.icon}
                  </div>
                  <span className="text-muted-foreground">{benefit.text}</span>
                </li>
              ))}
            </ul>

            {/* Alignment Tags */}
            <div
              className={cn(
                "mt-8 flex flex-wrap gap-2 transition-all duration-500 delay-700",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {['Digital Governance', 'AI for Social Good', 'National-Scale Analytics'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Metrics */}
          <div
            className={cn(
              "grid grid-cols-2 gap-4 transition-all duration-700",
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            )}
          >
            {metrics.map((metric, index) => (
              <div
                key={metric.label}
                className={cn(
                  "p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-center hover-lift transition-all duration-300",
                )}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyItMattersSection;
