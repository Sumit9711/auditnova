import { useState } from 'react';
import { CheckCircle, Shield, ChevronDown, ChevronUp, Download, Clock, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface Milestone {
  id: string;
  week: string;
  title: string;
  status: string;
  statusColor: string;
  icon: typeof CheckCircle;
  deliverables: string[];
}

const milestones: Milestone[] = [
  {
    id: 'onboarding',
    week: 'Week 1-2',
    title: 'ONBOARDING',
    status: 'Setup Done',
    statusColor: 'text-accent-emerald',
    icon: CheckCircle,
    deliverables: [
      'Dedicated implementation specialist assigned',
      'Data schema validation & integration setup',
      'User access configuration (roles, permissions, departments)',
      'Initial training for admin & analyst teams',
      'Security audit & compliance checklist completion',
    ],
  },
  {
    id: 'pilot',
    week: 'Week 2-3',
    title: 'PILOT & EVALUTAION',
    status: 'Validation Complete',
    statusColor: 'text-accent-emerald',
    icon: CheckCircle,
    deliverables: [
      'Historical data ingestion & processing',
      'AI model training on your governance data',
      'Dashboard customization & workflow setup',
      'End-to-end testing with sample transactions',
      'Anomaly detection accuracy validation (usually 88-95%)',
    ],
  },
  {
    id: 'rollout',
    week: 'Week 4-6',
    title: 'ROLLOUT & OPTIMIZATION',
    status: 'Production Ready',
    statusColor: 'text-primary',
    icon: CheckCircle,
    deliverables: [
      'Full data migration & live transaction monitoring',
      'Team training & certification',
      'Weekly optimization calls (detect & fix false positives)',
      'Integration with existing PFMS/e-Gov systems',
      'Audit log export & compliance verification',
    ],
  },
  {
    id: 'ongoing',
    week: 'Ongoing',
    title: '24/7 SUPPORT & OPTIMIZATION',
    status: 'Active Support',
    statusColor: 'text-accent-amber',
    icon: Shield,
    deliverables: [
      'Dedicated account manager (for Enterprise)',
      'Monthly governance reviews & insights',
      'Quarterly model retraining & accuracy improvements',
      'Continuous security updates & compliance monitoring',
      '99.9% uptime SLA guarantee',
    ],
  },
];

const supportTiers = [
  {
    tier: 'STARTER',
    color: 'bg-accent-emerald',
    support: 'Email support',
    response: '24-hour response',
    timeline: '8 weeks to production',
  },
  {
    tier: 'PROFESSIONAL',
    color: 'bg-accent-amber',
    support: 'Priority support',
    response: '8-hour response',
    timeline: '4 weeks to production',
  },
  {
    tier: 'ENTERPRISE',
    color: 'bg-accent-coral',
    support: 'Dedicated account manager',
    response: '2-hour response',
    timeline: '2 weeks to production',
  },
];

function MilestoneCard({ milestone, index, isInView }: { milestone: Milestone; index: number; isInView: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = milestone.icon;

  return (
    <div
      className={cn(
        "relative transition-all duration-500",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Timeline Connector */}
      {index < milestones.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-border to-transparent" />
      )}

      <div
        className={cn(
          "glass-card p-4 rounded-2xl cursor-pointer transition-all duration-300",
          isExpanded && "ring-2 ring-primary/30"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Week Badge */}
        <span className="text-xs font-semibold text-primary tracking-wider uppercase block mb-3">
          {milestone.week}
        </span>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Icon className={cn("h-5 w-5", milestone.statusColor)} />
            </div>
            <h4 className="font-semibold text-foreground text-sm lg:text-base">{milestone.title}</h4>
          </div>
          <button className="p-1 hover:bg-secondary rounded-lg transition-colors">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className={cn("h-4 w-4", milestone.statusColor)} />
          <span className={cn("text-sm font-medium", milestone.statusColor)}>
            {milestone.status}
          </span>
        </div>

        {/* Expandable Deliverables */}
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Deliverables</p>
            <ul className="space-y-2">
              {milestone.deliverables.map((deliverable, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImplementationSection() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="timeline" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-accent-emerald/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From Signup to Impact: Our Implementation Guarantee
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See exactly how fast AnomalyGuard launches in your organization
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Support Tiers */}
        <div className={cn(
          "mb-12 transition-all duration-700 delay-400",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="text-xl font-semibold text-foreground text-center mb-8">
            Support Tiers by Plan
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {supportTiers.map((tier) => (
              <div
                key={tier.tier}
                className="p-6 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("w-3 h-3 rounded-full", tier.color)} />
                  <span className="font-semibold text-foreground">{tier.tier}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{tier.support}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{tier.response}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span>{tier.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download CTA */}
        <div className={cn(
          "text-center transition-all duration-700 delay-500",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-primary/30 hover:bg-primary/10"
          >
            <Download className="h-4 w-4" />
            Download Implementation Roadmap
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ImplementationSection;
