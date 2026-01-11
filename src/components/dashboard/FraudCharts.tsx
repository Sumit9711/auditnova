import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DepartmentData {
  name: string;
  anomalies: number;
  total: number;
}

interface TimeSeriesData {
  date: string;
  amount: number;
  anomalies: number;
}

interface RiskData {
  level: string;
  count: number;
  color: string;
}

interface FraudChartsProps {
  departmentData: DepartmentData[];
  timeSeriesData: TimeSeriesData[];
  riskDistribution: RiskData[];
}

export function FraudCharts({ departmentData, timeSeriesData, riskDistribution }: FraudChartsProps) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Department Anomalies Bar Chart */}
      <Card className="glass-card hover-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Anomalies by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData.slice(0, 6)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={80}
                  tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '...' : value}
                />
                <Tooltip content={<CustomTooltip active={false} payload={[]} label={''} />} />
                <Bar
                  dataKey="anomalies"
                  fill="hsl(var(--coral))"
                  radius={[0, 4, 4, 0]}
                  animationDuration={1500}
                  animationBegin={0}
                >
                  {departmentData.slice(0, 6).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? 'hsl(var(--coral))' : index === 1 ? 'hsl(var(--amber))' : 'hsl(var(--primary))'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Amount Over Time */}
      <Card className="glass-card hover-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <TrendingUp className="h-5 w-5 text-emerald" />
          <CardTitle className="text-lg">Transaction Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timeSeriesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--coral))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--coral))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip active={false} payload={[]} label={''} />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="amount"
                  name="Amount (₹)"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution Pie Chart */}
      <Card className="glass-card hover-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <PieChartIcon className="h-5 w-5 text-purple" />
          <CardTitle className="text-lg">Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] w-full flex items-center justify-center">
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
          </div>
        </CardContent>
      </Card>

      {/* Anomaly vs Normal Chart */}
      <Card className="glass-card hover-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <BarChart3 className="h-5 w-5 text-amber" />
          <CardTitle className="text-lg">Anomaly Detection Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeSeriesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip active={false} payload={[]} label={''} />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="anomalies"
                  name="Anomalies"
                  stroke="hsl(var(--coral))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--coral))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--coral))' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FraudCharts;
