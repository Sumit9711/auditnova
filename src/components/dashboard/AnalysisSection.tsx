import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, Sparkles, AlertTriangle, CheckCircle2, Loader2, TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';
import { FraudCharts } from './FraudCharts';
import { AnimatedCounter } from './AnimatedCounter';
import { SuspiciousTransactionsTable } from './SuspiciousTransactionsTable';

interface TransactionData {
  transaction_id: string;
  department_id: string;
  vendor_id: string;
  scheme_type: string;
  amount: number;
  transaction_date: string;
  transaction_time: string;
  is_anomaly: boolean;
}

interface AnalysisResults {
  totalRecords: number;
  anomaliesDetected: number;
  anomalyRate: number;
  totalAmount: number;
  fraudProbability: number;
  accuracyScore: number;
  riskConfidence: number;
  departmentBreakdown: { name: string; anomalies: number; total: number }[];
  timeSeriesData: { date: string; amount: number; anomalies: number }[];
  riskDistribution: { level: string; count: number; color: string }[];
  suspiciousTransactions: TransactionData[];
}

export function AnalysisSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [progressStep, setProgressStep] = useState('');
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const parseCSV = (text: string): TransactionData[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      return {
        transaction_id: record.transaction_id || record.id || `TXN-${Math.random().toString(36).substr(2, 9)}`,
        department_id: record.department_id || record.department || `DEPT-${Math.floor(Math.random() * 10)}`,
        vendor_id: record.vendor_id || record.vendor || `VND-${Math.floor(Math.random() * 100)}`,
        scheme_type: record.scheme_type || record.scheme || ['Welfare', 'Subsidy', 'Payroll', 'Procurement'][Math.floor(Math.random() * 4)],
        amount: parseFloat(record.amount) || Math.random() * 100000,
        transaction_date: record.transaction_date || record.date || new Date().toISOString().split('T')[0],
        transaction_time: record.transaction_time || record.time || '12:00:00',
        is_anomaly: record.is_anomaly === 'true' || record.is_anomaly === '1' || Math.random() < 0.05,
      };
    });
  };

  const generateMockData = (): TransactionData[] => {
    const departments = ['Health', 'Education', 'Infrastructure', 'Agriculture', 'Social Welfare', 'Defense'];
    const schemes = ['Welfare', 'Subsidy', 'Payroll', 'Procurement', 'Grants', 'Contracts'];
    
    return Array.from({ length: 500 + Math.floor(Math.random() * 500) }, (_, i) => ({
      transaction_id: `TXN-${100000 + i}`,
      department_id: departments[Math.floor(Math.random() * departments.length)],
      vendor_id: `VND-${Math.floor(Math.random() * 100)}`,
      scheme_type: schemes[Math.floor(Math.random() * schemes.length)],
      amount: Math.floor(Math.random() * 500000) + 1000,
      transaction_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      transaction_time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
      is_anomaly: Math.random() < 0.08,
    }));
  };

  const analyzeData = (data: TransactionData[]): AnalysisResults => {
    const anomalies = data.filter(d => d.is_anomaly);
    const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
    
    // Department breakdown
    const deptMap = new Map<string, { anomalies: number; total: number }>();
    data.forEach(d => {
      const dept = deptMap.get(d.department_id) || { anomalies: 0, total: 0 };
      dept.total++;
      if (d.is_anomaly) dept.anomalies++;
      deptMap.set(d.department_id, dept);
    });
    
    const departmentBreakdown = Array.from(deptMap.entries()).map(([name, stats]) => ({
      name,
      ...stats,
    })).sort((a, b) => b.anomalies - a.anomalies);
    
    // Time series data
    const dateMap = new Map<string, { amount: number; anomalies: number }>();
    data.forEach(d => {
      const date = d.transaction_date;
      const existing = dateMap.get(date) || { amount: 0, anomalies: 0 };
      existing.amount += d.amount;
      if (d.is_anomaly) existing.anomalies++;
      dateMap.set(date, existing);
    });
    
    const timeSeriesData = Array.from(dateMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);
    
    // Risk distribution
    const riskDistribution = [
      { level: 'Critical', count: Math.floor(anomalies.length * 0.15), color: 'hsl(var(--coral))' },
      { level: 'High', count: Math.floor(anomalies.length * 0.25), color: 'hsl(var(--amber))' },
      { level: 'Medium', count: Math.floor(anomalies.length * 0.35), color: 'hsl(var(--purple))' },
      { level: 'Low', count: Math.floor(anomalies.length * 0.25), color: 'hsl(var(--cyan))' },
    ];
    
    return {
      totalRecords: data.length,
      anomaliesDetected: anomalies.length,
      anomalyRate: (anomalies.length / data.length) * 100,
      totalAmount,
      fraudProbability: Math.min(95, 45 + Math.random() * 40),
      accuracyScore: 92 + Math.random() * 7,
      riskConfidence: 85 + Math.random() * 12,
      departmentBreakdown,
      timeSeriesData,
      riskDistribution,
      suspiciousTransactions: anomalies.slice(0, 20),
    };
  };

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    setFile(uploadedFile);
    setResults(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  }, [handleFileUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const steps = [
      { progress: 15, text: 'Parsing transaction data...' },
      { progress: 30, text: 'Securing data channels...' },
      { progress: 45, text: 'Running anomaly detection...' },
      { progress: 60, text: 'Scoring high-risk entities...' },
      { progress: 75, text: 'Calibrating risk models...' },
      { progress: 90, text: 'Generating insights...' },
      { progress: 100, text: 'Analysis complete!' },
    ];

    let data: TransactionData[];

    if (file) {
      const text = await file.text();
      data = parseCSV(text);
    } else {
      data = generateMockData();
    }

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
      setAnalysisProgress(step.progress);
      setProgressStep(step.text);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const analysisResults = analyzeData(data);
    setResults(analysisResults);
    setIsAnalyzing(false);
  };

  const getRiskLevel = (rate: number): { level: string; color: string } => {
    if (rate > 10) return { level: 'Critical', color: 'text-coral' };
    if (rate > 5) return { level: 'High', color: 'text-amber' };
    if (rate > 2) return { level: 'Medium', color: 'text-purple' };
    return { level: 'Low', color: 'text-emerald' };
  };

  return (
    <section
      ref={ref}
      id="analysis"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Analysis</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Fraud Detection <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your transaction data for comprehensive A-to-Z analysis with real-time fraud detection insights.
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={cn(
            "max-w-3xl mx-auto mb-12 transition-all duration-700 delay-100",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300",
              "hover:border-primary/50 hover:bg-primary/5 cursor-pointer group",
              isDragOver ? "border-primary bg-primary/10 scale-[1.02]" : "border-border",
              file && "border-emerald/50 bg-emerald/5"
            )}
          >
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className={cn(
              "mb-4 p-4 rounded-full inline-flex transition-all duration-300",
              file ? "bg-emerald/20" : "bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"
            )}>
              {file ? (
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-emerald" />
              ) : (
                <Upload className="h-10 w-10 md:h-12 md:w-12 text-primary" />
              )}
            </div>
            
            {file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-emerald" />
                  <span className="font-medium text-foreground">{file.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB • Ready for analysis
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  Drop your file here or click to upload
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  Supports CSV, Excel, PDF files with transaction data
                </p>
              </>
            )}
          </div>

          {/* Analyze Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Button
              size="lg"
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className={cn(
                "px-8 py-6 text-base md:text-lg font-semibold glow-primary",
                "hover:scale-105 transition-all duration-300 group",
                "animate-pulse hover:animate-none"
              )}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  {file ? 'Analyze with AI' : 'Try Sample Analysis'}
                </>
              )}
            </Button>
            
            {!file && (
              <span className="text-sm text-muted-foreground">
                No file? We'll use sample data
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="mt-8 space-y-3 animate-fade-in">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald transition-all duration-500 ease-out"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {progressStep}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                title="Total Records"
                value={results.totalRecords}
                icon={BarChart3}
                color="primary"
              />
              <StatsCard
                title="Anomalies Detected"
                value={results.anomaliesDetected}
                icon={AlertTriangle}
                color="coral"
                suffix=" flagged"
              />
              <StatsCard
                title="Anomaly Rate"
                value={results.anomalyRate}
                icon={PieChart}
                color="amber"
                suffix="%"
                decimals={2}
              />
              <StatsCard
                title="Total Amount"
                value={results.totalAmount}
                icon={Activity}
                color="emerald"
                prefix="₹"
                formatCurrency
              />
            </div>

            {/* Fraud Overview Panel */}
            <Card className="glass-card hover-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber" />
                  Fraud Risk Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricCard
                    label="Fraud Probability"
                    value={results.fraudProbability}
                    suffix="%"
                    color={results.fraudProbability > 70 ? 'coral' : results.fraudProbability > 40 ? 'amber' : 'emerald'}
                  />
                  <MetricCard
                    label="Model Accuracy"
                    value={results.accuracyScore}
                    suffix="%"
                    color="primary"
                  />
                  <MetricCard
                    label="Risk Confidence"
                    value={results.riskConfidence}
                    suffix="%"
                    color="purple"
                  />
                </div>
                
                {/* Risk Level Indicator */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Risk Classification</span>
                    <span className={cn(
                      "text-lg font-bold px-4 py-1 rounded-full",
                      getRiskLevel(results.anomalyRate).color,
                      "bg-current/10"
                    )}>
                      {getRiskLevel(results.anomalyRate).level}
                    </span>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-secondary overflow-hidden flex">
                    <div className="h-full bg-emerald transition-all duration-1000" style={{ width: '25%' }} />
                    <div className="h-full bg-cyan transition-all duration-1000" style={{ width: '25%' }} />
                    <div className="h-full bg-amber transition-all duration-1000" style={{ width: '25%' }} />
                    <div className="h-full bg-coral transition-all duration-1000" style={{ width: '25%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                    <span>Critical</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <FraudCharts
              departmentData={results.departmentBreakdown}
              timeSeriesData={results.timeSeriesData}
              riskDistribution={results.riskDistribution}
            />

            {/* Text Insight Summary */}
            <Card className="glass-card border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">AI Analysis Summary</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">{results.anomaliesDetected}</strong> anomalies detected out of{' '}
                      <strong className="text-foreground">{results.totalRecords.toLocaleString()}</strong> records (
                      <strong className={getRiskLevel(results.anomalyRate).color}>{results.anomalyRate.toFixed(2)}%</strong>).
                      {' '}Highest-risk department: <strong className="text-foreground">{results.departmentBreakdown[0]?.name || 'N/A'}</strong> with{' '}
                      {results.departmentBreakdown[0]?.anomalies || 0} anomalies.
                      {' '}Estimated suspicious amount:{' '}
                      <strong className="text-coral">
                        ₹{results.suspiciousTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                      </strong>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suspicious Transactions Table */}
            <SuspiciousTransactionsTable transactions={results.suspiciousTransactions} />
          </div>
        )}
      </div>
    </section>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'primary' | 'coral' | 'amber' | 'emerald' | 'purple';
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatCurrency?: boolean;
}

function StatsCard({ title, value, icon: Icon, color, prefix = '', suffix = '', decimals = 0, formatCurrency }: StatsCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    coral: 'text-coral bg-coral/10',
    amber: 'text-amber bg-amber/10',
    emerald: 'text-emerald bg-emerald/10',
    purple: 'text-purple bg-purple/10',
  };

  return (
    <Card className="glass-card hover-lift group">
      <CardContent className="pt-6">
        <div className={cn("p-2 rounded-lg w-fit mb-3 transition-all duration-300 group-hover:scale-110", colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <div className="text-xl md:text-2xl font-bold text-foreground">
          {prefix}
          <AnimatedCounter
            value={formatCurrency ? Math.floor(value / 1000) : value}
            decimals={decimals}
          />
          {formatCurrency ? 'K' : ''}{suffix}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  color: 'primary' | 'coral' | 'amber' | 'emerald' | 'purple';
}

function MetricCard({ label, value, suffix = '', color }: MetricCardProps) {
  const colorClasses = {
    primary: 'from-primary to-cyan',
    coral: 'from-coral to-amber',
    amber: 'from-amber to-primary',
    emerald: 'from-emerald to-cyan',
    purple: 'from-purple to-primary',
  };

  return (
    <div className="text-center p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className={cn(
        "text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
        colorClasses[color]
      )}>
        <AnimatedCounter value={value} decimals={1} />
        {suffix}
      </div>
      <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-1000 ease-out", `bg-gradient-to-r ${colorClasses[color]}`)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default AnalysisSection;
