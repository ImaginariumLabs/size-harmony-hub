
export interface AdData {
  name: string;
  slot: string;
  link: string;
  image: File | null;
  active: boolean;
}

export const AD_SLOTS = [
  { id: 'featured-premium', name: 'Featured - Premium Selection' },
  { id: 'featured-trending', name: 'Featured - Trending Now' },
  { id: 'featured-rated', name: 'Featured - Best Rated' },
  { id: 'sidebar', name: 'Sidebar Ads' },
  { id: 'banner', name: 'Banner Ads' },
  { id: 'footer', name: 'Footer Ads' }
];

// Brand Management Types
export interface SizeRange {
  size: string;
  bust_min: string;
  bust_max: string;
  waist_min: string;
  waist_max: string;
  hip_min: string;
  hip_max: string;
}

export interface BrandFormData {
  name: string;
  garmentType: 'tops' | 'bottoms' | 'dresses';
  usSizes: SizeRange[];
  ukSizes: SizeRange[];
  euSizes: SizeRange[];
  logo?: File | null;
}

export interface CSVRow {
  brand_name: string;
  garment_type: string;
  region: string;
  size_label: string;
  measurement_type: string;
  min_value: string;
  max_value: string;
  unit: string;
}

export interface CSVValidationResult {
  isValid: boolean;
  errors: string[];
  data?: CSVRow[];
}

export const GARMENT_TYPES = [
  { id: 'tops', name: 'Tops' },
  { id: 'bottoms', name: 'Bottoms' },
  { id: 'dresses', name: 'Dresses' }
];

export interface FeedbackData {
  id: string;
  brand_id: string;
  brand_name: string;
  garment_type: string;
  measurement_value: number;
  measurement_type: string;
  measurement_unit: string;
  size_us: string;
  size_uk: string;
  size_eu: string;
  is_accurate: boolean;
  created_at: string;
}

export const defaultSizeTemplates: Record<string, Record<string, any>> = {
  tops: {
    xs: { 
      us: "XS", uk: "6", eu: "32", 
      bust_min: "76", bust_max: "80", 
      waist_min: "60", waist_max: "64",
      hip_min: "", hip_max: ""
    },
    s: { 
      us: "S", uk: "8", eu: "34", 
      bust_min: "84", bust_max: "88", 
      waist_min: "68", waist_max: "72",
      hip_min: "", hip_max: ""
    },
    m: { 
      us: "M", uk: "10", eu: "36", 
      bust_min: "92", bust_max: "96", 
      waist_min: "76", waist_max: "80",
      hip_min: "", hip_max: ""
    },
    l: { 
      us: "L", uk: "12", eu: "38", 
      bust_min: "100", bust_max: "104", 
      waist_min: "84", waist_max: "88",
      hip_min: "", hip_max: ""
    },
    xl: { 
      us: "XL", uk: "14", eu: "40", 
      bust_min: "110", bust_max: "116", 
      waist_min: "94", waist_max: "100",
      hip_min: "", hip_max: ""
    }
  },
  bottoms: {
    xs: { 
      us: "XS", uk: "6", eu: "32", 
      bust_min: "", bust_max: "", 
      waist_min: "61", waist_max: "64",
      hip_min: "84", hip_max: "88"
    },
    s: { 
      us: "S", uk: "8", eu: "34", 
      bust_min: "", bust_max: "", 
      waist_min: "66", waist_max: "71",
      hip_min: "92", hip_max: "96"
    },
    m: { 
      us: "M", uk: "10", eu: "36", 
      bust_min: "", bust_max: "", 
      waist_min: "74", waist_max: "79",
      hip_min: "100", hip_max: "104"
    },
    l: { 
      us: "L", uk: "12", eu: "38", 
      bust_min: "", bust_max: "", 
      waist_min: "81", waist_max: "86",
      hip_min: "108", hip_max: "112"
    },
    xl: { 
      us: "XL", uk: "14", eu: "40", 
      bust_min: "", bust_max: "", 
      waist_min: "94", waist_max: "100",
      hip_min: "117", hip_max: "122"
    }
  },
  dresses: {
    xs: { 
      us: "XS", uk: "6", eu: "32", 
      bust_min: "76", bust_max: "80", 
      waist_min: "60", waist_max: "64",
      hip_min: "84", hip_max: "88"
    },
    s: { 
      us: "S", uk: "8", eu: "34", 
      bust_min: "84", bust_max: "88", 
      waist_min: "68", waist_max: "72",
      hip_min: "92", hip_max: "96"
    },
    m: { 
      us: "M", uk: "10", eu: "36", 
      bust_min: "92", bust_max: "96", 
      waist_min: "76", waist_max: "80",
      hip_min: "100", hip_max: "104"
    },
    l: { 
      us: "L", uk: "12", eu: "38", 
      bust_min: "100", bust_max: "104", 
      waist_min: "84", waist_max: "88",
      hip_min: "108", hip_max: "112"
    },
    xl: { 
      us: "XL", uk: "14", eu: "40", 
      bust_min: "110", bust_max: "116", 
      waist_min: "94", waist_max: "100",
      hip_min: "117", hip_max: "122"
    }
  }
};
