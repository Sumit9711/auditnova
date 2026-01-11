import { Database, AlertTriangle, Percent, IndianRupee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedCounter } from './AnimatedCounter';
import { cn } from '@/lib/utils';

interface SummaryStatsCardsProps {
  totalRecords: number;
  anomaliesDetected: number;
  anomalyRate: number;
  totalFraudRiskAmount: number;
}

export function SummaryStatsCards({
  totalRecords,
  anomaliesDetected,
  anomalyRate,
  totalFraudRiskAmount,
}: SummaryStatsCardsProps) {
  // Determine colors based on severity
  const rateColor = anomalyRate > 5 ? 'coral' : anomalyRate > 2 ? 'amber' : 'emerald';
  const anomalyColor = anomaliesDetected > totalRecords * 0.05 ? 'coral' : 'amber';

  const formatCurrency = (value: number): string => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)} K`;
    return `₹${value.toLocaleString()}`;
  };

  const cards = [
    {
      title: 'Total Records',
      value: totalRecords,
      icon: Database,
      color: 'primary',
      suffix: '',
      decimals: 0,
      displayValue: null,
    },
    {
      title: 'Anomalies Detected',
      value: anomaliesDetected,
      icon: AlertTriangle,
      color: anomalyColor,
      suffix: '',
      decimals: 0,
      displayValue: null,
    },
    {
      title: 'Anomaly Rate',
      value: anomalyRate,
      icon: Percent,
      color: rateColor,
      suffix: '%',
      decimals: 2,
      displayValue: null,
    },
    {
      title: 'Total Fraud Risk',
      value: totalFraudRiskAmount,
      icon: IndianRupee,
      color: 'coral',
      suffix: '',
      decimals: 0,
      displayValue: formatCurrency(totalFraudRiskAmount),
    },
  ];

  const colorClasses: Record<string, { icon: string; value: string }> = {
    primary: { 
      icon: 'text-primary bg-primary/10 border-primary/20', 
      value: 'text-foreground' 
    },
    coral: { 
      icon: 'text-coral bg-coral/10 border-coral/20', 
      value: 'text-coral' 
    },
    amber: { 
      icon: 'text-amber bg-amber/10 border-amber/20', 
      value: 'text-amber' 
    },
    emerald: { 
      icon: 'text-emerald bg-emerald/10 border-emerald/20', 
      value: 'text-emerald' 
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const colors = colorClasses[card.color];

        return (
          <Card 
            key={card.title}
            className="glass-card hover-glow cursor-pointer transition-all duration-300 hover:scale-[1.02] group animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">{card.title}</p>
                  <p className={cn(
                    "text-2xl md:text-3xl font-bold tabular-nums",
                    card.title === 'Total Records' ? 'text-foreground' : colors.value
                  )}>
                    {card.displayValue ? (
                      card.displayValue
                    ) : (
                      <>
                        <AnimatedCounter value={card.value} decimals={card.decimals} />
                        {card.suffix}
                      </>
                    )}
                  </p>
                </div>
                <div className={cn(
                  'p-2 md:p-3 rounded-xl border transition-transform duration-300 group-hover:scale-110',
                  colors.icon
                )}>
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
