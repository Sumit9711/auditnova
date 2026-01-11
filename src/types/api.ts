// Types that match the EXACT API response from https://fraud-api-6kib.onrender.com/analyze

export interface APIFraudResult {
  transaction_id: string;
  department_id: string;
  vendor_id: string;
  amount: number;
  fraud_flag: number; // 1 = fraud, 0 = not fraud
  anomaly_score: number;
  risk_score: number;
  risk_level: 'Critical' | 'High' | 'Medium' | 'Low';
  explanation: string;
}

export interface APIAnalysisResponse {
  total_transactions: number;
  fraud_detected: number;
  results: APIFraudResult[];
}

// Transformed types for the dashboard
export interface DashboardStats {
  totalTransactions: number;
  fraudDetected: number;
  fraudRate: number;
  totalFraudAmount: number;
}

export interface DepartmentAnomalies {
  name: string;
  anomalies: number;
  total: number;
  riskAmount: number;
}

export interface RiskDistribution {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TimeSeriesData {
  date: string;
  amount: number;
  anomalies: number;
}

export interface TransformedResults {
  stats: DashboardStats;
  transactions: APIFraudResult[];
  departmentData: DepartmentAnomalies[];
  riskDistribution: RiskDistribution[];
  criticalFindings: string[];
  recommendations: string[];
}
