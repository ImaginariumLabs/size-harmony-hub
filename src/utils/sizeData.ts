
export interface Size {
  size: string;
  bust_min_inches: number;
  bust_max_inches: number;
}

export interface SizeChart {
  US: Size[];
  UK: Size[];
}

export interface Brand {
  name: string;
  sizes: SizeChart;
  logo?: string;
}

export interface SizeData {
  brands: Brand[];
}

const sizeData: SizeData = {
  "brands": [
    {
      "name": "H&M",
      "sizes": {
        "US": [
          { "size": "XS", "bust_min_inches": 30, "bust_max_inches": 32 },
          { "size": "S", "bust_min_inches": 32, "bust_max_inches": 34 },
          { "size": "M", "bust_min_inches": 34, "bust_max_inches": 37 },
          { "size": "L", "bust_min_inches": 37, "bust_max_inches": 40 },
          { "size": "XL", "bust_min_inches": 40, "bust_max_inches": 43 }
        ],
        "UK": [
          { "size": "6", "bust_min_inches": 30, "bust_max_inches": 32 },
          { "size": "8", "bust_min_inches": 32, "bust_max_inches": 34 },
          { "size": "10", "bust_min_inches": 34, "bust_max_inches": 37 },
          { "size": "12", "bust_min_inches": 37, "bust_max_inches": 40 },
          { "size": "14", "bust_min_inches": 40, "bust_max_inches": 43 }
        ]
      }
    },
    {
      "name": "Zara",
      "sizes": {
        "US": [
          { "size": "XS", "bust_min_inches": 31, "bust_max_inches": 33 },
          { "size": "S", "bust_min_inches": 33, "bust_max_inches": 35 },
          { "size": "M", "bust_min_inches": 35, "bust_max_inches": 38 },
          { "size": "L", "bust_min_inches": 38, "bust_max_inches": 41 },
          { "size": "XL", "bust_min_inches": 41, "bust_max_inches": 44 }
        ],
        "UK": [
          { "size": "6", "bust_min_inches": 31, "bust_max_inches": 33 },
          { "size": "8", "bust_min_inches": 33, "bust_max_inches": 35 },
          { "size": "10", "bust_min_inches": 35, "bust_max_inches": 38 },
          { "size": "12", "bust_min_inches": 38, "bust_max_inches": 41 },
          { "size": "14", "bust_min_inches": 41, "bust_max_inches": 44 }
        ]
      }
    },
    {
      "name": "ASOS",
      "sizes": {
        "US": [
          { "size": "XS", "bust_min_inches": 29, "bust_max_inches": 31 },
          { "size": "S", "bust_min_inches": 31, "bust_max_inches": 33 },
          { "size": "M", "bust_min_inches": 33, "bust_max_inches": 36 },
          { "size": "L", "bust_min_inches": 36, "bust_max_inches": 39 },
          { "size": "XL", "bust_min_inches": 39, "bust_max_inches": 42 }
        ],
        "UK": [
          { "size": "6", "bust_min_inches": 29, "bust_max_inches": 31 },
          { "size": "8", "bust_min_inches": 31, "bust_max_inches": 33 },
          { "size": "10", "bust_min_inches": 33, "bust_max_inches": 36 },
          { "size": "12", "bust_min_inches": 36, "bust_max_inches": 39 },
          { "size": "14", "bust_min_inches": 39, "bust_max_inches": 42 }
        ]
      }
    }
  ]
};

export default sizeData;
