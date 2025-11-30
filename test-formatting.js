import { NumiParser } from './src/utils/parser.ts';

const parser = new NumiParser();

console.log('Testing number formatting...\n');

// Test 1: Large numbers without scientific notation
console.log('Test 1: Large number (10 million)');
console.log('Input: 10000000');
console.log('Output:', parser.parse('10000000'));
console.log('Expected: 10,000,000\n');

// Test 2: Very large number
console.log('Test 2: Very large number (1 billion)');
console.log('Input: 1000000000');
console.log('Output:', parser.parse('1000000000'));
console.log('Expected: 1,000,000,000\n');

// Test 3: Number with dollar sign
console.log('Test 3: Dollar amount');
console.log('Input: $1000');
console.log('Output:', parser.parse('$1000'));
console.log('Expected: $1,000\n');

// Test 4: Large dollar amount
console.log('Test 4: Large dollar amount');
console.log('Input: $1000000');
console.log('Output:', parser.parse('$1000000'));
console.log('Expected: $1,000,000\n');

// Test 5: Calculation with dollar sign
console.log('Test 5: Calculation with dollar sign');
console.log('Input: $100 + $200');
console.log('Output:', parser.parse('$100 + $200'));
console.log('Expected: $300\n');

// Test 6: Decimal number
console.log('Test 6: Decimal number');
console.log('Input: 1234.56');
console.log('Output:', parser.parse('1234.56'));
console.log('Expected: 1,234.56\n');

// Test 7: Small decimal
console.log('Test 7: Small decimal (previously would use scientific notation)');
console.log('Input: 0.00001');
console.log('Output:', parser.parse('0.00001'));
console.log('Expected: 0.00001\n');
