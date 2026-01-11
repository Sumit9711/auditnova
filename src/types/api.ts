// Types that match the EXACT API response from https://fraud-api-6kib.onrender.com/predict
// Based on the backend code at https://github.com/AKASHKATYAN/Fraud-API

export interface APIFraudResult {
  transaction_id: string;
  amount: number;
  fraud_flag: number; // 1 = fraud, 0 = not fraud
  risk_score: number;
  risk_level: 'Critical' | 'High' | 'Medium' | 'Low';
  explanation: string;
}

export interface APIAnalysisResponse {
  total_transactions: number;
  fraud_detected: number;
  results: APIFraudResult[];
}

// Transformed types for the dashboard (calculated on frontend from API data)
export interface DashboardStats {
  totalTransactions: number;
  fraudDetected: number;
  fraudRate: number;
  totalFraudAmount: number;
}

export interface RiskDistribution {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TransformedResults {
  stats: DashboardStats;
  transactions: APIFraudResult[];
  riskDistribution: RiskDistribution[];
  criticalFindings: string[];
  recommendations: string[];
}
