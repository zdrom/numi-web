import * as math from 'mathjs';
import { format, add, sub, differenceInDays, differenceInHours, differenceInMinutes, parse as dateParse } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { convert, convertTemperature, units } from './units';
import { convertCurrency, currencySymbols, currencyNames, isCurrencyCode } from './currency';
import { Variable, ParsedLine } from '../types';

const constants = {
  pi: Math.PI,
  e: Math.E,
};

export class NumiParser {
  private variables: Map<string, Variable> = new Map();
  private previousResult: number | null = null;

  parse(input: string): string {
    const trimmed = input.trim();

    // Empty line
    if (!trimmed) {
      return '';
    }

    // Header (starts with #)
    if (trimmed.startsWith('#')) {
      return '';
    }

    // Comment (starts with //)
    if (trimmed.startsWith('//')) {
      return '';
    }

    try {
      // Variable assignment (e.g., "x = 10")
      const varMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (varMatch) {
        const [, name, expr] = varMatch;
        const result = this.evaluate(expr);
        this.variables.set(name, { name, value: result });
        return this.formatResult(result);
      }

      // Evaluate expression
      const result = this.evaluate(trimmed);
      this.previousResult = result;
      return this.formatResult(result);
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'Error: Unknown error';
    }
  }

  private evaluate(expr: string): number {
    // Replace 'prev' with previous result
    if (expr.includes('prev') && this.previousResult !== null) {
      expr = expr.replace(/\bprev\b/g, String(this.previousResult));
    }

    // Replace variables
    this.variables.forEach((variable, name) => {
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      expr = expr.replace(regex, String(variable.value));
    });

    // Replace constants
    expr = expr.replace(/\bpi\b/gi, String(constants.pi));
    expr = expr.replace(/\be\b/g, String(constants.e));

    // Handle date/time expressions
    const dateResult = this.tryParseDate(expr);
    if (dateResult !== null) {
      return dateResult;
    }

    // Handle timezone conversions
    const timezoneResult = this.tryParseTimezone(expr);
    if (timezoneResult !== null) {
      return timezoneResult;
    }

    // Handle unit conversions
    const conversionResult = this.tryParseConversion(expr);
    if (conversionResult !== null) {
      return conversionResult;
    }

    // Handle currency conversions
    const currencyResult = this.tryParseCurrency(expr);
    if (currencyResult !== null) {
      return currencyResult;
    }

    // Handle percentages
    const percentResult = this.tryParsePercent(expr);
    if (percentResult !== null) {
      return percentResult;
    }

    // Replace word operators
    expr = this.replaceWordOperators(expr);

    // Replace scale notation (k, M, billion, etc.)
    expr = this.replaceScales(expr);

    // Handle mathematical functions
    expr = this.replaceFunctions(expr);

    // Evaluate using mathjs
    return math.evaluate(expr);
  }

  private tryParseDate(expr: string): number | null {
    const now = new Date();

    // "today" or "now"
    if (expr.toLowerCase() === 'today' || expr.toLowerCase() === 'now') {
      return now.getTime();
    }

    // "today + 2 weeks", "now - 3 days"
    const dateArithMatch = expr.match(/^(today|now)\s*([+\-])\s*(\d+)\s*(day|days|week|weeks|month|months|year|years)$/i);
    if (dateArithMatch) {
      const [, , op, amountStr, unit] = dateArithMatch;
      const amount = parseInt(amountStr);
      const duration: any = {};

      if (unit.toLowerCase().startsWith('day')) duration.days = amount;
      else if (unit.toLowerCase().startsWith('week')) duration.weeks = amount;
      else if (unit.toLowerCase().startsWith('month')) duration.months = amount;
      else if (unit.toLowerCase().startsWith('year')) duration.years = amount;

      const result = op === '+' ? add(now, duration) : sub(now, duration);
      return result.getTime();
    }

    return null;
  }

  private tryParseTimezone(expr: string): number | null {
    // This is a simplified version - real implementation would need timezone database
    // "2:30 pm HKT in Berlin" or "now in UTC"
    const tzMatch = expr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?\s*(\w+)\s+in\s+(\w+)/i);
    if (tzMatch) {
      // For now, just return a placeholder
      return new Date().getTime();
    }

