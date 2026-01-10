import { useState } from 'react';
import { Check, Sparkles, Building2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const pricingTiers = [
  {
    name: 'STARTER',
    icon: Building2,
    monthlyPrice: 294000, // ₹29.4L monthly (25L + 17.6% premium)
    yearlyPrice: 2500000, // ₹25L/year
    description: 'For small municipalities & state departments',
    features: [
      'Detection of basic anomalies (statistical outliers, duplicate records)',
      'Up to 100K transactions/month',
      '1 department access',
      'Email support',
      'CSV export only',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'PROFESSIONAL',
    icon: Sparkles,
    monthlyPrice: 882000, // ₹88.2L monthly (75L + 17.6% premium)
    yearlyPrice: 7500000, // ₹75L/year
    description: 'For state governments & large agencies',
    features: [
      'All Starter features +',
      'Advanced pattern detection (vendor clustering, timing anomalies, scheme deviations)',
      'Up to 50M transactions/month',
      'Multi-department access (up to 5)',
      'API access for integration',
      'Audit-ready report generation',
      'Priority support',
    ],
    cta: 'Request Demo',
    highlighted: true,
  },
  {
    name: 'ENTERPRISE',
    icon: Crown,
    monthlyPrice: null,
    yearlyPrice: null,
    description: 'For national ministries & CAG',
    features: [
      'All Professional features +',
      'Custom ML models trained on your data',
      'Unlimited transaction volume',
      'Unlimited departments/users',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom data residency (on-prem or gov cloud)',
      '24/7 support',
    ],
    cta: 'Talk to Sales',
    highlighted: false,
  },
];

const comparisonFeatures = [
  {
    feature: 'Detection types',
    starter: 'Basic (outliers, duplicates)',
    professional: 'Advanced (patterns, clustering)',
    enterprise: 'Custom ML models',
  },
  {
    feature: 'Dashboard customization',
    starter: 'Standard',
    professional: 'Customizable',
    enterprise: 'Fully custom',
  },
  {
    feature: 'Multi-user access',
    starter: '5 users',
    professional: '25 users',
    enterprise: 'Unlimited',
  },
  {
    feature: 'API access',
    starter: '—',
    professional: '✓',
    enterprise: '✓',
  },
  {
    feature: 'Custom reports',
    starter: '—',
    professional: '✓',
    enterprise: '✓',
  },
  {
    feature: 'Support level',
    starter: 'Email (24hr)',
    professional: 'Priority (8hr)',
    enterprise: 'Dedicated (2hr)',
  },
  {
    feature: 'Implementation support',
    starter: 'Self-service',
    professional: 'Guided setup',
    enterprise: 'White-glove onboarding',
  },
];

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(0)}L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="pricing" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-emerald/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className={cn(
          "text-center mb-12 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing for governments of any scale
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your organization's needs. All plans include core anomaly detection.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn(
              "text-sm font-medium transition-colors",
              !isAnnual ? "text-foreground" : "text-muted-foreground"
            )}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={cn(
              "text-sm font-medium transition-colors",
              isAnnual ? "text-foreground" : "text-muted-foreground"
            )}>
              Annual
            </span>
            {isAnnual && (
              <span className="px-2 py-1 text-xs font-semibold bg-accent-emerald/20 text-accent-emerald rounded-full">
                Save 15%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {pricingTiers.map((tier, index) => {
            const Icon = tier.icon;
            const price = isAnnual ? tier.yearlyPrice : tier.monthlyPrice;
            
            return (
              <div
                key={tier.name}
                className={cn(
                  "relative rounded-2xl p-6 lg:p-8 transition-all duration-500 border",
                  tier.highlighted
                    ? "bg-gradient-to-b from-primary/10 to-primary/5 border-primary/30 scale-105 shadow-xl shadow-primary/10"
                    : "glass-card border-border hover:border-primary/20",
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    tier.highlighted ? "bg-primary/20" : "bg-secondary"
                  )}>
                    <Icon className={cn(
                      "h-6 w-6",
                      tier.highlighted ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                </div>

                <div className="mb-4">
                  {price ? (
                    <>
                      <span className="text-3xl lg:text-4xl font-bold text-foreground">
                        {formatPrice(price)}
                      </span>
                      <span className="text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span>
                    </>
                  ) : (
                    <span className="text-3xl lg:text-4xl font-bold text-foreground">
                      Custom
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  {tier.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-accent-emerald mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full",
                    tier.highlighted
                      ? "glow-primary"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  )}
                  variant={tier.highlighted ? "default" : "secondary"}
                >
                  {tier.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className={cn(
          "transition-all duration-700 delay-300",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Feature Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Feature</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">Starter</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-primary bg-primary/5 rounded-t-lg">Professional</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, index) => (
                  <tr key={row.feature} className={cn(
                    "border-b border-border/50",
                    index % 2 === 0 && "bg-secondary/20"
                  )}>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{row.feature}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.starter}</td>
                    <td className="py-3 px-4 text-sm text-center text-foreground bg-primary/5">{row.professional}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
