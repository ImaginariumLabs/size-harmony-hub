
/**
 * Unit conversion utilities for measurement calculations
 */

/**
 * Convert centimeters to inches
 */
export const cmToInches = (cm: number): number => {
  return cm / 2.54;
};

/**
 * Convert inches to centimeters
 */
export const inchesToCm = (inches: number): number => {
  return inches * 2.54;
};

/**
 * Normalize measurement to inches for consistent calculations
 */
export const normalizeToInches = (value: number, unit: string): number => {
  return unit === 'cm' ? cmToInches(value) : value;
};
