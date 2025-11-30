export interface CalculationLine {
  id: string;
  input: string;
  result: string | null;
  error: string | null;
  type: 'calculation' | 'header' | 'comment';
}

export interface ParsedLine {
  lineNumber: number;
  input: string;
  result: string | null;
  error: string | null;
  type: 'calculation' | 'header' | 'comment' | 'blank';
  headerLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface Variable {
  name: string;
  value: number;
  unit?: string;
}

export interface ConversionUnit {
  name: string;
  symbol: string;
  toBase: number;
  category: 'length' | 'area' | 'volume' | 'weight' | 'temperature' | 'data' | 'time' | 'angle' | 'currency' | 'css-length';
}

export interface CurrencyRate {
  code: string;
  rate: number;
  lastUpdated: Date;
}
