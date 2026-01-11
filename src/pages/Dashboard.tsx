import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Zap, Sun, Moon, Database, Shield, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { useFileParser } from '@/hooks/useFileParser';
import { useFraudAnalysis } from '@/hooks/useFraudAnalysis';
import { FileUploadSection } from '@/components/dashboard/FileUploadSection';
import { AnalysisLoadingScreen } from '@/components/dashboard/AnalysisLoadingScreen';
import { SummaryStatsCards } from '@/components/dashboard/SummaryStatsCards';
import { FraudCharts } from '@/components/dashboard/FraudCharts';
import { SuspiciousTransactionsTable } from '@/components/dashboard/SuspiciousTransactionsTable';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { parseFile, parsedData, fileInfo, columnMapping, isLoading: isParsingFile, error: parseError, previewRows, reset: resetParser } = useFileParser();
  const { analyze, results, isAnalyzing, progress, progressStep, reset: resetAnalysis } = useFraudAnalysis();
  const [showResults, setShowResults] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    resetAnalysis();
    setShowResults(false);
    await parseFile(file);
  }, [parseFile, resetAnalysis]);

  const handleStartAnalysis = useCallback(async () => {
    if (!parsedData) return;
    const analysisResults = await analyze(parsedData, columnMapping);
    if (analysisResults) {
      setShowResults(true);
    }
  }, [parsedData, columnMapping, analyze]);

  const handleReset = useCallback(() => {
    resetParser();
    resetAnalysis();
    setShowResults(false);
  }, [resetParser, resetAnalysis]);

  // Transform results for existing chart components
  const chartData = results ? {
    departmentData: results.departmentAnomalies.map(d => ({ name: d.name, anomalies: d.anomalies, total: d.total })),
    timeSeriesData: results.timeSeriesData.map(d => ({ date: d.date, amount: d.normalAmount + d.anomalousAmount, anomalies: d.anomalyCount })),
    riskDistribution: results.riskDistribution.map(r => ({ level: r.level, count: r.count, color: r.color })),
  } : null;

  // Transform transactions for table
  const tableTransactions = results?.transactions.filter(t => t._isAnomaly).slice(0, 50).map(t => ({
    transaction_id: t._id,
    department_id: t[columnMapping.department || ''] || 'N/A',
    vendor_id: t[columnMapping.vendor || ''] || 'N/A',
    scheme_type: t[columnMapping.category || ''] || 'General',
    amount: columnMapping.amount ? parseFloat(t[columnMapping.amount]) || 0 : 0,
    transaction_date: t[columnMapping.date || ''] || new Date().toISOString().split('T')[0],
    transaction_time: '12:00:00',
    is_anomaly: t._isAnomaly,
  })) || [];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Loading Screen */}
      {isAnalyzing && <AnalysisLoadingScreen progress={progress} progressStep={progressStep} />}

      {/* Header */}
      <header className="relative z-10 glass border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg text-foreground">AnomalyGuard AI</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
                <Zap className="h-4 w-4 text-amber" />
                <span className="text-sm text-muted-foreground">ML Model v2.1</span>
              </div>
              <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 cursor-pointer">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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

        {/* Model Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {[
            { icon: Brain, title: 'Model Type', value: 'Ensemble ML', color: 'primary' },
            { icon: Database, title: 'Training Data', value: '10M+ Records', color: 'emerald' },
            { icon: Shield, title: 'Accuracy Rate', value: '97.3%', color: 'amber' },
          ].map((item, idx) => (
            <Card key={idx} className="glass-card hover-glow cursor-pointer transition-all duration-300 hover:scale-[1.02] group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn("p-3 rounded-xl border group-hover:scale-110 transition-transform", `bg-${item.color}/10 border-${item.color}/20`)}>
                  <item.icon className={cn("h-6 w-6", `text-${item.color}`)} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* File Upload or Results */}
        {!showResults ? (
          <div className="max-w-4xl mx-auto">
            <FileUploadSection
              onFileSelect={handleFileSelect}
              fileInfo={fileInfo}
              previewRows={previewRows}
              parsedData={parsedData}
              isLoading={isParsingFile}
              error={parseError}
              onStartAnalysis={handleStartAnalysis}
              onReset={handleReset}
            />
          </div>
        ) : results && chartData && (
          <div className="space-y-8 animate-fade-in">
            {/* New Analysis Button */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <Upload className="h-4 w-4" /> Analyze New File
              </Button>
            </div>

            {/* Summary Stats */}
            <SummaryStatsCards
              totalRecords={results.totalRecords}
              anomaliesDetected={results.anomaliesDetected}
              anomalyRate={results.anomalyRate}
              totalFraudRiskAmount={results.totalFraudRiskAmount}
            />

            {/* Charts */}
            <FraudCharts
              departmentData={chartData.departmentData}
              timeSeriesData={chartData.timeSeriesData}
              riskDistribution={chartData.riskDistribution}
            />

            {/* Transactions Table */}
            <SuspiciousTransactionsTable transactions={tableTransactions} />

            {/* AI Summary */}
            <Card className="glass-card hover-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 font-mono text-sm">
                  <p className="text-lg font-bold mb-3">📊 ANALYSIS SUMMARY</p>
                  <p className="text-muted-foreground mb-4">────────────────────────────</p>
                  <p className="mb-2">✓ <span className="text-coral font-semibold">{results.anomaliesDetected}</span> anomalies detected out of {results.totalRecords.toLocaleString()} records ({results.anomalyRate.toFixed(2)}% fraud rate)</p>
                  
                  <p className="text-amber font-semibold mt-4 mb-2">🚨 CRITICAL FINDINGS:</p>
                  {results.insights.criticalFindings.map((finding, idx) => (
                    <p key={idx} className="ml-4 text-muted-foreground">• {finding}</p>
                  ))}
                  
                  <p className="text-primary font-semibold mt-4 mb-2">💡 RECOMMENDED ACTIONS:</p>
                  {results.insights.recommendations.map((rec, idx) => (
                    <p key={idx} className="ml-4 text-muted-foreground">{idx + 1}. {rec}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
