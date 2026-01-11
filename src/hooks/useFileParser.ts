import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { ParsedData, FileInfo, ColumnMapping } from '@/types/analysis';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface UseFileParserReturn {
  parseFile: (file: File) => Promise<void>;
  parsedData: ParsedData | null;
  fileInfo: FileInfo | null;
  columnMapping: ColumnMapping;
  isLoading: boolean;
  error: string | null;
  previewRows: Record<string, any>[];
  reset: () => void;
}

// Detect column type from sample values
function detectColumnType(values: any[]): 'string' | 'number' | 'date' | 'boolean' {
  const sampleValues = values.filter(v => v != null && v !== '').slice(0, 100);
  if (sampleValues.length === 0) return 'string';
  
  // Check for boolean
  const boolCount = sampleValues.filter(v => 
    typeof v === 'boolean' || 
    ['true', 'false', '0', '1', 'yes', 'no'].includes(String(v).toLowerCase())
  ).length;
  if (boolCount / sampleValues.length > 0.8) return 'boolean';
  
  // Check for number
  const numCount = sampleValues.filter(v => !isNaN(parseFloat(v)) && isFinite(Number(v))).length;
  if (numCount / sampleValues.length > 0.8) return 'number';
  
  // Check for date
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}/, // ISO date
    /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}/, // DD-MM-YYYY
  ];
  const dateCount = sampleValues.filter(v => 
    datePatterns.some(p => p.test(String(v))) || !isNaN(Date.parse(String(v)))
  ).length;
  if (dateCount / sampleValues.length > 0.7) return 'date';
  
  return 'string';
}

// Auto-detect column mapping based on column names
function autoDetectMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  const lowerHeaders = headers.map(h => h.toLowerCase().replace(/[_\s-]/g, ''));
  
  // ID column detection
  const idPatterns = ['id', 'transactionid', 'txnid', 'recordid', 'refno', 'referenceno'];
  const idIdx = lowerHeaders.findIndex(h => idPatterns.some(p => h.includes(p)));
  if (idIdx >= 0) mapping.id = headers[idIdx];
  
  // Department column detection
  const deptPatterns = ['department', 'dept', 'division', 'unit', 'branch', 'office'];
  const deptIdx = lowerHeaders.findIndex(h => deptPatterns.some(p => h.includes(p)));
  if (deptIdx >= 0) mapping.department = headers[deptIdx];
  
  // Vendor column detection
  const vendorPatterns = ['vendor', 'supplier', 'merchant', 'payee', 'beneficiary', 'recipient'];
  const vendorIdx = lowerHeaders.findIndex(h => vendorPatterns.some(p => h.includes(p)));
  if (vendorIdx >= 0) mapping.vendor = headers[vendorIdx];
  
  // Amount column detection
  const amountPatterns = ['amount', 'value', 'total', 'sum', 'price', 'cost', 'payment'];
  const amountIdx = lowerHeaders.findIndex(h => amountPatterns.some(p => h.includes(p)));
  if (amountIdx >= 0) mapping.amount = headers[amountIdx];
  
  // Date column detection
  const datePatterns = ['date', 'time', 'timestamp', 'created', 'transactiondate'];
  const dateIdx = lowerHeaders.findIndex(h => datePatterns.some(p => h.includes(p)));
  if (dateIdx >= 0) mapping.date = headers[dateIdx];
  
  // Category column detection
  const catPatterns = ['category', 'type', 'scheme', 'program', 'project'];
  const catIdx = lowerHeaders.findIndex(h => catPatterns.some(p => h.includes(p)));
  if (catIdx >= 0) mapping.category = headers[catIdx];
  
  return mapping;
}

