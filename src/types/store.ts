export type PaymentMethod = 'whatsapp' | 'bank_slip' | 'card' | 'cod' | 'koko';
export type CurrencyCode = 'LKR' | 'USD' | 'EUR' | 'GBP';
export type AffiliatePlatform = 
  | 'daraz' 
  | 'amazon' 
  | 'aliexpress' 
  | 'alibaba' 
  | 'temu' 
  | 'ebay' 
  | 'cjdropshipping' 
  | 'walmart' 
  | 'etsy' 
  | 'clickbank';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  photoUrl?: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // selling price in LKR
  compareAtPrice?: number;
  costPrice?: number; // buy cost / wholesale cost in LKR
  customProfitAmount?: number; // seller custom profit amount in LKR
  customProfitPercent?: number; // seller custom profit margin %
  images: string[];
  videoUrl?: string; // Marketing or product demonstration video
  category: string;
  stock: number;
  isDigital?: boolean;
  digitalDownloadUrl?: string;
  tags: string[];
  variants?: {
    size?: string[];
    color?: string[];
  };
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  featured?: boolean;
  importedFrom?: AffiliatePlatform;
  fulfillmentType?: 'affiliate' | 'dropship_margin' | 'physical_stock';
  codAvailable?: boolean;
  sourceUrl?: string;
  affiliateUrl?: string;
  affiliateCommission?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  district: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'verified' | 'failed';
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered';
  bankSlipUrl?: string;
  createdAt: string;
  notes?: string;
}

export interface StoreTheme {
  primaryColor: string;
  accentColor: string;
  fontStyle: 'modern' | 'minimal' | 'bold' | 'luxury';
  bannerText: string;
  bannerSubtext: string;
  bannerImage: string;
  announcementBar: string;
  showAnnouncement: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  currency: CurrencyCode;
  whatsappNumber: string;
  bankDetails: {
    bankName: string;
    branch: string;
    accountNumber: string;
    accountHolder: string;
  };
  shippingRules: {
    colomboRate: number;
    outstationRate: number;
    freeShippingThreshold: number;
  };
  affiliateIds: {
    daraz?: string;
    amazon?: string;
    aliexpress?: string;
    alibaba?: string;
    temu?: string;
    ebay?: string;
    cjdropshipping?: string;
    walmart?: string;
    etsy?: string;
    clickbank?: string;
  };
  allowCOD?: boolean;
  courierPartner?: 'koombiyo' | 'domex' | 'prompt_xpress' | 'fardar' | 'certis' | 'self';
  courierAccountNo?: string;
}

export interface MerchantUser {
  email: string;
  name: string;
  storeName: string;
  storeId?: string;
}

export interface TenantStore {
  id: string;
  slug: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  plan: 'free_trial' | 'free_owner' | 'starter' | 'pro' | 'business';
  monthlyFee: number;
  status: 'active' | 'trial' | 'suspended';
  productsCount: number;
  monthlySales: number;
  createdAt: string;
}
