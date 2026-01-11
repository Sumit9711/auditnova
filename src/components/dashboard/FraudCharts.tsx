import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { APIFraudResult } from '@/types/api';

interface RiskData {
  level: string;
  count: number;
  color: string;
}

interface FraudChartsProps {
  riskDistribution: RiskData[];
  transactions: APIFraudResult[];
}

export function FraudCharts({ riskDistribution, transactions }: FraudChartsProps) {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Custom tooltip styles
  interface TooltipPayload {
    name: string;
    value: number | string;
    color: string;
  }
  const CustomTooltip = ({ active, payload, label }: { active: boolean; payload: TooltipPayload[]; label: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 text-sm border border-primary/20">
          <p className="font-medium text-foreground mb-1">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const COLORS = ['hsl(var(--coral))', 'hsl(var(--amber))', 'hsl(var(--purple))', 'hsl(var(--cyan))'];

  // Calculate amount distribution by risk level from transactions
  const fraudTransactions = transactions.filter(t => t.fraud_flag === 1);
  const amountByRisk = ['Critical', 'High', 'Medium', 'Low'].map(level => {
    const amount = fraudTransactions
      .filter(t => t.risk_level === level)
      .reduce((sum, t) => sum + t.amount, 0);
    return { level, amount };
  }).filter(d => d.amount > 0);

  // Top 10 highest risk transactions for bar chart
  const topRiskTransactions = [...fraudTransactions]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 8)
    .map(t => ({
      id: t.transaction_id.length > 8 ? t.transaction_id.slice(0, 8) + '...' : t.transaction_id,
      amount: t.amount,
      riskScore: t.risk_score,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Distribution Pie Chart */}
      <Card className="glass-card hover-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <PieChartIcon className="h-5 w-5 text-purple" />
          <CardTitle className="text-lg">Risk Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] w-full flex items-center justify-center">
            {riskDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="level"
                    animationDuration={1500}
                    animationBegin={0}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip active={false} payload={[]} label={''} />} />
                  <Legend
                    formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground">No fraud detected</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Amount by Risk Level Bar Chart */}
      <Card className="glass-card hover-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <TrendingUp className="h-5 w-5 text-amber" />
          <CardTitle className="text-lg">Amount at Risk by Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] w-full">
            {amountByRisk.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={amountByRisk}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    dataKey="level"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={60}
                  />
                  <Tooltip 
                    content={<CustomTooltip active={false} payload={[]} label={''} />}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar
                    dataKey="amount"
                    name="Amount"
                    radius={[0, 4, 4, 0]}
                    animationDuration={1500}
                  >
                    {amountByRisk.map((entry, index) => {
                      const colorMap: Record<string, string> = {
                        Critical: 'hsl(var(--coral))',
                        High: 'hsl(var(--amber))',
                        Medium: 'hsl(var(--purple))',
                        Low: 'hsl(var(--cyan))',
                      };
                      return <Cell key={`cell-${index}`} fill={colorMap[entry.level] || COLORS[index]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No fraud detected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Risk Transactions */}
      <Card className="glass-card hover-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <AlertTriangle className="h-5 w-5 text-coral" />
          <CardTitle className="text-lg">Highest Risk Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] w-full">
            {topRiskTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topRiskTransactions}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="id"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                  />
                  <Tooltip content={<CustomTooltip active={false} payload={[]} label={''} />} />
                  <Bar
                    dataKey="riskScore"
                    name="Risk Score"
                    fill="hsl(var(--coral))"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No fraud detected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Amount Distribution */}
      <Card className="glass-card hover-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Top Suspicious Amounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] w-full">
            {topRiskTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topRiskTransactions}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="id"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    content={<CustomTooltip active={false} payload={[]} label={''} />}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar
                    dataKey="amount"
                    name="Amount"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No fraud detected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FraudCharts;
