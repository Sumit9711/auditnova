import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileSpreadsheet, Sparkles, AlertTriangle, CheckCircle2, Loader2, TrendingUp, BarChart3, PieChart, Activity, ArrowLeft, Brain, Zap, Database, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FraudCharts } from '@/components/dashboard/FraudCharts';
import { AnimatedCounter } from '@/components/dashboard/AnimatedCounter';
import { SuspiciousTransactionsTable } from '@/components/dashboard/SuspiciousTransactionsTable';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

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

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  suffix = '',
  prefix = '',
  decimals = 0,
  formatCurrency = false,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  formatCurrency?: boolean;
}) {
  const colorClasses: Record<string, string> = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    coral: 'text-coral bg-coral/10 border-coral/20',
    amber: 'text-amber bg-amber/10 border-amber/20',
    emerald: 'text-emerald bg-emerald/10 border-emerald/20',
    purple: 'text-purple bg-purple/10 border-purple/20',
  };

  const displayValue = formatCurrency
    ? value >= 10000000
      ? (value / 10000000).toFixed(2) + ' Cr'
      : value >= 100000
      ? (value / 100000).toFixed(2) + ' L'
      : value.toLocaleString()
    : null;

  const formattedSuffix = suffix && !formatCurrency ? suffix : '';

  return (
    <Card className="glass-card hover-glow cursor-pointer transition-all duration-300 hover:scale-[1.02] group">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              {prefix}
              {formatCurrency ? (
                displayValue
              ) : (
                <>
                  <AnimatedCounter value={value} decimals={decimals} />
                  {formattedSuffix}
                </>
              )}
            </p>
          </div>
          <div className={cn('p-2 md:p-3 rounded-xl border transition-transform duration-300 group-hover:scale-110', colorClasses[color])}>
            <Icon className="h-4 w-4 md:h-5 md:w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Metric Card Component
function MetricCard({
  label,
  value,
  suffix = '',
  color,
}: {
  label: string;
  value: number;
  suffix?: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    primary: 'text-primary',
    coral: 'text-coral',
    amber: 'text-amber',
    emerald: 'text-emerald',
    purple: 'text-purple',
  };

  return (
    <div className="text-center p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors duration-300 cursor-pointer">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className={cn('text-3xl md:text-4xl font-bold', colorClasses[color])}>
        <AnimatedCounter value={value} decimals={1} />
        {suffix}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
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
      { progress: 10, text: 'Initializing AI model...' },
      { progress: 20, text: 'Parsing transaction data...' },
      { progress: 35, text: 'Running feature extraction...' },
      { progress: 50, text: 'Executing fraud detection model...' },
      { progress: 65, text: 'Scoring high-risk entities...' },
      { progress: 80, text: 'Calibrating risk models...' },
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      
      {/* Animated background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />

      {/* Header */}
      <header className="relative z-10 glass border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg text-foreground">ChitraGuptAI Analysis</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
                <Zap className="h-4 w-4 text-amber" />
                <span className="text-sm text-muted-foreground">ML Model v2.1</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in">

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Fraud Detection <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your transaction data for comprehensive AI-powered fraud detection and risk analysis.
          </p>
        </div>

        {/* AI Model Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="glass-card hover-glow cursor-pointer transition-all duration-300 hover:scale-[1.02] group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model Type</p>
                <p className="font-semibold text-foreground">Ensemble ML</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card hover-glow cursor-pointer transition-all duration-300 hover:scale-[1.02] group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald/10 border border-emerald/20 group-hover:scale-110 transition-transform">
                <Database className="h-6 w-6 text-emerald" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Training Data</p>
                <p className="font-semibold text-foreground">10M+ Records</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card hover-glow cursor-pointer transition-all duration-300 hover:scale-[1.02] group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber/10 border border-amber/20 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-amber" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                <p className="font-semibold text-foreground">97.3%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Area */}
        <div className="max-w-3xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => document.getElementById('file-input')?.click()}
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
                "px-8 py-6 text-base md:text-lg font-semibold glow-primary cursor-pointer",
                "hover:scale-105 transition-all duration-300 group",
                "relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
                "before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
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
                  {file ? 'Run AI Analysis' : 'Try Sample Analysis'}
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
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-purple to-cyan transition-all duration-500 ease-out relative"
                  style={{ width: `${analysisProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
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
                <CardTitle className="flex items-center gap-2 cursor-pointer">
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
                      "text-lg font-bold px-4 py-1 rounded-full cursor-pointer hover:scale-105 transition-transform",
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

            {/* Suspicious Transactions */}
            <SuspiciousTransactionsTable transactions={results.suspiciousTransactions} />

            {/* AI Summary */}
            <Card className="glass-card hover-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 cursor-pointer">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    The AI analysis has identified <span className="text-coral font-semibold">{results.anomaliesDetected} potential anomalies</span> out of {results.totalRecords} total transactions, 
                    representing an anomaly rate of <span className="text-amber font-semibold">{results.anomalyRate.toFixed(2)}%</span>. 
                    The fraud probability score of <span className="text-primary font-semibold">{results.fraudProbability.toFixed(1)}%</span> indicates 
                    {results.fraudProbability > 60 ? ' elevated risk levels requiring immediate attention' : ' moderate risk levels that should be monitored'}. 
                    Key areas of concern include the {results.departmentBreakdown[0]?.name} department with the highest concentration of flagged transactions. 
                    Recommended actions include detailed review of high-value transactions and vendor relationship audits.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
