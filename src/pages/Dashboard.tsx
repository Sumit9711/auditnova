import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Zap, Sun, Moon, Database, Shield, Upload, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { useRealFraudAnalysis } from '@/hooks/useRealFraudAnalysis';
import { EnhancedFileUpload } from '@/components/dashboard/EnhancedFileUpload';
import { APILoadingScreen } from '@/components/dashboard/APILoadingScreen';
import { SummaryStatsCards } from '@/components/dashboard/SummaryStatsCards';
import { FraudCharts } from '@/components/dashboard/FraudCharts';
import { FraudTransactionsTable } from '@/components/dashboard/FraudTransactionsTable';
import { cn } from '@/lib/utils';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { analyzeFile, results, rawResults, isAnalyzing, progress, progressStep, reset: resetAnalysis, error } = useRealFraudAnalysis();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[] | null>(null);
  const [previewHeaders, setPreviewHeaders] = useState<string[] | null>(null);
  const [isParsingPreview, setIsParsingPreview] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Parse file for preview when selected
  const parseFilePreview = useCallback(async (file: File) => {
    setIsParsingPreview(true);
    setParseError(null);
    setPreviewData(null);
    setPreviewHeaders(null);

    try {
      const extension = file.name.toLowerCase().split('.').pop();

      if (extension === 'csv') {
        // Parse CSV
        const text = await file.text();
        Papa.parse(text, {
          header: true,
          preview: 5,
          skipEmptyLines: true,
          complete: (result) => {
            if (result.errors.length > 0) {
              setParseError('Error parsing CSV file');
              return;
            }
            const headers = result.meta.fields || [];
            setPreviewHeaders(headers);
            setPreviewData(result.data as Record<string, unknown>[]);
          },
          error: (err) => {
            setParseError(`CSV parsing error: ${err.message}`);
          }
        });
      } else if (extension === 'xlsx' || extension === 'xls') {
        // Parse Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as unknown[][];
        
        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1, 6).map(row => {
            const rowObj: Record<string, unknown> = {};
            headers.forEach((header, idx) => {
              rowObj[header] = (row as unknown[])[idx];
            });
            return rowObj;
          });
          setPreviewHeaders(headers);
          setPreviewData(rows);
        }
      } else {
        setParseError('Unsupported file format. Please use CSV or Excel files.');
      }
    } catch (err) {
      setParseError(`Error reading file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsParsingPreview(false);
    }
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setParseError(null);
    parseFilePreview(file);
  }, [parseFilePreview]);

  const handleStartAnalysis = useCallback(async () => {
    if (!selectedFile) return;
    
    const analysisResults = await analyzeFile(selectedFile);
    if (analysisResults) {
      setShowResults(true);
    }
  }, [selectedFile, analyzeFile]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setPreviewData(null);
    setPreviewHeaders(null);
    setParseError(null);
    resetAnalysis();
    setShowResults(false);
  }, [resetAnalysis]);

  // Transform results for charts using exact API field names
  const chartData = results ? {
    departmentData: results.departmentData.map(d => ({ 
      name: d.name, 
      anomalies: d.anomalies, 
      total: d.total 
    })),
    timeSeriesData: [] as { date: string; amount: number; anomalies: number }[], // API doesn't return time series
    riskDistribution: results.riskDistribution.map(r => ({ 
      level: r.level, 
      count: r.count, 
      color: r.color 
    })),
  } : null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Loading Screen */}
      {isAnalyzing && <APILoadingScreen progress={progress} progressStep={progressStep} />}

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
                <span className="font-bold text-lg text-foreground">AnomalyGuard Analysis</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
                <Zap className="h-4 w-4 text-amber" />    
                <span className="text-sm text-muted-foreground">ML Model v2.0</span>
              </div>
              <a 
                href="https://fraud-api-6kib.onrender.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                API
              </a>
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
            Upload your transaction data for real-time AI-powered fraud detection using our deployed ML model.
          </p>
        </div>

        {/* Model Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {[
            { icon: Brain, title: 'Model Type', value: 'Isolation Forest', color: 'primary' },
            { icon: Database, title: 'API Status', value: 'Online', color: 'emerald' },
            { icon: Shield, title: 'Accuracy Rate', value: '90.5%', color: 'amber' },
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
            <EnhancedFileUpload
              onFileSelect={handleFileSelect}
              onStartAnalysis={handleStartAnalysis}
              onReset={handleReset}
              selectedFile={selectedFile}
              previewData={previewData}
              previewHeaders={previewHeaders}
              isLoading={isParsingPreview}
              error={parseError || error}
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

            {/* Summary Stats - using exact API field names */}
            <SummaryStatsCards
              totalRecords={results.stats.totalTransactions}
              anomaliesDetected={results.stats.fraudDetected}
              anomalyRate={results.stats.fraudRate}
              totalFraudRiskAmount={results.stats.totalFraudAmount}
            />

            {/* Charts */}
            <FraudCharts
              departmentData={chartData.departmentData}
              timeSeriesData={chartData.timeSeriesData}
              riskDistribution={chartData.riskDistribution}
            />

            {/* Transactions Table - using exact API response */}
            <FraudTransactionsTable transactions={rawResults} />

            {/* AI Summary */}
            <Card className="glass-card hover-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 font-mono text-sm">
                  <p className="mb-2">
                    ✓ <span className="text-coral font-semibold">{results.stats.fraudDetected}</span> fraud cases detected out of {results.stats.totalTransactions.toLocaleString()} transactions ({results.stats.fraudRate.toFixed(2)}% fraud rate)
                  </p>
                  
                  <p className="text-amber font-semibold mt-4 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> CRITICAL FINDINGS:
                  </p>
                  {results.criticalFindings.map((finding, idx) => (
                    <p key={idx} className="ml-4 text-muted-foreground">• {finding}</p>
                  ))}
                  
                  <p className="text-primary font-semibold mt-4 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> RECOMMENDED ACTIONS:
                  </p>
                  {results.recommendations.map((rec, idx) => (
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
