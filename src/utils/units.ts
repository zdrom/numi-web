import { ConversionUnit } from '../types';

export const units: Record<string, ConversionUnit> = {
  // Length (base: meter)
  'meter': { name: 'meter', symbol: 'm', toBase: 1, category: 'length' },
  'meters': { name: 'meters', symbol: 'm', toBase: 1, category: 'length' },
  'm': { name: 'meter', symbol: 'm', toBase: 1, category: 'length' },
  'kilometer': { name: 'kilometer', symbol: 'km', toBase: 1000, category: 'length' },
  'kilometers': { name: 'kilometers', symbol: 'km', toBase: 1000, category: 'length' },
  'km': { name: 'kilometer', symbol: 'km', toBase: 1000, category: 'length' },
  'centimeter': { name: 'centimeter', symbol: 'cm', toBase: 0.01, category: 'length' },
  'centimeters': { name: 'centimeters', symbol: 'cm', toBase: 0.01, category: 'length' },
  'cm': { name: 'centimeter', symbol: 'cm', toBase: 0.01, category: 'length' },
  'millimeter': { name: 'millimeter', symbol: 'mm', toBase: 0.001, category: 'length' },
  'millimeters': { name: 'millimeters', symbol: 'mm', toBase: 0.001, category: 'length' },
  'mm': { name: 'millimeter', symbol: 'mm', toBase: 0.001, category: 'length' },
  'inch': { name: 'inch', symbol: 'in', toBase: 0.0254, category: 'length' },
  'inches': { name: 'inches', symbol: 'in', toBase: 0.0254, category: 'length' },
  'in': { name: 'inch', symbol: 'in', toBase: 0.0254, category: 'length' },
  'foot': { name: 'foot', symbol: 'ft', toBase: 0.3048, category: 'length' },
  'feet': { name: 'feet', symbol: 'ft', toBase: 0.3048, category: 'length' },
  'ft': { name: 'foot', symbol: 'ft', toBase: 0.3048, category: 'length' },
  'yard': { name: 'yard', symbol: 'yd', toBase: 0.9144, category: 'length' },
  'yards': { name: 'yards', symbol: 'yd', toBase: 0.9144, category: 'length' },
  'yd': { name: 'yard', symbol: 'yd', toBase: 0.9144, category: 'length' },
  'mile': { name: 'mile', symbol: 'mi', toBase: 1609.344, category: 'length' },
  'miles': { name: 'miles', symbol: 'mi', toBase: 1609.344, category: 'length' },
  'mi': { name: 'mile', symbol: 'mi', toBase: 1609.344, category: 'length' },

  // Area (base: square meter)
  'sqm': { name: 'square meter', symbol: 'm²', toBase: 1, category: 'area' },
  'sqft': { name: 'square foot', symbol: 'ft²', toBase: 0.092903, category: 'area' },
  'sqin': { name: 'square inch', symbol: 'in²', toBase: 0.00064516, category: 'area' },
  'acre': { name: 'acre', symbol: 'acre', toBase: 4046.86, category: 'area' },
  'acres': { name: 'acres', symbol: 'acre', toBase: 4046.86, category: 'area' },
  'hectare': { name: 'hectare', symbol: 'ha', toBase: 10000, category: 'area' },
  'hectares': { name: 'hectares', symbol: 'ha', toBase: 10000, category: 'area' },
  'ha': { name: 'hectare', symbol: 'ha', toBase: 10000, category: 'area' },

  // Volume (base: liter)
  'liter': { name: 'liter', symbol: 'L', toBase: 1, category: 'volume' },
  'liters': { name: 'liters', symbol: 'L', toBase: 1, category: 'volume' },
  'l': { name: 'liter', symbol: 'L', toBase: 1, category: 'volume' },
  'L': { name: 'liter', symbol: 'L', toBase: 1, category: 'volume' },
  'milliliter': { name: 'milliliter', symbol: 'mL', toBase: 0.001, category: 'volume' },
  'milliliters': { name: 'milliliters', symbol: 'mL', toBase: 0.001, category: 'volume' },
  'ml': { name: 'milliliter', symbol: 'mL', toBase: 0.001, category: 'volume' },
  'gallon': { name: 'gallon', symbol: 'gal', toBase: 3.78541, category: 'volume' },
  'gallons': { name: 'gallons', symbol: 'gal', toBase: 3.78541, category: 'volume' },
  'gal': { name: 'gallon', symbol: 'gal', toBase: 3.78541, category: 'volume' },
  'quart': { name: 'quart', symbol: 'qt', toBase: 0.946353, category: 'volume' },
  'quarts': { name: 'quarts', symbol: 'qt', toBase: 0.946353, category: 'volume' },
  'qt': { name: 'quart', symbol: 'qt', toBase: 0.946353, category: 'volume' },
  'pint': { name: 'pint', symbol: 'pt', toBase: 0.473176, category: 'volume' },
  'pints': { name: 'pints', symbol: 'pt', toBase: 0.473176, category: 'volume' },
  'pt': { name: 'pint', symbol: 'pt', toBase: 0.473176, category: 'volume' },
  'cup': { name: 'cup', symbol: 'cup', toBase: 0.236588, category: 'volume' },
  'cups': { name: 'cups', symbol: 'cup', toBase: 0.236588, category: 'volume' },

  // Weight (base: kilogram)
  'kilogram': { name: 'kilogram', symbol: 'kg', toBase: 1, category: 'weight' },
  'kilograms': { name: 'kilograms', symbol: 'kg', toBase: 1, category: 'weight' },
  'kg': { name: 'kilogram', symbol: 'kg', toBase: 1, category: 'weight' },
  'gram': { name: 'gram', symbol: 'g', toBase: 0.001, category: 'weight' },
  'grams': { name: 'grams', symbol: 'g', toBase: 0.001, category: 'weight' },
  'g': { name: 'gram', symbol: 'g', toBase: 0.001, category: 'weight' },
  'milligram': { name: 'milligram', symbol: 'mg', toBase: 0.000001, category: 'weight' },
  'milligrams': { name: 'milligrams', symbol: 'mg', toBase: 0.000001, category: 'weight' },
  'mg': { name: 'milligram', symbol: 'mg', toBase: 0.000001, category: 'weight' },
  'pound': { name: 'pound', symbol: 'lb', toBase: 0.453592, category: 'weight' },
  'pounds': { name: 'pounds', symbol: 'lb', toBase: 0.453592, category: 'weight' },
  'lb': { name: 'pound', symbol: 'lb', toBase: 0.453592, category: 'weight' },
  'lbs': { name: 'pounds', symbol: 'lb', toBase: 0.453592, category: 'weight' },
  'ounce': { name: 'ounce', symbol: 'oz', toBase: 0.0283495, category: 'weight' },
  'ounces': { name: 'ounces', symbol: 'oz', toBase: 0.0283495, category: 'weight' },
  'oz': { name: 'ounce', symbol: 'oz', toBase: 0.0283495, category: 'weight' },
  'stone': { name: 'stone', symbol: 'st', toBase: 6.35029, category: 'weight' },
  'st': { name: 'stone', symbol: 'st', toBase: 6.35029, category: 'weight' },

  // Data (base: byte)
  'byte': { name: 'byte', symbol: 'B', toBase: 1, category: 'data' },
  'bytes': { name: 'bytes', symbol: 'B', toBase: 1, category: 'data' },
  'B': { name: 'byte', symbol: 'B', toBase: 1, category: 'data' },
  'kilobyte': { name: 'kilobyte', symbol: 'KB', toBase: 1024, category: 'data' },
  'kilobytes': { name: 'kilobytes', symbol: 'KB', toBase: 1024, category: 'data' },
  'KB': { name: 'kilobyte', symbol: 'KB', toBase: 1024, category: 'data' },
  'megabyte': { name: 'megabyte', symbol: 'MB', toBase: 1048576, category: 'data' },
  'megabytes': { name: 'megabytes', symbol: 'MB', toBase: 1048576, category: 'data' },
  'MB': { name: 'megabyte', symbol: 'MB', toBase: 1048576, category: 'data' },
  'gigabyte': { name: 'gigabyte', symbol: 'GB', toBase: 1073741824, category: 'data' },
  'gigabytes': { name: 'gigabytes', symbol: 'GB', toBase: 1073741824, category: 'data' },
  'GB': { name: 'gigabyte', symbol: 'GB', toBase: 1073741824, category: 'data' },
  'terabyte': { name: 'terabyte', symbol: 'TB', toBase: 1099511627776, category: 'data' },
  'terabytes': { name: 'terabytes', symbol: 'TB', toBase: 1099511627776, category: 'data' },
  'TB': { name: 'terabyte', symbol: 'TB', toBase: 1099511627776, category: 'data' },

  // Time (base: second)
  'second': { name: 'second', symbol: 's', toBase: 1, category: 'time' },
  'seconds': { name: 'seconds', symbol: 's', toBase: 1, category: 'time' },
  's': { name: 'second', symbol: 's', toBase: 1, category: 'time' },
  'minute': { name: 'minute', symbol: 'min', toBase: 60, category: 'time' },
  'minutes': { name: 'minutes', symbol: 'min', toBase: 60, category: 'time' },
  'min': { name: 'minute', symbol: 'min', toBase: 60, category: 'time' },
  'hour': { name: 'hour', symbol: 'h', toBase: 3600, category: 'time' },
  'hours': { name: 'hours', symbol: 'h', toBase: 3600, category: 'time' },
  'h': { name: 'hour', symbol: 'h', toBase: 3600, category: 'time' },
  'day': { name: 'day', symbol: 'd', toBase: 86400, category: 'time' },
  'days': { name: 'days', symbol: 'd', toBase: 86400, category: 'time' },
  'd': { name: 'day', symbol: 'd', toBase: 86400, category: 'time' },
  'week': { name: 'week', symbol: 'wk', toBase: 604800, category: 'time' },
  'weeks': { name: 'weeks', symbol: 'wk', toBase: 604800, category: 'time' },
  'month': { name: 'month', symbol: 'mo', toBase: 2628000, category: 'time' },
  'months': { name: 'months', symbol: 'mo', toBase: 2628000, category: 'time' },
  'year': { name: 'year', symbol: 'yr', toBase: 31536000, category: 'time' },
  'years': { name: 'years', symbol: 'yr', toBase: 31536000, category: 'time' },

  // Angle (base: radian)
  'radian': { name: 'radian', symbol: 'rad', toBase: 1, category: 'angle' },
  'radians': { name: 'radians', symbol: 'rad', toBase: 1, category: 'angle' },
  'rad': { name: 'radian', symbol: 'rad', toBase: 1, category: 'angle' },
  'degree': { name: 'degree', symbol: '°', toBase: Math.PI / 180, category: 'angle' },
  'degrees': { name: 'degrees', symbol: '°', toBase: Math.PI / 180, category: 'angle' },
  'deg': { name: 'degree', symbol: '°', toBase: Math.PI / 180, category: 'angle' },

  // CSS Units - Length (base: pixel, assuming 96 DPI / 1px = 1/96 inch)
  'pixel': { name: 'pixel', symbol: 'px', toBase: 1, category: 'css-length' },
  'pixels': { name: 'pixels', symbol: 'px', toBase: 1, category: 'css-length' },
  'px': { name: 'pixel', symbol: 'px', toBase: 1, category: 'css-length' },
  'point': { name: 'point', symbol: 'pt', toBase: 4/3, category: 'css-length' }, // 1pt = 1/72 inch = 4/3 px
  'points': { name: 'points', symbol: 'pt', toBase: 4/3, category: 'css-length' },
  'em': { name: 'em', symbol: 'em', toBase: 16, category: 'css-length' }, // 1em = 16px (default browser font size)
  'ems': { name: 'ems', symbol: 'em', toBase: 16, category: 'css-length' },
  'rem': { name: 'rem', symbol: 'rem', toBase: 16, category: 'css-length' }, // 1rem = 16px (root font size)
  'rems': { name: 'rems', symbol: 'rem', toBase: 16, category: 'css-length' },
  'vh': { name: 'vh', symbol: 'vh', toBase: 7.68, category: 'css-length' }, // Assuming 768px viewport height (common mobile)
  'vw': { name: 'vw', symbol: 'vw', toBase: 3.75, category: 'css-length' }, // Assuming 375px viewport width (iPhone)
  'vmin': { name: 'vmin', symbol: 'vmin', toBase: 3.75, category: 'css-length' }, // Min of vw/vh
  'vmax': { name: 'vmax', symbol: 'vmax', toBase: 7.68, category: 'css-length' }, // Max of vw/vh
  'percent': { name: 'percent', symbol: '%', toBase: 0.16, category: 'css-length' }, // Assuming parent is 16px (1em)
  '%': { name: 'percent', symbol: '%', toBase: 0.16, category: 'css-length' },
};

