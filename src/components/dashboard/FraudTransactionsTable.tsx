import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, ChevronDown, ChevronUp, Search, Filter, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { APIFraudResult } from '@/types/api';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FraudTransactionsTableProps {
  transactions: APIFraudResult[];
}

const riskStyles: Record<string, { color: string; bg: string }> = {
  Critical: { color: 'text-coral', bg: 'bg-coral/10' },
  High: { color: 'text-amber', bg: 'bg-amber/10' },
  Medium: { color: 'text-purple', bg: 'bg-purple/10' },
  Low: { color: 'text-cyan', bg: 'bg-cyan/10' },
};

export function FraudTransactionsTable({ transactions }: FraudTransactionsTableProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sortField, setSortField] = useState<'amount' | 'risk_score' | 'anomaly_score'>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string | null>(null);

  // Only show flagged transactions (fraud_flag === 1)
  const flaggedTransactions = transactions.filter(t => t.fraud_flag === 1);

  // Apply search and filter
  const filteredTransactions = flaggedTransactions.filter(t => {
    const matchesSearch = 
      t.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.vendor_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = !riskFilter || t.risk_level === riskFilter;
    
    return matchesSearch && matchesRisk;
  });

  // Apply sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const getValue = (t: APIFraudResult) => {
      switch (sortField) {
        case 'amount': return t.amount;
        case 'risk_score': return t.risk_score;
        case 'anomaly_score': return t.anomaly_score;
        default: return 0;
      }
    };
    const aVal = getValue(a);
    const bVal = getValue(b);
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const toggleSort = (field: 'amount' | 'risk_score' | 'anomaly_score') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: 'amount' | 'risk_score' | 'anomaly_score' }) => {
    if (sortField !== field) return null;
    return sortOrder === 'desc' 
      ? <ChevronDown className="h-4 w-4" /> 
      : <ChevronUp className="h-4 w-4" />;
  };

  return (
    <Card className="glass-card hover-glow transition-all duration-300">
      <CardHeader 
        className="cursor-pointer flex flex-row items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-coral" />
          Suspicious Transactions
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({flaggedTransactions.length} flagged)
          </span>
        </CardTitle>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, department, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['Critical', 'High', 'Medium', 'Low'].map((level) => (
                <Button
                  key={level}
                  variant={riskFilter === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRiskFilter(riskFilter === level ? null : level)}
                  className={cn(
                    "text-xs",
                    riskFilter === level && riskStyles[level]?.bg
                  )}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Transaction ID</TableHead>
                  <TableHead className="text-muted-foreground">Department</TableHead>
                  <TableHead className="text-muted-foreground">Vendor</TableHead>
                  <TableHead 
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => toggleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      <SortIcon field="amount" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => toggleSort('anomaly_score')}
                  >
                    <div className="flex items-center gap-1">
                      Anomaly Score
                      <SortIcon field="anomaly_score" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => toggleSort('risk_score')}
                  >
                    <div className="flex items-center gap-1">
                      Risk Score
                      <SortIcon field="risk_score" />
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Risk Level</TableHead>
                  <TableHead className="text-muted-foreground">Explanation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.slice(0, 20).map((transaction, index) => {
                  const risk = riskStyles[transaction.risk_level] || { color: 'text-muted-foreground', bg: 'bg-secondary' };
                  
                  return (
                    <TableRow 
                      key={transaction.transaction_id}
                      className={cn(
                        "transition-all duration-300 hover:bg-primary/5 cursor-pointer",
                        "animate-fade-in"
                      )}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <TableCell className="font-mono text-sm font-medium">
                        {transaction.transaction_id}
                      </TableCell>
                      <TableCell>{transaction.department_id}</TableCell>
                      <TableCell>{transaction.vendor_id}</TableCell>
                      <TableCell className="font-semibold tabular-nums">
                        ₹{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium tabular-nums",
                          transaction.anomaly_score >= 80 ? "text-coral" :
                          transaction.anomaly_score >= 60 ? "text-amber" :
                          "text-muted-foreground"
                        )}>
                          {transaction.anomaly_score.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium tabular-nums",
                          transaction.risk_score >= 80 ? "text-coral" :
                          transaction.risk_score >= 60 ? "text-amber" :
                          "text-muted-foreground"
                        )}>
                          {transaction.risk_score.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          risk.bg,
                          risk.color
                        )}>
                          {transaction.risk_level}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm text-muted-foreground truncate block cursor-help">
                                {transaction.explanation || 'No explanation provided'}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <p>{transaction.explanation || 'No explanation provided'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {sortedTransactions.length > 20 && (
            <p className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
              Showing 20 of {sortedTransactions.length} suspicious transactions
            </p>
          )}

          {sortedTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No transactions match your filters</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default FraudTransactionsTable;
