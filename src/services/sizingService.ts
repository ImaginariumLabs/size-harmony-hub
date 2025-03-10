
// This file is kept for backwards compatibility and re-exports the new modular services
// Consider updating imports in your components to use the new modular imports directly

import {
  // Types
  SizeRange,
  Feedback,
  SizeResult,
  
  // Brand services
  fetchBrands,
  
  // Garment services
  fetchSizeRanges,
  
  // Calculation services
  findSizeByMeasurement,
  calculateOfflineSizeFromData,
  calculateFallbackSize,
  
  // Feedback services
  submitFeedback,
  getFeedbackStats,
  
  // Import/Export services
  exportSizeDataToCSV,
  importSizeDataFromCSV,
  
  // Connection services
  isSupabaseConnectedWithRetry
} from './sizing';

// Re-export all types and functions to maintain backward compatibility
export type {
  SizeRange,
  Feedback,
  SizeResult
};

// Re-export from Brand service
export {
  fetchBrands
};

// Re-export from Garment service
export {
  fetchSizeRanges
};

// Re-export from Calculation service
export {
  findSizeByMeasurement,
  calculateOfflineSizeFromData,
  calculateFallbackSize
};

// Re-export from Feedback service
export {
  submitFeedback,
  getFeedbackStats
};

// Re-export from Import/Export service
export {
  exportSizeDataToCSV,
  importSizeDataFromCSV
};

// Re-export from Connection service
export {
  isSupabaseConnectedWithRetry
};

// Re-export necessary types from brand and garment services
export type { Brand } from './sizing/brandService';
export type { Garment } from './sizing/garmentService';
