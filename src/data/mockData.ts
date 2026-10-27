import { Product, Order, StoreTheme, StoreSettings, TenantStore } from '../types/store';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Signature Minimalist Oversized Linen Shirt',
    description: '100% breathable natural organic linen fabric. Tailored for comfort in tropical climates with premium pearl buttons and relaxed modern fit.',
    price: 4950,
    compareAtPrice: 6500,
    costPrice: 2100,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Clothing',
    stock: 24,
    tags: ['Best Seller', 'New Arrival', 'Summer'],
    variants: {
      size: ['S', 'M', 'L', 'XL'],
      color: ['Sand Beige', 'Olive Green', 'White Linen']
    },
    rating: 4.9,
    reviewCount: 42,
    reviews: [
      {
        id: 'rev-1',
        author: 'Malik Jayasuriya',
        rating: 5,
        date: '2 days ago',
        comment: 'Amazing linen quality! Very breathable in the Colombo heat and fits perfectly.',
        photoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        author: 'Ashan K.',
        rating: 5,
        date: '1 week ago',
        comment: 'Fast delivery to Kandy. Ordered via WhatsApp and got it in 48 hours!',
        verifiedPurchase: true
      }
    ],
    featured: true
  },
  {
    id: 'prod-2',
    title: '2026 Ultimate Life & Business Notion Planner',
    description: 'Instant download! Complete all-in-one Notion workspace with Habit tracker, Finance & Budget manager, Daily agenda, and Goal roadmap.',
    price: 2500,
    compareAtPrice: 4500,
    costPrice: 0,
    images: [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Digital Products',
    stock: 999,
    isDigital: true,
    digitalDownloadUrl: 'https://example.com/downloads/notion-master-planner-2026.zip',
    tags: ['Digital Download', 'Instant Access', 'Best Value'],
    rating: 5.0,
    reviewCount: 118,
    reviews: [
      {
        id: 'rev-3',
        author: 'Tharushi W.',
        rating: 5,
        date: '3 days ago',
        comment: 'Downloaded within 2 seconds after payment! The finance tracker is a lifesaver.',
        verifiedPurchase: true
      }
    ],
    featured: true
  },
  {
    id: 'prod-3',
    title: 'Handcrafted Ceylon Matte Ceramic Mug (400ml)',
    description: 'Artisanal stoneware crafted by local potters. Microwave and dishwasher safe with aesthetic ergonomic matte finish.',
    price: 2200,
    compareAtPrice: 2800,
    costPrice: 950,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Home & Living',
    stock: 15,
    tags: ['Handmade', 'Eco Friendly'],
    rating: 4.8,
    reviewCount: 29,
    reviews: [
      {
        id: 'rev-4',
        author: 'Sanduni De Silva',
        rating: 5,
        date: '5 days ago',
        comment: 'So aesthetic on my work desk! Packed very safely, no damages.',
        photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
        verifiedPurchase: true
      }
    ],
    featured: true
  },
  {
    id: 'prod-4',
    title: '10" RGB LED Studio Ring Light with 2.1m Tripod',
    description: 'Imported trending product from Daraz! Ideal for TikTok creators, Instagram reels, makeup artists, and live streamers. 3 light modes with adjustable dimmer.',
    price: 3650,
    compareAtPrice: 5200,
    costPrice: 1850,
    images: [
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Electronics',
    stock: 18,
    importedFrom: 'daraz',
    sourceUrl: 'https://www.daraz.lk/products/rgb-ring-light-i1023912.html',
    tags: ['Daraz Trending', 'Content Creator', 'Arbitrage Hot'],
    rating: 4.9,
    reviewCount: 52,
    reviews: [
      {
        id: 'rev-5',
        author: 'Dulanja S.',
        rating: 5,
        date: 'Yesterday',
        comment: 'Bought this for my TikTok videos. Solid tripod and multiple color modes!',
        photoUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80',
        verifiedPurchase: true
      }
    ],
    featured: true
  },
  {
    id: 'prod-5',
    title: '500+ Social Media Canva Templates for Businesses',
    description: 'Ready-to-use aesthetic templates for Instagram posts, stories, reels covers and promotional flyers for creators and sellers.',
    price: 1800,
    compareAtPrice: 3500,
    costPrice: 0,
    images: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Digital Products',
    stock: 999,
    isDigital: true,
    digitalDownloadUrl: 'https://example.com/downloads/canva-creator-pack.pdf',
    tags: ['Canva Template', 'Instant Download'],
    rating: 4.9,
    reviewCount: 84,
    featured: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: '#ORD-7801',
    customerName: 'Kasun Bandara',
    customerPhone: '+94 77 123 4567',
    customerEmail: 'kasun.b@gmail.com',
    shippingAddress: '45/2 Temple Road, Maharagama',
    district: 'Colombo',
    items: [
      {
        productId: 'prod-1',
        title: 'Signature Minimalist Oversized Linen Shirt',
        price: 4950,
        quantity: 1,
        selectedSize: 'L',
        selectedColor: 'Olive Green',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 4950,
    shippingFee: 350,
    discount: 0,
    total: 5300,
    paymentMethod: 'bank_slip',
    paymentStatus: 'pending',
    fulfillmentStatus: 'processing',
    bankSlipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-10 10:20 AM',
    notes: 'Please verify the BOC bank deposit slip attached.'
  },
  {
    id: 'ord-102',
    orderNumber: '#ORD-7802',
    customerName: 'Nipuni Perera',
    customerPhone: '+94 71 987 6543',
    customerEmail: 'nipuni.p@gmail.com',
    shippingAddress: '12 Kandy Road, Gampaha',
    district: 'Gampaha',
    items: [
      {
        productId: 'prod-2',
        title: '2026 Ultimate Life & Business Notion Planner',
        price: 2500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 2500,
    shippingFee: 0,
    discount: 250,
    total: 2250,
    paymentMethod: 'whatsapp',
    paymentStatus: 'verified',
    fulfillmentStatus: 'delivered',
    createdAt: '2026-10-10 11:45 AM'
  },
  {
    id: 'ord-103',
    orderNumber: '#ORD-7803',
    customerName: 'Dinuka Jayawardena',
    customerPhone: '+94 76 555 4321',
    customerEmail: 'dinuka.j@outlook.com',
    shippingAddress: '78 Galle Road, Bentota',
    district: 'Galle',
    items: [
      {
        productId: 'prod-3',
        title: 'Handcrafted Ceylon Matte Ceramic Mug (400ml)',
        price: 2200,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 4400,
    shippingFee: 450,
    discount: 0,
    total: 4850,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    fulfillmentStatus: 'unfulfilled',
    createdAt: '2026-10-10 12:15 PM'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'TrendWave LK',
  tagline: 'Viral TikTok Finds, Smart Gadgets & Trending Essentials',
  logoUrl: '',
  currency: 'LKR',
  whatsappNumber: '+94771234567',
  bankDetails: {
    bankName: 'Commercial Bank of Ceylon',
    branch: 'Kollupitiya Branch',
    accountNumber: '8004592019',
    accountHolder: 'TrendWave LK'
  },
  shippingRules: {
    colomboRate: 350,
    outstationRate: 450,
    freeShippingThreshold: 6000
  },
  affiliateIds: {
    daraz: 'SL_AFF_MASTER_99',
    amazon: 'nextgenstore-20',
    aliexpress: 'alitrack_88',
    temu: 'aff_temu_lk'
  }
};

export const INITIAL_THEME: StoreTheme = {
  primaryColor: '#0f172a',
  accentColor: '#6366f1',
  fontStyle: 'modern',
  bannerText: 'Sri Lanka’s #1 Viral TikTok Gadgets & Trending Finds',
  bannerSubtext: 'Handpicked viral electronics, smart lifestyle gadgets, and top-rated accessories with fast doorstep delivery.',
  bannerImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80',
  announcementBar: '🔥 Trending on TikTok: Islandwide Fast Delivery & Verified Product Quality!',
  showAnnouncement: true
};

export const INITIAL_TENANT_STORES: TenantStore[] = [
  {
    id: 'store-owner',
    slug: 'aura-studios',
    name: 'AURA Studios (Your Store)',
    ownerName: 'You (Platform Founder)',
    ownerEmail: 'yasirusankalpa2026@gmail.com',
    plan: 'free_owner',
    monthlyFee: 0,
    status: 'active',
    productsCount: 5,
    monthlySales: 168400,
    createdAt: '2026-10-01'
  },
  {
    id: 'store-1',
    slug: 'colombo-threads',
    name: 'Colombo Threads Co.',
    ownerName: 'Danushka Silva',
    ownerEmail: 'danushka@threads.lk',
    plan: 'starter',
    monthlyFee: 2000,
    status: 'active',
    productsCount: 18,
    monthlySales: 245000,
    createdAt: '2026-10-03'
  },
  {
    id: 'store-2',
    slug: 'island-bakes',
    name: 'The Cinnamon Whisk Bakery',
    ownerName: 'Senuri Fernando',
    ownerEmail: 'senuri@whisk.lk',
    plan: 'pro',
    monthlyFee: 3500,
    status: 'active',
    productsCount: 32,
    monthlySales: 410000,
    createdAt: '2026-10-05'
  },
  {
    id: 'store-3',
    slug: 'tech-vault-lk',
    name: 'TechVault Gadgets',
    ownerName: 'Roshan Wickrama',
    ownerEmail: 'roshan@techvault.lk',
    plan: 'starter',
    monthlyFee: 2000,
    status: 'active',
    productsCount: 14,
    monthlySales: 189000,
    createdAt: '2026-10-08'
  }
];
