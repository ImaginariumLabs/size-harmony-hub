
export type SizeResultType = {
  usSize: string;
  ukSize: string;
  euSize: string;
} | null;

export interface SizeConverterContextType {
  // State
  step: number;
  clothingType: string;
  brand: string;
  bust: string;
  units: string;
  measurementType: string;
  result: SizeResultType;
  loading: boolean;
  isOfflineMode: boolean;
  
  // Actions
  setClothingType: (type: string) => void;
  setBrand: (brand: string) => void;
  setBust: (value: string) => void;
  setUnits: (units: string) => void;
  setMeasurementType: (type: string) => void;
  goBack: () => void;
  resetForm: () => void;
  calculateSize: () => Promise<void>;
  shareResults: () => void;
}
