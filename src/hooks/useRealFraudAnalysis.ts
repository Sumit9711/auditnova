import { useState, useCallback } from 'react';
import type { APIAnalysisResponse, APIFraudResult, TransformedResults } from '@/types/api';
import { toast } from 'sonner';

const API_ENDPOINT = 'https://fraud-api-6kib.onrender.com/predict';

interface UseRealFraudAnalysisReturn {
  analyzeFile: (file: File) => Promise<TransformedResults | null>;
  results: TransformedResults | null;
  rawResults: APIFraudResult[];
  isAnalyzing: boolean;
  progress: number;
  progressStep: string;
  reset: () => void;
  error: string | null;
}

const RISK_COLORS: Record<string, string> = {
  Critical: 'hsl(var(--coral))',
  High: 'hsl(var(--amber))',
  Medium: 'hsl(var(--purple))',
  Low: 'hsl(var(--cyan))',
};

function transformAPIResponse(response: APIAnalysisResponse): TransformedResults {
  const { total_transactions, fraud_detected, results } = response;

  // Calculate stats
  const fraudRate = total_transactions > 0 ? (fraud_detected / total_transactions) * 100 : 0;
  const totalFraudAmount = results
    .filter(r => r.fraud_flag === 1)
    .reduce((sum, r) => sum + r.amount, 0);

  const stats = {
    totalTransactions: total_transactions,
    fraudDetected: fraud_detected,
    fraudRate,
    totalFraudAmount,
  };

  // Department aggregation
  const deptMap = new Map<string, { anomalies: number; total: number; riskAmount: number }>();
  results.forEach(r => {
    const dept = r.department_id || 'Unknown';
    const current = deptMap.get(dept) || { anomalies: 0, total: 0, riskAmount: 0 };
    current.total++;
    if (r.fraud_flag === 1) {
      current.anomalies++;
      current.riskAmount += r.amount;
    }
    deptMap.set(dept, current);
  });

  const departmentData = Array.from(deptMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.anomalies - a.anomalies);

  // Risk distribution
  const riskCounts: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  results.filter(r => r.fraud_flag === 1).forEach(r => {
    if (r.risk_level && riskCounts[r.risk_level] !== undefined) {
      riskCounts[r.risk_level]++;
    }
  });

  const riskDistribution = Object.entries(riskCounts)
    .filter(([_, count]) => count > 0)
    .map(([level, count]) => ({
      level,
      count,
      percentage: fraud_detected > 0 ? (count / fraud_detected) * 100 : 0,
      color: RISK_COLORS[level] || 'hsl(var(--muted-foreground))',
    }));

  // Generate critical findings
  const criticalFindings: string[] = [];
  const criticalCount = riskCounts.Critical;
  const highCount = riskCounts.High;

  if (criticalCount > 0) {
    criticalFindings.push(`${criticalCount} transactions flagged as CRITICAL risk`);
  }
  if (highCount > 0) {
    criticalFindings.push(`${highCount} transactions flagged as HIGH risk`);
  }
  if (departmentData.length > 0 && departmentData[0].anomalies > 0) {
    criticalFindings.push(
      `${departmentData[0].name} department has ${departmentData[0].anomalies} suspicious transactions (₹${departmentData[0].riskAmount.toLocaleString()} at risk)`
    );
  }

  // Find highest anomaly score
  const highestScore = results.reduce((max, r) => 
    r.anomaly_score > max.anomaly_score ? r : max, 
    results[0] || { anomaly_score: 0, transaction_id: 'N/A' }
  );
  
  if (highestScore && highestScore.anomaly_score > 0) {
    criticalFindings.push(
      `Highest anomaly score: ${highestScore.anomaly_score.toFixed(1)} (Transaction: ${highestScore.transaction_id})`
    );
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (departmentData.length > 0 && departmentData[0].anomalies > 0) {
    recommendations.push(`Immediately review all transactions from ${departmentData[0].name} department`);
  }
  if (criticalCount > 0) {
    recommendations.push(`Escalate ${criticalCount} critical-risk transactions to senior management`);
  }
  recommendations.push(`Review ${criticalCount + highCount} high-priority transactions immediately`);
  recommendations.push('Implement continuous monitoring for flagged patterns');
  recommendations.push('Cross-reference flagged vendors with approved vendor list');

  return {
    stats,
    transactions: results,
    departmentData,
    riskDistribution,
    criticalFindings,
    recommendations,
  };
}

export function useRealFraudAnalysis(): UseRealFraudAnalysisReturn {
  const [results, setResults] = useState<TransformedResults | null>(null);
  const [rawResults, setRawResults] = useState<APIFraudResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  const analyzeFile = useCallback(async (file: File): Promise<TransformedResults | null> => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    setResults(null);
    setRawResults([]);

    try {
      // Step 1: Validate file
      setProgress(5);
      setProgressStep('Validating file format...');
      await new Promise(resolve => setTimeout(resolve, 300));

      const validExtensions = ['.csv', '.xlsx', '.xls'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      
      if (!validExtensions.includes(fileExtension)) {
        throw new Error('Invalid file format. Please upload CSV or Excel file.');
      }

      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 50MB.');
      }

      // Step 2: Preparing upload
      setProgress(15);
      setProgressStep('Preparing file for upload...');
      await new Promise(resolve => setTimeout(resolve, 400));

      // Step 3: Uploading to API
      setProgress(25);
      setProgressStep('Uploading to ML server...');
      
      const formData = new FormData();
      formData.append('file', file);

      // Step 4: API call
      setProgress(35);
      setProgressStep('Connecting to fraud detection API...');
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      setProgress(50);
      setProgressStep('Processing with ML model...');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText || 'Failed to analyze file'}`);
      }

      // Step 5: Parsing response
      setProgress(70);
      setProgressStep('Receiving analysis results...');
      
      const data: APIAnalysisResponse = await response.json();

      // Validate response structure
      if (typeof data.total_transactions !== 'number' || typeof data.fraud_detected !== 'number' || !Array.isArray(data.results)) {
        throw new Error('Invalid response format from API');
      }

      // Step 6: Transform data
      setProgress(85);
      setProgressStep('Generating insights and charts...');
      await new Promise(resolve => setTimeout(resolve, 500));

      const transformedResults = transformAPIResponse(data);
      setRawResults(data.results);

      // Step 7: Complete
      setProgress(100);
      setProgressStep('Analysis complete!');
      await new Promise(resolve => setTimeout(resolve, 300));

      setResults(transformedResults);
      setIsAnalyzing(false);

      toast.success(`Analysis complete! Found ${data.fraud_detected} suspicious transactions.`);
      
      return transformedResults;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setIsAnalyzing(false);
      setProgress(0);
      
      toast.error(errorMessage);
      console.error('Fraud analysis error:', err);
      
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setRawResults([]);
    setProgress(0);
    setProgressStep('');
    setError(null);
  }, []);

  return {
    analyzeFile,
    results,
    rawResults,
    isAnalyzing,
    progress,
    progressStep,
    reset,
    error,
  };
}
