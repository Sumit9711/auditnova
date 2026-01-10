import { Shield, Award, Users, Globe, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const securityCards = [
  {
    icon: Shield,
    title: 'End-to-End Encryption',
    category: 'DATA PROTECTION',
    details: [
      'AES-256 encryption at rest',
      'TLS 1.3 for data in transit',
      'Field-level encryption for sensitive identifiers',
      'Hardware security module (HSM) backed key management',
      'Zero-knowledge architecture option for distributed deployments',
    ],
  },
  {
    icon: Award,
    title: 'Full Compliance Certifications',
    category: 'COMPLIANCE & CERTIFICATIONS',
    details: [
      'ISO 27001:2013 Information Security Management',
      'SOC 2 Type II audited',
      'NIST Cybersecurity Framework aligned',
      'Data Protection Act 2019 compliant',
      'State Data Security Guidelines approved',
      'CAG audit-ready logs and documentation',
    ],
    badges: ['ISO 27001', 'SOC 2', 'NIST'],
  },
  {
    icon: Users,
    title: 'Role-Based Access Control',
    category: 'ACCESS & AUDIT',
    details: [
      'Admin, Analyst, Viewer, and Custom roles',
      'Granular permission controls (department, scheme, region-level)',
      'Complete audit logs for all data access and changes',
      '2-Factor authentication (TOTP, U2F)',
      'Automatic session timeouts',
      'IP whitelisting for high-security deployments',
    ],
  },
  {
    icon: Globe,
    title: 'India-First Data Sovereignty',
    category: 'DATA RESIDENCY & SOVEREIGNTY',
    details: [
      'All data stored in India (NITI Aayog MeitY approved data centers)',
      'No data leaves Indian jurisdiction',
      'MEITY-certified cloud infrastructure options',
      'State government cloud compatibility (Maharashtra, Karnataka, etc.)',
      'Option for on-premises deployment',
      'DPDP Act and government data security compliant',
    ],
  },
];

export function SecuritySection() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="security" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-accent-emerald/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Enterprise-Grade Security Built for Government
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the strictest compliance standards for sensitive policy data
          </p>
        </div>

        {/* Security Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {securityCards.map((card, index) => {
            const Icon = card.icon;
            
            return (
              <div
                key={card.title}
                className={cn(
                  "glass-card p-6 lg:p-8 rounded-2xl transition-all duration-500 hover:border-accent-emerald/30",
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Category Badge */}
                <span className="text-xs font-semibold text-accent-emerald tracking-wider uppercase mb-4 block">
                  {card.category}
                </span>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-accent-emerald/20 to-primary/10">
                    <Icon className="h-6 w-6 text-accent-emerald" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                </div>

                {/* Details List */}
                <ul className="space-y-3 mb-6">
                  {card.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald mt-2 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* Certification Badges */}
                {card.badges && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    {card.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-3 py-1 text-xs font-semibold bg-secondary text-foreground rounded border border-border"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
            Download Security & Compliance Whitepaper
          </Button>
        </div>
      </div>
    </section>
  );
}

export default SecuritySection;
