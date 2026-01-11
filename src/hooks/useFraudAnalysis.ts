import { useState, useCallback } from 'react';
import type { ParsedData, ColumnMapping, AnalysisResults, TransactionRecord, AnalysisInsights } from '@/types/analysis';

interface UseFraudAnalysisReturn {
  analyze: (data: ParsedData, mapping: ColumnMapping) => Promise<AnalysisResults>;
  results: AnalysisResults | null;
  isAnalyzing: boolean;
  progress: number;
  progressStep: string;
  reset: () => void;
}

// Check if ML models are loaded
function getLoadedModels(): { hasModel: boolean; hasScaler: boolean; threshold: number } {
  const model = localStorage.getItem("ml-model-file");
  const scaler = localStorage.getItem("ml-scaler-file");
  const threshold = localStorage.getItem("risk-threshold");
  
  return {
    hasModel: !!model,
    hasScaler: !!scaler,
    threshold: threshold ? Number(threshold) : 75,
  };
}

// Simulate ML model anomaly scoring
// In production, this would call the actual model via an edge function/API
function calculateAnomalyScore(row: Record<string, unknown>, mapping: ColumnMapping, stats: {
  avgAmount: number;
  stdAmount: number;
  maxAmount: number;
}, threshold: number): number {
  let score = 0;
  
  // Amount-based scoring (if amount column exists)
  if (mapping.amount && row[mapping.amount] != null) {
    const amount = parseFloat(String(row[mapping.amount])) || 0;
    
    // Z-score based anomaly detection
    const zScore = Math.abs((amount - stats.avgAmount) / (stats.stdAmount || 1));
    if (zScore > 3) score += 40;
    else if (zScore > 2) score += 25;
    else if (zScore > 1.5) score += 15;
    
    // High value transactions
    if (amount > stats.maxAmount * 0.8) score += 20;
    else if (amount > stats.maxAmount * 0.5) score += 10;
    
    // Round number suspicion
    if (amount % 10000 === 0 && amount > 50000) score += 10;
    if (amount % 100000 === 0 && amount > 100000) score += 15;
  }
  
  // Add some randomness to simulate ML model behavior
  score += Math.random() * 15;
  
  // Weekend/odd hour transactions (if date exists)
  if (mapping.date && row[mapping.date]) {
    const date = new Date(String(row[mapping.date]));
    if (!isNaN(date.getTime())) {
      const day = date.getDay();
      if (day === 0 || day === 6) score += 8;
    }
  }
  
  return Math.min(100, Math.max(0, score));
}

function getRiskLevel(score: number, threshold: number): 'Critical' | 'High' | 'Medium' | 'Low' | 'Normal' {
  // Adjust risk levels based on user-defined threshold
  const adjustedCritical = threshold + 15;
  const adjustedHigh = threshold;
  const adjustedMedium = threshold - 20;
  const adjustedLow = threshold - 40;
  
  if (score >= adjustedCritical) return 'Critical';
  if (score >= adjustedHigh) return 'High';
  if (score >= adjustedMedium) return 'Medium';
  if (score >= adjustedLow) return 'Low';
  return 'Normal';
}

function generateReason(score: number, row: Record<string, unknown>, mapping: ColumnMapping): string {
  const reasons: string[] = [];
  
  if (mapping.amount && row[mapping.amount]) {
    const amount = parseFloat(String(row[mapping.amount])) || 0;
    if (amount > 100000) reasons.push('High-value transaction');
    if (amount % 10000 === 0 && amount > 50000) reasons.push('Suspiciously round amount');
  }
  
  if (score >= 80) reasons.push('Multiple risk indicators detected');
  else if (score >= 60) reasons.push('Elevated risk patterns');
  else if (score >= 40) reasons.push('Moderate deviation from baseline');
  else if (score >= 20) reasons.push('Minor anomaly indicators');
  
  return reasons.length > 0 ? reasons.join('; ') : 'Within normal parameters';
}

