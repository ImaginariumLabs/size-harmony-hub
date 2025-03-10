
import { Brand } from './brandService';
import { Garment } from './garmentService';

export type SizeRange = {
  id: string;
  brand_id: string;
  garment_id: string;
  region: string;
  size_label: string;
  measurement_type: string;
  min_value: number;
  max_value: number;
  unit: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  brand_id: string;
  garment_type: string;
  measurement_value: number;
  measurement_type: string;
  measurement_unit: string;
  size_us: string;
  size_uk: string;
  size_eu: string;
  is_accurate: boolean;
  created_at: string;
};

export type SizeResult = {
  usSize: string;
  ukSize: string;
  euSize: string;
};

// Mock data for fallback calculations
export const mockSizeMapping = {
  bust: {
    XS: { min: 76, max: 80 },  // 30-31.5 inches
    S: { min: 80, max: 84 },   // 31.5-33 inches
    M: { min: 84, max: 88 },   // 33-34.5 inches
    L: { min: 88, max: 94 },   // 34.5-37 inches
    XL: { min: 94, max: 100 }, // 37-39.5 inches
  },
  waist: {
    XS: { min: 58, max: 62 },  // 23-24.5 inches
    S: { min: 62, max: 66 },   // 24.5-26 inches
    M: { min: 66, max: 70 },   // 26-27.5 inches
    L: { min: 70, max: 76 },   // 27.5-30 inches
    XL: { min: 76, max: 82 },  // 30-32.5 inches
  },
  hip: {
    XS: { min: 84, max: 88 },  // 33-34.5 inches
    S: { min: 88, max: 92 },   // 34.5-36 inches
    M: { min: 92, max: 96 },   // 36-38 inches
    L: { min: 96, max: 102 },  // 38-40 inches
    XL: { min: 102, max: 108 }, // 40-42.5 inches
  }
};