    return null;
  }

  private tryParseConversion(expr: string): number | null {
    // Match patterns like "20 inches in cm", "5 ft to meters", "100 kg as pounds"
    const conversionMatch = expr.match(/^([\d.]+)\s*([a-zA-Z]+)\s+(in|to|as|into)\s+([a-zA-Z]+)$/i);
    if (conversionMatch) {
      const [, valueStr, fromUnit, , toUnit] = conversionMatch;
      const value = parseFloat(valueStr);

      // Check if it's temperature conversion
      const tempUnits = ['celsius', 'fahrenheit', 'kelvin', 'c', 'f', 'k'];
      if (tempUnits.includes(fromUnit.toLowerCase()) || tempUnits.includes(toUnit.toLowerCase())) {
        return convertTemperature(value, fromUnit, toUnit);
      }

      // Regular unit conversion
      return convert(value, fromUnit, toUnit);
    }

    // Match patterns like "20 inches in cm + 5 cm"
    const complexConversionMatch = expr.match(/([\d.]+)\s*([a-zA-Z]+)\s+(in|to|as|into)\s+([a-zA-Z]+)(.+)/i);
    if (complexConversionMatch) {
      const [, valueStr, fromUnit, , toUnit, rest] = complexConversionMatch;
      const value = parseFloat(valueStr);

      try {
        const converted = convert(value, fromUnit, toUnit);
        const remaining = `${converted}${rest}`;
        return this.evaluate(remaining);
      } catch {
        return null;
      }
    }

    return null;
  }

  private tryParseCurrency(expr: string): number | null {
    // Handle currency symbols
    let processed = expr;

    // Replace currency symbols with codes
    Object.entries(currencySymbols).forEach(([symbol, code]) => {
      const escapedSymbol = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      processed = processed.replace(new RegExp(escapedSymbol, 'g'), ` ${code} `);
    });

    // Replace currency names with codes
    Object.entries(currencyNames).forEach(([name, code]) => {
      const regex = new RegExp(`\\b${name}\\b`, 'gi');
      processed = processed.replace(regex, code);
    });

    // Match patterns like "20 USD in EUR", "$20 in euro"
    const currencyMatch = processed.match(/^([\d.]+)\s*([A-Z]{3})\s+(in|to|as)\s+([A-Z]{3})$/i);
    if (currencyMatch) {
      const [, valueStr, fromCurrency, , toCurrency] = currencyMatch;
      const value = parseFloat(valueStr);
      return convertCurrency(value, fromCurrency, toCurrency);
    }

    // Match complex currency expressions like "$20 + 5 EUR - 10 GBP"
    const hasCurrency = /[A-Z]{3}/.test(processed);
    if (hasCurrency) {
      // This is a simplified version - real implementation would track units through calculation
      // For now, just remove currency codes and calculate
      const withoutCurrency = processed.replace(/[A-Z]{3}/g, '');
      try {
        return this.evaluate(withoutCurrency);
      } catch {
        return null;
      }
    }

    return null;
  }

  private tryParsePercent(expr: string): number | null {
    // "20% of 100" = 20
    const percentOfMatch = expr.match(/^([\d.]+)%\s+of\s+([\d.]+)$/i);
    if (percentOfMatch) {
      const [, percentStr, valueStr] = percentOfMatch;
      const percent = parseFloat(percentStr);
      const value = parseFloat(valueStr);
      return (percent / 100) * value;
    }

    // "100 + 20%" = 120
    const addPercentMatch = expr.match(/^([\d.]+)\s*\+\s*([\d.]+)%$/);
    if (addPercentMatch) {
      const [, valueStr, percentStr] = addPercentMatch;
      const value = parseFloat(valueStr);
      const percent = parseFloat(percentStr);
      return value * (1 + percent / 100);
    }

    // "100 - 20%" = 80
    const subPercentMatch = expr.match(/^([\d.]+)\s*-\s*([\d.]+)%$/);
    if (subPercentMatch) {
      const [, valueStr, percentStr] = subPercentMatch;
      const value = parseFloat(valueStr);
      const percent = parseFloat(percentStr);
      return value * (1 - percent / 100);
    }

    // "20%" = 0.2
    const simplePercentMatch = expr.match(/^([\d.]+)%$/);
    if (simplePercentMatch) {
      const [, percentStr] = simplePercentMatch;
      return parseFloat(percentStr) / 100;
    }

    return null;
  }

  private replaceWordOperators(expr: string): string {
    return expr
      .replace(/\bplus\b/gi, '+')
      .replace(/\bminus\b/gi, '-')
      .replace(/\btimes\b/gi, '*')
      .replace(/\s+x\s+/gi, ' * ')  // Replace ' x ' with ' * '
      .replace(/\bdivided\s+by\b/gi, '/')
      .replace(/\bmod\b/gi, '%')
      .replace(/\band\b/gi, '&')
      .replace(/\bor\b/gi, '|')
      .replace(/\bxor\b/gi, '^');
  }

  private replaceScales(expr: string): string {
    return expr
      .replace(/(\d+\.?\d*)\s*k\b/gi, (_, num) => String(parseFloat(num) * 1000))
      .replace(/(\d+\.?\d*)\s*thousand\b/gi, (_, num) => String(parseFloat(num) * 1000))
      .replace(/(\d+\.?\d*)\s*M\b/g, (_, num) => String(parseFloat(num) * 1000000))
      .replace(/(\d+\.?\d*)\s*million\b/gi, (_, num) => String(parseFloat(num) * 1000000))
      .replace(/(\d+\.?\d*)\s*B\b/g, (_, num) => String(parseFloat(num) * 1000000000))
      .replace(/(\d+\.?\d*)\s*billion\b/gi, (_, num) => String(parseFloat(num) * 1000000000))
      .replace(/(\d+\.?\d*)\s*trillion\b/gi, (_, num) => String(parseFloat(num) * 1000000000000));
  }

  private replaceFunctions(expr: string): string {
    return expr
      .replace(/\bsqrt\(/gi, 'sqrt(')
      .replace(/\bsin\(/gi, 'sin(')
      .replace(/\bcos\(/gi, 'cos(')
      .replace(/\btan\(/gi, 'tan(')
      .replace(/\basin\(/gi, 'asin(')
      .replace(/\bacos\(/gi, 'acos(')
      .replace(/\batan\(/gi, 'atan(')
      .replace(/\babs\(/gi, 'abs(')
      .replace(/\blog\(/gi, 'log10(')
      .replace(/\bln\(/gi, 'log(')
      .replace(/\bround\(/gi, 'round(')
      .replace(/\bceil\(/gi, 'ceil(')
      .replace(/\bfloor\(/gi, 'floor(');
  }

  private formatResult(value: number): string {
    // Handle very large and very small numbers
    if (Math.abs(value) > 1e6 || (Math.abs(value) < 1e-4 && value !== 0)) {
      return value.toExponential(6);
    }

    // Round to avoid floating point errors
    const rounded = Math.round(value * 1e10) / 1e10;

    // Format with appropriate decimal places
    if (Number.isInteger(rounded)) {
      return rounded.toLocaleString();
    }

    return rounded.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  clearVariables(): void {
    this.variables.clear();
    this.previousResult = null;
  }

  getVariables(): Variable[] {
    return Array.from(this.variables.values());
  }

  parseDocument(content: string): ParsedLine[] {
    const lines = content.split('\n');
    const results: ParsedLine[] = [];
    let previousResult: number | null = null;

    // Clear variables for fresh parse
    this.variables.clear();

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Blank line
      if (!trimmed) {
        results.push({
          lineNumber: index,
          input: line,
          result: null,
          error: null,
          type: 'blank'
        });
        return;
      }

      // Header detection (# through ######)
      const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
        results.push({
          lineNumber: index,
          input: line,
          result: null,
          error: null,
          type: 'header',
          headerLevel: level
        });
        return;
      }

      // Comment
      if (trimmed.startsWith('//')) {
        results.push({
          lineNumber: index,
          input: line,
          result: null,
          error: null,
          type: 'comment'
        });
        return;
      }

      // Calculation
      try {
        let expr = trimmed;

        // Set previousResult in parser state so evaluate() can access it
        this.previousResult = previousResult;

        // Handle 'sum' or 'total' - aggregate results up to previous blank line
        if (/\b(sum|total)\b/i.test(expr)) {
          const sumValue = this.calculateSum(results);
          expr = expr.replace(/\b(sum|total)\b/gi, String(sumValue));
        }

        // Handle 'average' or 'avg' - average results up to previous blank line
        if (/\b(average|avg)\b/i.test(expr)) {
          const avgValue = this.calculateAverage(results);
          expr = expr.replace(/\b(average|avg)\b/gi, String(avgValue));
        }

        // Variable assignment
        const varMatch = expr.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
        if (varMatch) {
          const [, name, valueExpr] = varMatch;
          const result = this.evaluate(valueExpr);
          this.variables.set(name, { name, value: result });
          const formatted = this.formatResult(result);

          results.push({
            lineNumber: index,
            input: line,
            result: formatted,
            error: null,
            type: 'calculation'
          });

          previousResult = result;
          return;
        }

        // Regular evaluation
        const numericResult = this.evaluate(expr);
        const formatted = this.formatResult(numericResult);

        results.push({
          lineNumber: index,
          input: line,
          result: formatted,
          error: null,
          type: 'calculation'
        });

        // Update previousResult with numeric value
        previousResult = numericResult;

      } catch (error) {
        results.push({
          lineNumber: index,
          input: line,
          result: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          type: 'calculation'
        });
      }
    });

    return results;
  }

  private calculateSum(results: ParsedLine[]): number {
    let sum = 0;
    // Go backwards from end of results until blank line or start
    for (let i = results.length - 1; i >= 0; i--) {
      const line = results[i];
      if (line.type === 'blank') break;
      if (line.result) {
        const num = parseFloat(line.result.replace(/,/g, ''));
        if (!isNaN(num)) sum += num;
      }
    }
    return sum;
  }

  private calculateAverage(results: ParsedLine[]): number {
    let sum = 0;
    let count = 0;
    // Go backwards from end of results until blank line or start
    for (let i = results.length - 1; i >= 0; i--) {
      const line = results[i];
      if (line.type === 'blank') break;
      if (line.result) {
        const num = parseFloat(line.result.replace(/,/g, ''));
        if (!isNaN(num)) {
          sum += num;
          count++;
        }
      }
    }
    return count > 0 ? sum / count : 0;
  }
}
