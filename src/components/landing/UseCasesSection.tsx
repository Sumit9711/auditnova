import { 
  Users, 
  Clock, 
  PieChart, 
  TrendingUp, 
  AlertTriangle, 
  FileText 
} from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface UseCaseCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}

function UseCaseCard({ icon, title, description, index }: UseCaseCardProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={cn(
        "group relative p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover-lift transition-all duration-600",
        isInView 
          ? "opacity-100 translate-x-0" 
          : isEven 
            ? "opacity-0 -translate-x-12" 
            : "opacity-0 translate-x-12"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Hover gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

const useCases = [
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Welfare Scheme Monitoring',
    description: 'Detect duplicate beneficiaries, inflated claims, and ghost records across welfare distribution programs.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Attendance & Payroll Audits',
    description: 'Spot fake attendance entries, irregular overtime patterns, and payroll manipulation in government offices.',
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: 'Budget Allocation Analysis',
    description: 'Identify departments overspending, misusing allocated funds, or showing unusual spending patterns.',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Policy Impact Evaluation',
    description: 'Compare expected vs actual distribution across regions and demographics to measure policy effectiveness.',
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: 'Early Warning for Leakages',
    description: 'Flag unusual spikes in transactions by vendor, scheme, or region before they become systemic issues.',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Compliance & Audit Support',
    description: 'Generate evidence-ready anomaly logs for CAG audits, internal reviews, and compliance reporting.',
  },
];

export function UseCasesSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id="use-cases"
      ref={ref}
      className="py-24 relative"
    >
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className={cn(
              "inline-block text-sm font-medium text-primary mb-4 transition-all duration-500",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            REAL-WORLD APPLICATIONS
          </span>
          <h2
            className={cn(
              "text-3xl md:text-4xl font-bold text-foreground mb-4 transition-all duration-500 delay-100",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Built for{' '}
            <span className="gradient-text">Government Workflows</span>
          </h2>
          <p
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-200",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            From welfare distribution to procurement monitoring, 
            ChitraGuptAI adapts to your governance challenges.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <UseCaseCard
              key={useCase.title}
              icon={useCase.icon}
              title={useCase.title}
              description={useCase.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default UseCasesSection;
