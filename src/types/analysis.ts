// Types for the fraud detection analysis system

export interface ParsedData {
  headers: string[];
  rows: Record<string, unknown>[];
  columnTypes: Record<string, 'string' | 'number' | 'date' | 'boolean'>;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  rowCount: number;
  columnCount: number;
}

export interface TransactionRecord {
  [key: string]: any;
  _id: string;
  _anomalyScore: number;
  _riskLevel: 'Critical' | 'High' | 'Medium' | 'Low' | 'Normal';
  _reason: string;
  _isAnomaly: boolean;
}

export interface AnalysisResults {
  // Summary stats
  totalRecords: number;
  anomaliesDetected: number;
  anomalyRate: number;
  totalFraudRiskAmount: number;
  
  // Chart data
  departmentAnomalies: { name: string; anomalies: number; total: number; riskAmount: number }[];
  timeSeriesData: { date: string; normalAmount: number; anomalousAmount: number; anomalyCount: number }[];
  riskDistribution: { level: string; count: number; percentage: number; color: string }[];
  scoreDistribution: { range: string; count: number; isHighRisk: boolean }[];
  topRiskEntities: { name: string; count: number; amount: number; type: string }[];
  
  // Table data
  transactions: TransactionRecord[];
  
  // Insights
  insights: AnalysisInsights;
}

export interface AnalysisInsights {
  criticalFindings: string[];
  topRiskAreas: { category: string; detail: string }[];
  trendAnalysis: string[];
  recommendations: string[];
  highestAnomalyScore: { score: number; id: string };
  mostFlaggedEntity: { name: string; count: number; type: string };
  riskAmountRange: { min: number; max: number };
  peakRiskDate: string;
}

export interface ColumnMapping {
  id?: string;
  department?: string;
  vendor?: string;
  amount?: string;
  date?: string;
  category?: string;
}

export type SortField = 'amount' | 'date' | 'score' | 'riskLevel';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  riskLevel: string[];
  department: string;
  vendor: string;
  amountRange: [number, number];
  dateRange: [Date | null, Date | null];
}
