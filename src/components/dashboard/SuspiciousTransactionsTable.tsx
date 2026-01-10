import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  transaction_id: string;
  department_id: string;
  scheme_type: string;
  amount: number;
  transaction_date: string;
  is_anomaly: boolean;
}

interface SuspiciousTransactionsTableProps {
  transactions: Transaction[];
}

export function SuspiciousTransactionsTable({ transactions }: SuspiciousTransactionsTableProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sortField, setSortField] = useState<'amount' | 'date'>('amount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getRiskLevel = (amount: number): { level: string; color: string; bg: string } => {
    if (amount > 200000) return { level: 'Critical', color: 'text-coral', bg: 'bg-coral/10' };
    if (amount > 100000) return { level: 'High', color: 'text-amber', bg: 'bg-amber/10' };
    if (amount > 50000) return { level: 'Medium', color: 'text-purple', bg: 'bg-purple/10' };
    return { level: 'Low', color: 'text-cyan', bg: 'bg-cyan/10' };
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === 'amount') {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
    return sortOrder === 'desc' 
      ? new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
      : new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
  });

  const toggleSort = (field: 'amount' | 'date') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
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
            ({transactions.length} flagged)
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
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Transaction ID</TableHead>
                  <TableHead className="text-muted-foreground">Department</TableHead>
                  <TableHead className="text-muted-foreground">Scheme</TableHead>
                  <TableHead 
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => toggleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      {sortField === 'amount' && (
                        sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortField === 'date' && (
                        sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.slice(0, 10).map((transaction, index) => {
                  const risk = getRiskLevel(transaction.amount);
                  return (
                    <TableRow 
                      key={transaction.transaction_id}
                      className={cn(
                        "transition-all duration-300 hover:bg-primary/5 cursor-pointer",
                        "animate-fade-in"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-mono text-sm">{transaction.transaction_id}</TableCell>
                      <TableCell>{transaction.department_id}</TableCell>
                      <TableCell>{transaction.scheme_type}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(transaction.transaction_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          risk.bg,
                          risk.color
                        )}>
                          {risk.level}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {transactions.length > 10 && (
            <p className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
              Showing 10 of {transactions.length} suspicious transactions
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default SuspiciousTransactionsTable;
