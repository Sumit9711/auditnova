import { useCallback, useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, FileText, Table, CloudUpload, Sparkles, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface EnhancedFileUploadProps {
  onFileSelect: (file: File) => void;
  onStartAnalysis: () => void;
  onReset: () => void;
  selectedFile: File | null;
  previewData: Record<string, unknown>[] | null;
  previewHeaders: string[] | null;
  isLoading: boolean;
  error: string | null;
}

export function EnhancedFileUpload({
  onFileSelect,
  onStartAnalysis,
  onReset,
  selectedFile,
  previewData,
  previewHeaders,
  isLoading,
  error,
}: EnhancedFileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateFile = (file: File): string | null => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      return 'Invalid file format. Please upload CSV or Excel file (.csv, .xlsx, .xls)';
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return 'File too large. Maximum size is 50MB.';
    }

    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      // Will be handled by parent through error prop
      return;
    }
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleClick = () => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Upload Card */}
      <Card className={cn(
        "relative overflow-hidden transition-all duration-500",
        "glass-card hover-glow",
        isDragOver && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.01]",
        error && "ring-2 ring-destructive/50",
        selectedFile && !error && "ring-2 ring-emerald/50"
      )}>
        {/* Animated background gradient on drag */}
        {isDragOver && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple/10 to-cyan/20 animate-pulse" />
        )}

        <CardContent className="p-0">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={handleClick}
            className={cn(
              "relative p-8 md:p-12 lg:p-16 text-center transition-all duration-300",
              !selectedFile && "cursor-pointer hover:bg-muted/30"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Animated border dots on drag */}
            {isDragOver && (
              <div className="absolute inset-4 border-2 border-dashed border-primary rounded-xl animate-pulse" />
            )}

            {/* Icon Section */}
            <div className="relative mb-6">
              <div className={cn(
                "inline-flex p-6 rounded-full transition-all duration-500",
                error ? "bg-destructive/20" :
                selectedFile ? "bg-emerald/20" :
                isDragOver ? "bg-primary/30 scale-110" : "bg-primary/10"
              )}>
                {isLoading ? (
                  <div className="relative">
                    <div className="h-14 w-14 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <CloudUpload className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                  </div>
                ) : error ? (
                  <FileWarning className="h-14 w-14 text-destructive" />
                ) : selectedFile ? (
                  <CheckCircle2 className="h-14 w-14 text-emerald animate-scale-in" />
                ) : (
                  <Upload className={cn(
                    "h-14 w-14 text-primary transition-all duration-300",
                    isDragOver && "scale-110 animate-bounce"
                  )} />
                )}
              </div>

              {/* Glowing ring effect */}
              {(isDragOver || selectedFile) && !error && (
                <div className={cn(
                  "absolute inset-0 rounded-full blur-xl opacity-50 -z-10",
                  selectedFile ? "bg-emerald" : "bg-primary"
                )} />
              )}
            </div>

            {/* Content */}
            {error ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-destructive">{error}</h3>
                <Button variant="outline" onClick={(e) => { e.stopPropagation(); onReset(); }}>
                  Try Again
                </Button>
              </div>
            ) : selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <FileSpreadsheet className="h-6 w-6 text-emerald" />
                  <span className="text-lg font-semibold text-foreground">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onReset(); }}
                    className="h-8 w-8 p-0 hover:bg-destructive/20 rounded-full"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                    <FileText className="h-4 w-4" />
                    {formatFileSize(selectedFile.size)}
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                    <Table className="h-4 w-4" />
                    {selectedFile.name.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {isDragOver ? '✨ Drop it here!' : 'Drop your CSV or Excel file here'}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  or click to browse your files
                </p>
                
                {/* Supported formats */}
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {[
                    { ext: 'CSV', icon: '📊' },
                    { ext: 'XLSX', icon: '📗' },
                    { ext: 'XLS', icon: '📕' },
                  ].map((format) => (
                    <span
                      key={format.ext}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium"
                    >
                      <span>{format.icon}</span>
                      {format.ext}
                    </span>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Maximum file size: <span className="font-semibold">50MB</span>
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Preview Table */}
      {selectedFile && previewData && previewData.length > 0 && previewHeaders && (
        <Card className="glass-card animate-fade-in overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Table className="h-5 w-5 text-primary" />
              Data Preview
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (First {previewData.length} rows)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <UITable>
                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur z-10">
                  <TableRow>
                    {previewHeaders.slice(0, 8).map((header, idx) => (
                      <TableHead key={idx} className="whitespace-nowrap font-semibold">
                        {header}
                      </TableHead>
                    ))}
                    {previewHeaders.length > 8 && (
                      <TableHead className="text-muted-foreground">
                        +{previewHeaders.length - 8} more
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, rowIdx) => (
                    <TableRow key={rowIdx} className="hover:bg-muted/50">
                      {previewHeaders.slice(0, 8).map((header, colIdx) => (
                        <TableCell key={colIdx} className="max-w-[200px] truncate font-mono text-sm">
                          {row[header] != null ? String(row[header]) : '-'}
                        </TableCell>
                      ))}
                      {previewHeaders.length > 8 && (
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

      {/* Start Analysis Button */}
      {selectedFile && !error && (
        <div className="flex justify-center animate-fade-in">
          <Button
            size="lg"
            onClick={onStartAnalysis}
            disabled={isLoading}
            className={cn(
              "relative px-12 py-7 text-xl font-bold",
              "bg-gradient-to-r from-primary via-purple to-primary bg-[length:200%_100%]",
              "hover:bg-[position:100%_0] transition-all duration-500",
              "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
              "hover:scale-105 active:scale-100",
              "group overflow-hidden"
            )}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            {/* Pulsing glow */}
            <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-lg" />
            
            <span className="relative z-10 flex items-center gap-3">
              <Sparkles className="h-6 w-6 animate-pulse" />
              Start Analysing
              <Sparkles className="h-6 w-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