export function convertTemperature(value: number, from: string, to: string): number {
  const fromLower = from.toLowerCase();
  const toLower = to.toLowerCase();

  // Convert to Celsius first
  let celsius: number;
  if (fromLower === 'celsius' || fromLower === 'c') {
    celsius = value;
  } else if (fromLower === 'fahrenheit' || fromLower === 'f') {
    celsius = (value - 32) * 5 / 9;
  } else if (fromLower === 'kelvin' || fromLower === 'k') {
    celsius = value - 273.15;
  } else {
    throw new Error(`Unknown temperature unit: ${from}`);
  }

  // Convert from Celsius to target
  if (toLower === 'celsius' || toLower === 'c') {
    return celsius;
  } else if (toLower === 'fahrenheit' || toLower === 'f') {
    return celsius * 9 / 5 + 32;
  } else if (toLower === 'kelvin' || toLower === 'k') {
    return celsius + 273.15;
  } else {
    throw new Error(`Unknown temperature unit: ${to}`);
  }
}

export function convert(value: number, fromUnit: string, toUnit: string): number {
  const from = units[fromUnit.toLowerCase()];
  const to = units[toUnit.toLowerCase()];

  if (!from || !to) {
    throw new Error(`Unknown unit: ${!from ? fromUnit : toUnit}`);
  }

  if (from.category !== to.category) {
    throw new Error(`Cannot convert between ${from.category} and ${to.category}`);
  }

  // Convert to base unit, then to target unit
  const baseValue = value * from.toBase;
  return baseValue / to.toBase;
}
