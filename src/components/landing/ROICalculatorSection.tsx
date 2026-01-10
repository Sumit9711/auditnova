import { useState, useMemo } from 'react';
import { Calculator, Download, Share2, TrendingUp, AlertTriangle, CheckCircle, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const exampleScenarios = [
  {
    title: 'Small Municipality',
    params: '₹50Cr annual spend, 8% fraud rate',
    result: '₹3.4Cr recovery, 8-month ROI',
  },
  {
    title: 'State Department',
    params: '₹500Cr annual spend, 12% fraud rate',
    result: '₹42Cr recovery, 4-month ROI',
  },
  {
    title: 'Ministry',
    params: '₹2000Cr annual spend, 15% fraud rate',
    result: '₹240Cr recovery, 2-month ROI',
  },
];

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

function AnimatedNumber({ value, prefix = '' }: { value: string; prefix?: string }) {
  return (
    <span className="font-bold text-2xl lg:text-3xl tabular-nums">
      {prefix}{value}
    </span>
  );
}

export function ROICalculatorSection() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  
  // Slider states (values in crores for calculation)
  const [annualSpend, setAnnualSpend] = useState([100]); // ₹100Cr default
  const [fraudRate, setFraudRate] = useState([12]); // 12% default
  const [auditCoverage, setAuditCoverage] = useState([30]); // 30% default
  const [currentAccuracy, setCurrentAccuracy] = useState('50'); // 50% default

  // Calculate results
  const calculations = useMemo(() => {
    const spendInCrores = annualSpend[0];
    const spendValue = spendInCrores * 10000000; // Convert to rupees
    const fraudRateValue = fraudRate[0] / 100;
    const auditCoverageValue = auditCoverage[0] / 100;
    const currentAccuracyValue = parseInt(currentAccuracy) / 100;
    const anomalyGuardAccuracy = 0.90; // 90% (middle of 85-95%)

    // Total value at risk
    const totalAtRisk = spendValue * fraudRateValue;

    // Currently undetected leakages
    const currentDetection = totalAtRisk * auditCoverageValue * currentAccuracyValue;
    const currentlyUndetected = totalAtRisk - currentDetection;

    // AnomalyGuard can detect
    const anomalyGuardDetection = totalAtRisk * anomalyGuardAccuracy;

    // Annual savings potential
    const annualSavings = anomalyGuardDetection - currentDetection;

    // Recommended tier and cost
    let recommendedTier = 'STARTER';
    let implementationCost = 2500000; // ₹25L
    if (spendInCrores >= 500) {
      recommendedTier = 'ENTERPRISE';
      implementationCost = 15000000; // ₹1.5Cr (custom, estimated)
    } else if (spendInCrores >= 100) {
      recommendedTier = 'PROFESSIONAL';
      implementationCost = 7500000; // ₹75L
    }

    // ROI calculation
    const roi = ((annualSavings - implementationCost) / implementationCost) * 100;
    const paybackMonths = Math.ceil((implementationCost / annualSavings) * 12);

    return {
      totalAtRisk,
      currentlyUndetected,
      anomalyGuardDetection,
      annualSavings,
      implementationCost,
      roi: Math.max(0, roi),
      paybackMonths: Math.max(1, paybackMonths),
      recommendedTier,
    };
  }, [annualSpend, fraudRate, auditCoverage, currentAccuracy]);

  return (
    <section id="roi" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-emerald/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-700",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-emerald/10 rounded-full text-accent-emerald text-sm font-medium mb-6">
            <Calculator className="h-4 w-4" />
            <span>Interactive Calculator</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Calculate Your Potential Savings
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how much AnomalyGuard can recover in your government
          </p>
        </div>

        <div className={cn(
          "max-w-5xl mx-auto transition-all duration-700 delay-200",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div className="glass-card p-6 lg:p-8 rounded-2xl">
              <h3 className="text-lg font-semibold text-foreground mb-6">Your Parameters</h3>
              
              <div className="space-y-8">
                {/* Annual Spend */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-muted-foreground">
                      Annual welfare/subsidy disbursement
                    </label>
                    <span className="text-sm font-semibold text-foreground">
                      ₹{annualSpend[0]}Cr
                    </span>
                  </div>
                  <Slider
                    value={annualSpend}
                    onValueChange={setAnnualSpend}
                    min={10}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹10Cr</span>
                    <span>₹1000Cr</span>
                  </div>
                </div>

                {/* Fraud Rate */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-muted-foreground">
                      Estimated fraud/leakage rate
                    </label>
                    <span className="text-sm font-semibold text-foreground">
                      {fraudRate[0]}%
                    </span>
                  </div>
                  <Slider
                    value={fraudRate}
                    onValueChange={setFraudRate}
                    min={3}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>3%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Audit Coverage */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-muted-foreground">
                      Your team's audit coverage
                    </label>
                    <span className="text-sm font-semibold text-foreground">
                      {auditCoverage[0]}%
                    </span>
                  </div>
                  <Slider
                    value={auditCoverage}
                    onValueChange={setAuditCoverage}
                    min={10}
                    max={60}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>10%</span>
                    <span>60%</span>
                  </div>
                </div>

                {/* Current Accuracy */}
                <div>
                  <label className="text-sm text-muted-foreground block mb-3">
                    Current detection accuracy
                  </label>
                  <Select value={currentAccuracy} onValueChange={setCurrentAccuracy}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30%</SelectItem>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="70">70%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="glass-card p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent-emerald/5">
              <h3 className="text-lg font-semibold text-foreground mb-6">Based on your parameters</h3>

              <div className="space-y-4">
                {/* Total at risk */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-background/50">
                  <TrendingUp className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total annual value at risk</p>
                    <AnimatedNumber value={formatCurrency(calculations.totalAtRisk)} />
                  </div>
                </div>

                {/* Currently undetected */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-coral/10 border border-accent-coral/20">
                  <AlertTriangle className="h-5 w-5 text-accent-coral mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Currently undetected leakages</p>
                    <AnimatedNumber value={formatCurrency(calculations.currentlyUndetected)} />
                    <p className="text-xs text-muted-foreground mt-1">(due to audit gap & accuracy limits)</p>
                  </div>
                </div>

                {/* AnomalyGuard detection */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20">
                  <CheckCircle className="h-5 w-5 text-accent-emerald mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">AnomalyGuard can detect & prevent</p>
                    <AnimatedNumber value={formatCurrency(calculations.anomalyGuardDetection)} />
                    <p className="text-xs text-muted-foreground mt-1">(using 85-95% accuracy)</p>
                  </div>
                </div>

                {/* Annual Savings */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-accent-emerald/20 to-primary/20 border border-accent-emerald/30">
                  <IndianRupee className="h-5 w-5 text-accent-emerald mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Annual savings potential</p>
                    <AnimatedNumber value={formatCurrency(calculations.annualSavings)} />
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Implementation Cost</p>
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(calculations.implementationCost)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">ROI (Year 1)</p>
                    <p className="text-sm font-semibold text-accent-emerald">{calculations.roi.toFixed(0)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Payback Period</p>
                    <p className="text-sm font-semibold text-foreground">{calculations.paybackMonths} months</p>
                  </div>
                </div>

                {/* Recommended Tier */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground">At this scale, recommended tier:</p>
                  <p className="text-lg font-bold text-primary">{calculations.recommendedTier}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download ROI Report
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Example Scenarios */}
        <div className={cn(
          "mt-16 transition-all duration-700 delay-400",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="text-xl font-semibold text-foreground text-center mb-8">
            Real-World Implementation Examples
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {exampleScenarios.map((scenario) => (
              <div
                key={scenario.title}
                className="p-6 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors"
              >
                <h4 className="font-semibold text-foreground mb-2">{scenario.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{scenario.params}</p>
                <p className="text-sm font-medium text-accent-emerald">→ {scenario.result}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ROICalculatorSection;