export function useFileParser(): UseFileParserReturn {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, any>[]>([]);

  const parseCSV = useCallback((text: string): ParsedData => {
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });
    
    const headers = result.meta.fields || [];
    const rows = result.data as Record<string, any>[];
    
    // Detect column types
    const columnTypes: Record<string, 'string' | 'number' | 'date' | 'boolean'> = {};
    headers.forEach(header => {
      const values = rows.map(row => row[header]);
      columnTypes[header] = detectColumnType(values);
    });
    
    return { headers, rows, columnTypes };
  }, []);

  const parseExcel = useCallback((buffer: ArrayBuffer): ParsedData => {
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
    
    if (jsonData.length === 0) {
      throw new Error('Empty file: No data found');
    }
    
    const headers = jsonData[0].map((h: any) => String(h || 'Column'));
    const rows = jsonData.slice(1).map(row => {
      const obj: Record<string, any> = {};
      headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      return obj;
    });
    
    // Detect column types
    const columnTypes: Record<string, 'string' | 'number' | 'date' | 'boolean'> = {};
    headers.forEach(header => {
      const values = rows.map(row => row[header]);
      columnTypes[header] = detectColumnType(values);
    });
    
    return { headers, rows, columnTypes };
  }, []);

  const parseJSON = useCallback((text: string): ParsedData => {
    const data = JSON.parse(text);
    
    let rows: Record<string, any>[];
    if (Array.isArray(data)) {
      rows = data;
    } else if (data.data && Array.isArray(data.data)) {
      rows = data.data;
    } else if (data.records && Array.isArray(data.records)) {
      rows = data.records;
    } else if (data.transactions && Array.isArray(data.transactions)) {
      rows = data.transactions;
    } else {
      rows = [data];
    }
    
    if (rows.length === 0) {
      throw new Error('Empty file: No data found');
    }
    
    const headers = Object.keys(rows[0]);
    
    // Detect column types
    const columnTypes: Record<string, 'string' | 'number' | 'date' | 'boolean'> = {};
    headers.forEach(header => {
      const values = rows.map(row => row[header]);
      columnTypes[header] = detectColumnType(values);
    });
    
    return { headers, rows, columnTypes };
  }, []);

  const parseTSV = useCallback((text: string): ParsedData => {
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimiter: '\t',
    });
    
    const headers = result.meta.fields || [];
    const rows = result.data as Record<string, any>[];
    
    // Detect column types
    const columnTypes: Record<string, 'string' | 'number' | 'date' | 'boolean'> = {};
    headers.forEach(header => {
      const values = rows.map(row => row[header]);
      columnTypes[header] = detectColumnType(values);
    });
    
    return { headers, rows, columnTypes };
  }, []);

  const parseFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setParsedData(null);
    setFileInfo(null);
    setPreviewRows([]);
    
    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File exceeds 50MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      }
      
      const fileName = file.name.toLowerCase();
      let data: ParsedData;
      
      if (fileName.endsWith('.csv')) {
        const text = await file.text();
        data = parseCSV(text);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        data = parseExcel(buffer);
      } else if (fileName.endsWith('.json')) {
        const text = await file.text();
        data = parseJSON(text);
      } else if (fileName.endsWith('.tsv')) {
        const text = await file.text();
        data = parseTSV(text);
      } else {
        throw new Error('Invalid file format. Please upload CSV, Excel, JSON, or TSV file.');
      }
      
      if (data.rows.length === 0) {
        throw new Error('No data found in file');
      }
      
      // Set parsed data
      setParsedData(data);
      
      // Set file info
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type || fileName.split('.').pop() || 'unknown',
        rowCount: data.rows.length,
        columnCount: data.headers.length,
      });
      
      // Set preview (first 10 rows)
      setPreviewRows(data.rows.slice(0, 10));
      
      // Auto-detect column mapping
      setColumnMapping(autoDetectMapping(data.headers));
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to parse file';
      setError(message);
      console.error('File parsing error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [parseCSV, parseExcel, parseJSON, parseTSV]);

  const reset = useCallback(() => {
    setParsedData(null);
    setFileInfo(null);
    setColumnMapping({});
    setPreviewRows([]);
    setError(null);
  }, []);

  return {
    parseFile,
    parsedData,
    fileInfo,
    columnMapping,
    isLoading,
    error,
    previewRows,
    reset,
  };
}
