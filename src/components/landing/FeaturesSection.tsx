import { 
  Radar, 
  LayoutDashboard, 
  Lightbulb, 
  ShieldCheck, 
  Server, 
  FileCheck 
} from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn(
        "group relative p-6 rounded-xl border border-border bg-card hover-lift hover-glow transition-all duration-500",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon */}
      <div className="relative mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Content */}
      <h3 className="relative text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="relative text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

const features = [
  {
    icon: <Radar className="h-6 w-6" />,
    title: 'Anomaly Detection Engine',
    description: 'Detect unusual transactions across departments, vendors, and schemes using advanced statistical and ML models.',
  },
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: 'Interactive Policy Dashboard',
    description: 'Filter by region, scheme, severity, and time period. Drill down into suspicious patterns with intuitive visualizations.',
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: 'Explainable Insights',
    description: 'Understand why each record was flagged—amount deviation, pattern breaks, vendor clustering, and more.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Secure & Role-Based Access',
    description: 'Admin, analyst, and viewer roles for governance teams with granular permission controls.',
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: 'Scalable Architecture',
    description: 'Designed for national-level datasets with millions of records. API-ready for integration with existing systems.',
  },
  {
    icon: <FileCheck className="h-6 w-6" />,
    title: 'Audit-Ready Reports',
    description: 'Export evidence-ready reports for CAG audits, compliance reviews, and internal investigations.',
  },
];

export function FeaturesSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id="features"
      ref={ref}
      className="py-24 relative"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className={cn(
              "inline-block text-sm font-medium text-primary mb-4 transition-all duration-500",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            POWERFUL CAPABILITIES
          </span>
          <h2
            className={cn(
              "text-3xl md:text-4xl font-bold text-foreground mb-4 transition-all duration-500 delay-100",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Everything You Need for{' '}
            <span className="gradient-text">Policy Analytics</span>
          </h2>
          <p
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-200",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            A comprehensive suite of tools designed for government auditors, 
            policy analysts, and governance teams.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
