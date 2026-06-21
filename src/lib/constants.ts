export const CATEGORIES = [
  'Laptops',
  'Smartphones',
  'Televisions',
  // 'Headphones',
  // 'Shoes-men',
  // 'Shoes-women'
] as const;

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
  category: string;
  sellerName: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  sellerUrl: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  priceHistory: { date: string; price: number }[];
  updatedAt: string;
}

export const INITIAL_PRODUCTS: MockProduct[] = [
  {
    id: "prod-macbook-m3",
    name: "Apple MacBook Air M3 (13-inch, 2024)",
    description: "Apple M3 chip with 8-core CPU and 10-core GPU, 8GB Unified Memory, 256GB SSD storage. Retina display with True Tone, silent fanless design.",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60",
    currentPrice: 155000,
    originalPrice: 175000,
    discountPercentage: 11,
    category: "Laptops",
    sellerName: "Oliz Store",
    rating: 4.8,
    reviewsCount: 142,
    inStock: true,
    sellerUrl: "https://www.daraz.com.np/products/apple-macbook-air-m3-i12345.html",
    minPrice: 150000,
    maxPrice: 175000,
    avgPrice: 162500,
    priceHistory: [
      { date: "May 20", price: 175000 },
      { date: "May 25", price: 172000 },
      { date: "Jun 01", price: 170000 },
      { date: "Jun 05", price: 165000 },
      { date: "Jun 10", price: 158000 },
      { date: "Jun 19", price: 155000 }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-iphone-15",
    name: "Apple iPhone 15 Pro Max (256GB)",
    description: "Titanium design, A17 Pro chip, customizable Action button, the most powerful iPhone camera system, and USB-C support.",
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60",
    currentPrice: 194000,
    originalPrice: 204000,
    discountPercentage: 5,
    category: "Smartphones",
    sellerName: "Evo Store",
    rating: 4.9,
    reviewsCount: 208,
    inStock: true,
    sellerUrl: "https://www.daraz.com.np/products/apple-iphone-15-pro-max-i23456.html",
    minPrice: 192000,
    maxPrice: 204000,
    avgPrice: 198000,
    priceHistory: [
      { date: "May 20", price: 204000 },
      { date: "May 25", price: 202000 },
      { date: "Jun 01", price: 200000 },
      { date: "Jun 05", price: 197000 },
      { date: "Jun 10", price: 195000 },
      { date: "Jun 19", price: 194000 }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-sony-wh1000xm5",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: "Industry-leading noise cancellation, exceptional sound quality with the Integrated Processor V1, crystal-clear hands-free calling.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    currentPrice: 42000,
    originalPrice: 48000,
    discountPercentage: 12,
    category: "Headphones",
    sellerName: "Sony Nepal",
    rating: 4.7,
    reviewsCount: 95,
    inStock: true,
    sellerUrl: "https://www.daraz.com.np/products/sony-wh-1000xm5-i34567.html",
    minPrice: 40000,
    maxPrice: 48000,
    avgPrice: 43500,
    priceHistory: [
      { date: "May 20", price: 48000 },
      { date: "May 25", price: 46000 },
      { date: "Jun 01", price: 45000 },
      { date: "Jun 05", price: 43000 },
      { date: "Jun 10", price: 42500 },
      { date: "Jun 19", price: 42000 }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-samsung-qled",
    name: "Samsung 55\" QLED 4K Smart TV",
    description: "Quantum Processor Lite 4K, 100% Color Volume with Quantum Dot, Dual LED backlighting, Smart TV Hub with built-in voice assistants.",
    imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=60",
    currentPrice: 110000,
    originalPrice: 135000,
    discountPercentage: 18,
    category: "Televisions",
    sellerName: "Him Electronics",
    rating: 4.6,
    reviewsCount: 64,
    inStock: true,
    sellerUrl: "https://www.daraz.com.np/products/samsung-55-qled-4k-tv-i45678.html",
    minPrice: 108000,
    maxPrice: 135000,
    avgPrice: 121000,
    priceHistory: [
      { date: "May 20", price: 135000 },
      { date: "May 25", price: 128000 },
      { date: "Jun 01", price: 122000 },
      { date: "Jun 05", price: 115000 },
      { date: "Jun 10", price: 112000 },
      { date: "Jun 19", price: 110000 }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-dell-xps13",
    name: "Dell XPS 13 9340 Laptop (2024)",
    description: "Intel Core Ultra 7 processor, 16GB LPDDR5X RAM, 512GB SSD, 13.4-inch FHD+ InfinityEdge display, Windows 11 Home.",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60",
    currentPrice: 168000,
    originalPrice: 188000,
    discountPercentage: 10,
    category: "Laptops",
    sellerName: "LDS Nepal",
    rating: 4.5,
    reviewsCount: 37,
    inStock: true,
    sellerUrl: "https://www.daraz.com.np/products/dell-xps-13-i56789.html",
    minPrice: 165000,
    maxPrice: 188000,
    avgPrice: 174000,
    priceHistory: [
      { date: "May 20", price: 188000 },
      { date: "May 25", price: 185000 },
      { date: "Jun 01", price: 180000 },
      { date: "Jun 05", price: 175000 },
      { date: "Jun 10", price: 170000 },
      { date: "Jun 19", price: 168000 }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-fuji-xt5",
    name: "Fujifilm X-T5 Mirrorless Camera with 18-55mm Lens",
    description: "40.2MP APS-C X-Trans CMOS 5 HR Sensor, 5-axis in-body image stabilization, 4K/60p video, retro design with dedicated analog dials.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60",
    currentPrice: 225000,
    originalPrice: 245000,
    discountPercentage: 8,
    category: "Cameras",
    sellerName: "Photo Hub",
    rating: 4.8,
    reviewsCount: 29,
    inStock: false,
    sellerUrl: "https://www.daraz.com.np/products/fujifilm-x-t5-camera-i67890.html",
    minPrice: 220000,
    maxPrice: 245000,
    avgPrice: 232000,
    priceHistory: [
      { date: "May 20", price: 245000 },
      { date: "May 25", price: 240000 },
      { date: "Jun 01", price: 235000 },
      { date: "Jun 05", price: 230000 },
      { date: "Jun 10", price: 228000 },
      { date: "Jun 19", price: 225000 }
    ],
    updatedAt: new Date().toISOString()
  }
];
