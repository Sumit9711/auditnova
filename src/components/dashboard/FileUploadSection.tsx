import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, FileText, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { FileInfo, ParsedData } from '@/types/analysis';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowRight } from 'lucide-react';

interface FileUploadSectionProps {
  onFileSelect: (file: File) => void;
  fileInfo: FileInfo | null;
  previewRows: Record<string, unknown>[];
  parsedData: ParsedData | null;
  isLoading: boolean;
  error: string | null;
  onStartAnalysis: () => void;
  onReset: () => void;
}

export function FileUploadSection({
  onFileSelect,
  fileInfo,
  previewRows,
  parsedData,
  isLoading,
  error,
  onStartAnalysis,
  onReset,
}: FileUploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !fileInfo && document.getElementById('file-upload-input')?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300",
          !fileInfo && "hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
          isDragOver && "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20",
          error && "border-destructive/50 bg-destructive/5",
          fileInfo && !error && "border-emerald/50 bg-emerald/5"
        )}
      >
        <input
          id="file-upload-input"
          type="file"
          accept=".csv,.xlsx,.xls,.json,.tsv"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* Animated border glow on drag */}
        {isDragOver && (
          <div className="absolute inset-0 rounded-2xl animate-pulse">
            <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-50" />
          </div>
        )}
        
        <div className={cn(
          "mb-4 p-4 rounded-full inline-flex transition-all duration-300",
          error ? "bg-destructive/20" :
          fileInfo ? "bg-emerald/20" : 
          "bg-primary/10 group-hover:bg-primary/20"
        )}>
          {isLoading ? (
            <div className="h-10 w-10 md:h-12 md:w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : error ? (
            <AlertCircle className="h-10 w-10 md:h-12 md:w-12 text-destructive" />
          ) : fileInfo ? (
            <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-emerald" />
          ) : (
            <Upload className={cn(
              "h-10 w-10 md:h-12 md:w-12 text-primary transition-transform duration-300",
              isDragOver && "scale-110"
            )} />
          )}
        </div>
        
        {error ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-destructive">{error}</h3>
            <Button variant="outline" onClick={(e) => { e.stopPropagation(); onReset(); }} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : fileInfo ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald" />
              <span className="font-medium text-foreground">{fileInfo.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onReset(); }}
                className="h-6 w-6 p-0 ml-2 hover:bg-destructive/20"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {formatFileSize(fileInfo.size)}
              </span>
              <span className="flex items-center gap-1">
                <Table className="h-4 w-4" />
                {fileInfo.rowCount.toLocaleString()} rows
              </span>
              <span>{fileInfo.columnCount} columns</span>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
              {isDragOver ? 'Drop your file here!' : 'Drag & drop your file here'}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base mb-4">
              or click to browse
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded bg-secondary">CSV</span>
              <span className="px-2 py-1 rounded bg-secondary">Excel (.xlsx, .xls)</span>
              <span className="px-2 py-1 rounded bg-secondary">JSON</span>
              <span className="px-2 py-1 rounded bg-secondary">TSV</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Max file size: 50MB</p>
          </>
        )}
      </div>

      {/* Data Preview Table */}
      {parsedData && previewRows.length > 0 && (
        <Card className="glass-card animate-fade-in overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Table className="h-5 w-5 text-primary" />
              Data Preview
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (First {previewRows.length} of {parsedData.rows.length.toLocaleString()} rows)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <UITable>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    {parsedData.headers.slice(0, 8).map((header, idx) => (
                      <TableHead key={idx} className="whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold">{header}</span>
                        </div>
                      </TableHead>
                    ))}
                    {parsedData.headers.length > 8 && (
                      <TableHead className="text-muted-foreground">
                        +{parsedData.headers.length - 8} more
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewRows.map((row, rowIdx) => (
                    <TableRow key={rowIdx} className="hover:bg-muted/50">
                      {parsedData.headers.slice(0, 8).map((header, colIdx) => (
                        <TableCell key={colIdx} className="max-w-[200px] truncate">
                          {row[header] != null ? String(row[header]) : '-'}
                        </TableCell>
                      ))}
                      {parsedData.headers.length > 8 && (
                        <TableCell className="text-muted-foreground">...</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </UITable>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analyze Button */}
      {fileInfo && !error && (
        <div className="flex justify-center animate-fade-in">
          <Button
            size="lg"
            onClick={onStartAnalysis}
            className={cn(
              "px-10 py-6 text-lg font-semibold glow-primary cursor-pointer",
              "hover:scale-105 transition-all duration-300 group",
              "relative overflow-hidden",
              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
              "before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
            )}
          >
        <span className="relative z-10 flex items-center gap-2 font-bold text-black">
              Analyze Data
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