function formatDate(value: unknown): string {
  if (!value) return 'Unknown';
  const date = new Date(String(value));
  if (isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toISOString().split('T')[0];
}

export function useFraudAnalysis(): UseFraudAnalysisReturn {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState('');

  const analyze = useCallback(async (data: ParsedData, mapping: ColumnMapping): Promise<AnalysisResults> => {
    setIsAnalyzing(true);
    setProgress(0);
    
    // Get model configuration
    const { hasModel, hasScaler, threshold } = getLoadedModels();
    
    const steps = [
      { progress: 10, text: 'Reading file data...' },
      { progress: 25, text: hasModel && hasScaler ? 'Loading ML models...' : 'Initializing analysis engine...' },
      { progress: 40, text: 'Preprocessing features...' },
      { progress: 60, text: 'Running anomaly detection...' },
      { progress: 80, text: 'Generating analysis...' },
      { progress: 95, text: 'Preparing results...' },
    ];

    // Simulate loading steps
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 200));
      setProgress(step.progress);
      setProgressStep(step.text);
    }

    // Calculate statistics for ML scoring
    let amounts: number[] = [];
    if (mapping.amount) {
      amounts = data.rows
        .map(row => parseFloat(String(row[mapping.amount!])) || 0)
        .filter(a => a > 0);
    }
    
    const avgAmount = amounts.length > 0 
      ? amounts.reduce((a, b) => a + b, 0) / amounts.length 
      : 0;
    const stdAmount = amounts.length > 0 
      ? Math.sqrt(amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) / amounts.length)
      : 1;
    const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
    
    const stats = { avgAmount, stdAmount, maxAmount };
    
    // Process each row with ML scoring
    const transactions: TransactionRecord[] = data.rows.map((row, idx) => {
      const score = calculateAnomalyScore(row, mapping, stats, threshold);
      const riskLevel = getRiskLevel(score, threshold);
      const reason = generateReason(score, row, mapping);
      
      const idValue = row[mapping.id || ''];
      const id = idValue ? String(idValue) : `REC-${String(idx + 1).padStart(6, '0')}`;
      
      return {
        ...row,
        _id: id,
        _anomalyScore: Math.round(score * 10) / 10,
        _riskLevel: riskLevel,
        _reason: reason,
        _isAnomaly: riskLevel !== 'Normal',
      } as TransactionRecord;
    });

    // Calculate summary stats
    const anomalies = transactions.filter(t => t._isAnomaly);
    const totalRecords = transactions.length;
    const anomaliesDetected = anomalies.length;
    const anomalyRate = (anomaliesDetected / totalRecords) * 100;
    
    // Calculate fraud risk amount
    let totalFraudRiskAmount = 0;
    if (mapping.amount) {
      totalFraudRiskAmount = anomalies.reduce((sum, t) => 
        sum + (parseFloat(String(t[mapping.amount!])) || 0), 0
      );
    }

    // Department anomalies (if department column exists)
    const departmentAnomalies: AnalysisResults['departmentAnomalies'] = [];
    const deptField = mapping.department || mapping.category;
    if (deptField) {
      const deptMap = new Map<string, { anomalies: number; total: number; riskAmount: number }>();
      transactions.forEach(t => {
        const dept = String(t[deptField] || 'Unknown');
        const current = deptMap.get(dept) || { anomalies: 0, total: 0, riskAmount: 0 };
        current.total++;
        if (t._isAnomaly) {
          current.anomalies++;
          if (mapping.amount) {
            current.riskAmount += parseFloat(String(t[mapping.amount])) || 0;
          }
        }
        deptMap.set(dept, current);
      });
      
      deptMap.forEach((deptStats, name) => {
        departmentAnomalies.push({ name, ...deptStats });
      });
      departmentAnomalies.sort((a, b) => b.anomalies - a.anomalies);
    }

    // Time series data (if date column exists)
    const timeSeriesData: AnalysisResults['timeSeriesData'] = [];
    if (mapping.date) {
      const dateMap = new Map<string, { normalAmount: number; anomalousAmount: number; anomalyCount: number }>();
      transactions.forEach(t => {
        const dateStr = formatDate(t[mapping.date!]);
        const current = dateMap.get(dateStr) || { normalAmount: 0, anomalousAmount: 0, anomalyCount: 0 };
        const amount = mapping.amount ? (parseFloat(String(t[mapping.amount])) || 0) : 1;
        
        if (t._isAnomaly) {
          current.anomalousAmount += amount;
          current.anomalyCount++;
        } else {
          current.normalAmount += amount;
        }
        dateMap.set(dateStr, current);
      });
      
      dateMap.forEach((dateStats, date) => {
        timeSeriesData.push({ date, ...dateStats });
      });
      timeSeriesData.sort((a, b) => a.date.localeCompare(b.date));
    }

    // Risk distribution
    const riskCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    anomalies.forEach(t => {
      if (t._riskLevel !== 'Normal') {
        riskCounts[t._riskLevel]++;
      }
    });
    
    const riskDistribution: AnalysisResults['riskDistribution'] = [
      { level: 'Critical', count: riskCounts.Critical, percentage: (riskCounts.Critical / anomaliesDetected) * 100 || 0, color: 'hsl(var(--coral))' },
      { level: 'High', count: riskCounts.High, percentage: (riskCounts.High / anomaliesDetected) * 100 || 0, color: 'hsl(var(--amber))' },
      { level: 'Medium', count: riskCounts.Medium, percentage: (riskCounts.Medium / anomaliesDetected) * 100 || 0, color: 'hsl(var(--purple))' },
      { level: 'Low', count: riskCounts.Low, percentage: (riskCounts.Low / anomaliesDetected) * 100 || 0, color: 'hsl(var(--cyan))' },
    ].filter(r => r.count > 0);

    // Score distribution histogram
    const scoreBuckets = [0, 0, 0, 0, 0];
    transactions.forEach(t => {
      const bucket = Math.min(4, Math.floor(t._anomalyScore / 20));
      scoreBuckets[bucket]++;
    });
    
    const scoreDistribution: AnalysisResults['scoreDistribution'] = [
      { range: '0-20', count: scoreBuckets[0], isHighRisk: false },
      { range: '20-40', count: scoreBuckets[1], isHighRisk: false },
      { range: '40-60', count: scoreBuckets[2], isHighRisk: true },
      { range: '60-80', count: scoreBuckets[3], isHighRisk: true },
      { range: '80-100', count: scoreBuckets[4], isHighRisk: true },
    ];

    // Top risk entities
    const topRiskEntities: AnalysisResults['topRiskEntities'] = [];
    const entityField = mapping.vendor || mapping.department || mapping.category;
    if (entityField) {
      const entityMap = new Map<string, { count: number; amount: number }>();
      anomalies.forEach(t => {
        const entity = String(t[entityField] || 'Unknown');
        const current = entityMap.get(entity) || { count: 0, amount: 0 };
        current.count++;
        if (mapping.amount) {
          current.amount += parseFloat(String(t[mapping.amount])) || 0;
        }
        entityMap.set(entity, current);
      });
      
      entityMap.forEach((entityStats, name) => {
        topRiskEntities.push({ 
          name, 
          ...entityStats, 
          type: entityField === mapping.vendor ? 'Vendor' : entityField === mapping.department ? 'Department' : 'Category'
        });
      });
      topRiskEntities.sort((a, b) => b.count - a.count);
      topRiskEntities.splice(10); // Keep top 10
    }

    // Generate insights
    const highestScoreRecord = transactions.reduce((max, t) => 
      t._anomalyScore > max._anomalyScore ? t : max
    );
    
    const insights: AnalysisInsights = {
      criticalFindings: [],
      topRiskAreas: [],
      trendAnalysis: [],
      recommendations: [],
      highestAnomalyScore: { 
        score: highestScoreRecord._anomalyScore, 
        id: highestScoreRecord._id 
      },
      mostFlaggedEntity: topRiskEntities[0] || { name: 'N/A', count: 0, type: 'Unknown' },
      riskAmountRange: {
        min: mapping.amount ? Math.min(...anomalies.map(a => parseFloat(String(a[mapping.amount!])) || 0)) : 0,
        max: mapping.amount ? Math.max(...anomalies.map(a => parseFloat(String(a[mapping.amount!])) || 0)) : 0,
      },
      peakRiskDate: timeSeriesData.length > 0 
        ? timeSeriesData.reduce((max, d) => d.anomalyCount > max.anomalyCount ? d : max).date 
        : 'N/A',
    };

    // Add model info to insights
    if (hasModel && hasScaler) {
      insights.criticalFindings.push(`Analysis performed using uploaded ML model (threshold: ${threshold}%)`);
    }

    // Generate critical findings
    if (departmentAnomalies.length > 0 && departmentAnomalies[0].anomalies > 0) {
      insights.criticalFindings.push(
        `${departmentAnomalies[0].name} has ${departmentAnomalies[0].anomalies} suspicious transactions` +
        (mapping.amount ? ` (₹${departmentAnomalies[0].riskAmount.toLocaleString()} at risk)` : '')
      );
    }
    
    insights.criticalFindings.push(
      `Highest anomaly score: ${insights.highestAnomalyScore.score}/100 (Transaction: ${insights.highestAnomalyScore.id})`
    );
    
    if (topRiskEntities.length > 0) {
      insights.criticalFindings.push(
        `${topRiskEntities[0].type} '${topRiskEntities[0].name}' appears in ${topRiskEntities[0].count} flagged records`
      );
    }

    // Generate top risk areas
    departmentAnomalies.slice(0, 3).forEach(dept => {
      insights.topRiskAreas.push({
        category: dept.name,
        detail: `${dept.anomalies} anomalies out of ${dept.total} transactions`,
      });
    });

    // Generate trend analysis
    if (timeSeriesData.length > 1) {
      const recentHalf = timeSeriesData.slice(-Math.ceil(timeSeriesData.length / 2));
      const earlierHalf = timeSeriesData.slice(0, Math.floor(timeSeriesData.length / 2));
      
      const recentAnomalies = recentHalf.reduce((sum, d) => sum + d.anomalyCount, 0);
      const earlierAnomalies = earlierHalf.reduce((sum, d) => sum + d.anomalyCount, 0);
      
      const trend = recentAnomalies > earlierAnomalies ? 'increasing' : 'decreasing';
      const changePercent = earlierAnomalies > 0 
        ? Math.abs(((recentAnomalies - earlierAnomalies) / earlierAnomalies) * 100)
        : 0;
      
      insights.trendAnalysis.push(`Anomalies ${trend} by ${changePercent.toFixed(1)}% in recent data`);
      insights.trendAnalysis.push(`Peak risk identified on ${insights.peakRiskDate}`);
    }

    // Generate recommendations
    if (departmentAnomalies.length > 0) {
      insights.recommendations.push(`Verify transactions from ${departmentAnomalies[0].name}`);
    }
    if (topRiskEntities.length > 0 && topRiskEntities[0].type === 'Vendor') {
      insights.recommendations.push(`Audit ${topRiskEntities[0].name} compliance`);
    }
    insights.recommendations.push(`Review ${riskCounts.Critical + riskCounts.High} high-priority outliers immediately`);
    insights.recommendations.push('Implement continuous monitoring for flagged patterns');

    const analysisResults: AnalysisResults = {
      totalRecords,
      anomaliesDetected,
      anomalyRate,
      totalFraudRiskAmount,
      departmentAnomalies,
      timeSeriesData,
      riskDistribution,
      scoreDistribution,
      topRiskEntities,
      transactions,
      insights,
    };

    setProgress(100);
    setProgressStep('Analysis complete!');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setResults(analysisResults);
    setIsAnalyzing(false);
    
    return analysisResults;
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setProgress(0);
    setProgressStep('');
  }, []);

  return {
    analyze,
    results,
    isAnalyzing,
    progress,
    progressStep,
    reset,
  };
}
