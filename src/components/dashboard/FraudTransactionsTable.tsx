import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { AlertTriangle, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { APIFraudResult } from '@/types/api';

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
  const [sortField, setSortField] = useState<'amount' | 'risk_score'>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string | null>(null);

  const fraudulentTransactions = transactions.filter(t => t.fraud_flag === 1);

  const filteredTransactions = fraudulentTransactions.filter(t => {
    const matchesSearch = searchTerm === '' || 
      t.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === null || t.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'amount') {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
    return sortOrder === 'desc' ? b.risk_score - a.risk_score : a.risk_score - b.risk_score;
  });

  const toggleSort = (field: 'amount' | 'risk_score') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const riskLevels = ['Critical', 'High', 'Medium', 'Low'];

  return (
    <Card className="glass-card hover-glow transition-all duration-300">
      <CardHeader className="cursor-pointer flex flex-row items-center justify-between" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-coral" />
          Flagged Transactions
          <span className="text-sm font-normal text-muted-foreground ml-2">({fraudulentTransactions.length} suspicious)</span>
        </CardTitle>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by transaction ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setRiskFilter(null)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all", riskFilter === null ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>All</button>
              {riskLevels.map((level) => (
                <button key={level} onClick={() => setRiskFilter(riskFilter === level ? null : level)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all", riskFilter === level ? `${riskStyles[level].bg} ${riskStyles[level].color}` : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>{level}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Transaction ID</TableHead>
                  <TableHead className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort('amount')}>
                    <div className="flex items-center gap-1">Amount {sortField === 'amount' && (sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />)}</div>
                  </TableHead>
                  <TableHead className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort('risk_score')}>
                    <div className="flex items-center gap-1">Risk Score {sortField === 'risk_score' && (sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />)}</div>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Risk Level</TableHead>
                  <TableHead className="text-muted-foreground">Explanation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.slice(0, 15).map((transaction, index) => {
                  const style = riskStyles[transaction.risk_level] || riskStyles.Low;
                  return (
                    <TableRow key={transaction.transaction_id} className={cn("transition-all duration-300 hover:bg-primary/5 cursor-pointer", "animate-fade-in")} style={{ animationDelay: `${index * 50}ms` }}>
                      <TableCell className="font-mono text-sm">{transaction.transaction_id}</TableCell>
                      <TableCell className="font-semibold">₹{transaction.amount.toLocaleString()}</TableCell>
                      <TableCell><span className="font-mono text-sm">{transaction.risk_score.toFixed(2)}</span></TableCell>
                      <TableCell><span className={cn("px-3 py-1 rounded-full text-xs font-medium", style.bg, style.color)}>{transaction.risk_level}</span></TableCell>
                      <TableCell className="max-w-xs">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex items-center gap-1 text-muted-foreground text-sm truncate">
                              {transaction.explanation.length > 30 ? transaction.explanation.slice(0, 30) + '...' : transaction.explanation}
                              {transaction.explanation.length > 30 && <Info className="h-3 w-3 flex-shrink-0" />}
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm"><p>{transaction.explanation}</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredTransactions.length === 0 && <p className="text-center text-muted-foreground py-8">No matching transactions found</p>}
          {sortedTransactions.length > 15 && <p className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t border-border">Showing 15 of {sortedTransactions.length} suspicious transactions</p>}
        </CardContent>
      )}
    </Card>
  );
}

export default FraudTransactionsTable;
