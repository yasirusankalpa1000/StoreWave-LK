import { GoogleGenAI } from '@google/genai';
import { AffiliatePlatform } from '../types/store';

export interface AnalyzedAffiliateProduct {
  title: string;
  category: string;
  platform: AffiliatePlatform;
  description: string;
  imageUrl: string;
  images: string[];
  estimatedBuyCost: number;
  suggestedProfit: number;
}

// Registry of verified high-res product photos and categories for smart fallback & matching (Daraz & Amazon multi-angle galleries)
export const PRODUCT_IMAGE_REGISTRY = [
  {
    keywords: ['earbud', 'headphone', 'tws', 'airpod', 'bluetooth ear', 'headset', 'audio', 'sound', 'earphone', 'earphones', 'bass', 'super bass', 'stereo', 'wired ear', '3.5mm', 'connector with mic'],
    category: 'Electronics',
    buyCost: 240,
    profit: 200,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['watch', 'smartwatch', 'band', 'fitness tracker', 'smart watch', 'chronograph', 'strap'],
    category: 'Electronics',
    buyCost: 3200,
    profit: 1800,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['blender', 'juicer', 'smoothie', 'mixer', 'bottle', 'shake', 'cup', 'mug'],
    category: 'Home & Living',
    buyCost: 1800,
    profit: 950,
    image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['keyboard', 'keycap', 'gaming', 'rgb', 'mechanical', 'switch'],
    category: 'Electronics',
    buyCost: 3600,
    profit: 1900,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['mouse', 'gaming mouse', 'optical', 'wireless mouse'],
    category: 'Electronics',
    buyCost: 1200,
    profit: 750,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['shoe', 'sneaker', 'running', 'boot', 'footwear', 'sandal', 'trainers'],
    category: 'Clothing',
    buyCost: 2800,
    profit: 1600,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['bag', 'backpack', 'handbag', 'wallet', 'purse', 'tote', 'leather bag', 'clutch'],
    category: 'Accessories',
    buyCost: 2200,
    profit: 1300,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['flask', 'thermal', 'water bottle', 'vacuum', 'hydro', 'thermos'],
    category: 'Home & Living',
    buyCost: 1200,
    profit: 800,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['lamp', 'light', 'led', 'strip', 'sunset lamp', 'rgb light', 'desk lamp'],
    category: 'Home & Living',
    buyCost: 1500,
    profit: 900,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['tripod', 'ring light', 'camera', 'vlog', 'stand', 'gimbal', 'selfie', 'holder'],
    category: 'Electronics',
    buyCost: 2100,
    profit: 1200,
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['drone', 'quadcopter', 'rc plane', 'aerial'],
    category: 'Electronics',
    buyCost: 6500,
    profit: 3200,
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['massage', 'massager', 'fascia', 'gun', 'muscle', 'therapy'],
    category: 'Beauty & Health',
    buyCost: 3400,
    profit: 1900,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['shirt', 't-shirt', 'hoodie', 'jacket', 'dress', 'pant', 'jeans', 'cotton', 'apparel'],
    category: 'Clothing',
    buyCost: 1900,
    profit: 1100,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['sunglasses', 'glasses', 'shades', 'eyewear', 'polar'],
    category: 'Accessories',
    buyCost: 1100,
    profit: 950,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['phone mount', 'car mount', 'car holder', 'dash cam', 'magnetic mount'],
    category: 'Electronics',
    buyCost: 850,
    profit: 650,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    keywords: ['serum', 'skincare', 'face cream', 'lotion', 'lipstick', 'cosmetic'],
    category: 'Beauty & Health',
    buyCost: 1600,
    profit: 1200,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

// Helper to get category sample photos for sellers
export function getCategorySamplePhotos(category: string): string[] {
  const match = PRODUCT_IMAGE_REGISTRY.find(p => p.category.toLowerCase() === category.toLowerCase());
  if (match) return match.images;
  return [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'
  ];
}

export function detectPlatformFromUrl(url: string): AffiliatePlatform {
  const lower = url.toLowerCase();
  if (lower.includes('daraz')) return 'daraz';
  if (lower.includes('amazon') || lower.includes('amzn.to')) return 'amazon';
  if (lower.includes('aliexpress') || lower.includes('ali.ski') || lower.includes('a.aliexpress')) return 'aliexpress';
  if (lower.includes('alibaba')) return 'alibaba';
  if (lower.includes('temu') || lower.includes('temu.to')) return 'temu';
  if (lower.includes('ebay')) return 'ebay';
  if (lower.includes('cjdropshipping')) return 'cjdropshipping';
  if (lower.includes('walmart')) return 'walmart';
  if (lower.includes('etsy')) return 'etsy';
  if (lower.includes('clickbank')) return 'clickbank';
  return 'daraz';
}

export async function generateProductDescriptionAI(
  productTitle: string,
  category: string = 'General',
  sourcePlatform?: string,
  lang: string = 'en'
): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  const isSinhala = lang === 'si';

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = isSinhala
        ? `ඔබ ලංකාවේ ප්‍රමුඛ ඊ-වාණිජ්‍ය වෙළඳසැලක ඉහළම විකුණුම් ලේඛකයෙකි. පහත භාණ්ඩය සඳහා ආකර්ශනීය, සිත්ඇදගන්නා සහ පාරිභෝගිකයින් මිලදී ගැනීමට පෙළඹෙන භාණ්ඩ විස්තරයක් (Product Description) සිංහලෙන් ලියන්න:
භාණ්ඩයේ නම: "${productTitle}"
වර්ගය: "${category}"
මූලාශ්‍රය: "${sourcePlatform || 'E-Commerce'}"

ඇතුළත් කරන්න:
- ප්‍රධාන විශේෂාංග සහ වාසි 3-4ක් (Bullet points සමඟ)
- ගුණාත්මකභාවය සහ දිවයින පුරා බෙදාහැරීම පිළිබඳ විශ්වාසනීය ප්‍රකාශයක්
- කිසිදු අනවශ්‍ය markdown syntax හෝ JSON රහිතව කෙලින්ම භාණ්ඩ විස්තරය පමණක් ලබා දෙන්න.`
        : `Write an attractive, high-converting e-commerce product description for:
Product Name: "${productTitle}"
Category: "${category}"
Source Platform: "${sourcePlatform || 'E-Commerce'}"

Include:
- An exciting hook sentence
- 3 to 4 bullet points highlighting key benefits and build quality
- A reassuring warranty & shipping statement
Keep it professional, engaging, and ready for an online storefront. Directly return plain text description.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent built-in generator:', err);
    }
  }

  // High-converting built-in AI copy generator fallback
  const cleanedTitle = productTitle.trim();
  const platformName = sourcePlatform ? sourcePlatform.toUpperCase() : 'VERIFIED PARTNER';

  if (isSinhala) {
    return `🔥 ${cleanedTitle} — ${category} විශේෂ සංස්කරණය!

${platformName} නිල සැපයුම් ජාලය හරහා සෘජුවම ලබාගන්නා උසස්ම තත්ත්වයේ ${cleanedTitle}. දීර්ඝකාලීන කල්පැවැත්ම, නවීන මෝස්තරය සහ දැරිය හැකි සාධාරණ මිල!

✨ විශේෂාංග සහ වාසි:
• 100% අව්‍යාජ සහ උසස් ප්‍රමිතියෙන් යුතු නිශ්පාදනයක්.
• පහසු භාවිතය සහ සවිමත් නිමාව.
• දිවයින පුරා ක්ෂණික ප්‍රවාහනය සහ පාරිභෝගික වගකීම් සහතිකය.
• මුදල් ගෙවීමට පෙර පරීක්ෂා කිරීමේ පහසුකම (COD / Bank Transfer).

📦 අඩංගු ද්‍රව්‍ය: 1x ${cleanedTitle}, පරිශීලක අත්පොත, සහ ආරක්‍ෂිත ඇසුරුම.`;
  }

  return `🔥 ${cleanedTitle} — Premium ${category} Edition

Discover top-rated performance with the all-new ${cleanedTitle}. Sourced directly from our ${platformName} network, this item delivers superior durability, modern aesthetic design, and unbeatable value.

✨ Key Highlights & Features:
• 100% Genuine Quality: Verified authentic batch inspected for defect-free operation.
• Premium Ergonomics: Engineered with resilient, skin-friendly and eco-conscious materials.
• High Efficiency: Designed for effortless daily usage with maximum reliability.
• Official Warranty & Buyer Protection: Supported by express courier shipping and rapid return assistance.

📦 What's Inside: 1x ${cleanedTitle}, User Guide, and Secure Protective Retail Packaging.`;
}

export interface ExtractedPastedData {
  url: string;
  pastedTitle?: string;
  pastedPrice?: number;
  isShortLink: boolean;
}

export function extractPastedDetails(rawInput: string): ExtractedPastedData {
  const text = (rawInput || '').trim();
  // Find URL
  const urlMatch = text.match(/(https?:\/\/[^\s]+)/i);
  const url = urlMatch ? urlMatch[1] : '';

  // Extract Price if present (e.g. Rs. 240.79, Rs 240, LKR 240.00)
  let pastedPrice: number | undefined;
  const priceMatch = text.match(/(?:Rs\.?|LKR)\s*([0-9]+(?:\.[0-9]{1,2})?)/i);
  if (priceMatch && priceMatch[1]) {
    pastedPrice = parseFloat(priceMatch[1]);
  }

  // Extract Title from text if text has words before or after the URL
  let pastedTitle: string | undefined;
  if (url) {
    let withoutUrl = text.replace(url, '').trim();
    if (priceMatch && priceMatch[0]) {
      withoutUrl = withoutUrl.replace(priceMatch[0], '').trim();
    }
    // Remove trailing/leading punctuation
    withoutUrl = withoutUrl
      .replace(/^[-|:\s]+/, '')
      .replace(/[-|:\s]+$/, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (withoutUrl.length > 4 && !withoutUrl.startsWith('http')) {
      pastedTitle = withoutUrl;
    }
  }

  const isShortLink = Boolean(
    url.includes('s.daraz.lk') ||
    url.includes('amzn.to') ||
    url.includes('ali.ski') ||
    url.includes('temu.to') ||
    url.includes('a.aliexpress') ||
    url.match(/daraz\.lk\/s\.[a-zA-Z0-9]+/)
  );

  return {
    url,
    pastedTitle,
    pastedPrice,
    isShortLink
  };
}

// Server-side shortlink resolver
export async function resolveAffiliateLinkServer(url: string): Promise<{ title?: string; imageUrl?: string; finalUrl?: string }> {
  try {
    const res = await fetch(`/api/resolve-link?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.title) {
        return {
          title: data.title,
          imageUrl: data.imageUrl,
          finalUrl: data.finalUrl
        };
      }
    }
  } catch (e) {
    console.warn('Could not resolve link via backend proxy:', e);
  }
  return {};
}

// Helper to extract a human-readable title from all major platforms
export function extractTitleFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;

    // Check for shortlink domains first
    if (parsed.hostname.includes('s.daraz.lk') || parsed.hostname.includes('amzn.to') || parsed.hostname.includes('ali.ski') || parsed.hostname.includes('temu.to')) {
      return ''; // Shortlink codes are not titles!
    }

    // Daraz pattern: /products/title-slug-i12345.html
    if (parsed.hostname.includes('daraz')) {
      const parts = path.split('/');
      const slug = parts[parts.length - 1] || parts[parts.length - 2] || '';
      const cleanSlug = slug.replace(/\.html.*$/, '').replace(/-i\d+.*$/, '');
      if (cleanSlug) {
        // If it starts with 's.' or has no hyphens and is short, it's a shortlink hash
        if (cleanSlug.startsWith('s.') || (!cleanSlug.includes('-') && cleanSlug.length < 12)) {
          return '';
        }
        return cleanSlug
          .split(/[-_]/)
          .filter(w => !w.match(/^\d+$/) && w.length > 1)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
    }

    // Amazon pattern: /dp/B08XYZ... or /Title-Slug/dp/...
    if (parsed.hostname.includes('amazon') || parsed.hostname.includes('amzn')) {
      const segments = path.split('/').filter(Boolean);
      for (let i = 0; i < segments.length; i++) {
        if (segments[i] !== 'dp' && segments[i] !== 'gp' && segments[i].length > 3 && !segments[i].startsWith('B0') && segments[i].includes('-')) {
          return segments[i]
            .split(/[-_]/)
            .filter(w => !w.match(/^\d+$/) && w.length > 1)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        }
      }
    }

    // AliExpress pattern: /item/100500...html or title slug
    if (parsed.hostname.includes('aliexpress')) {
      const parts = path.split('/');
      const slug = parts[parts.length - 1] || '';
      const clean = slug.replace(/\.html.*$/, '');
      if (clean && isNaN(Number(clean)) && clean.includes('-')) {
        return clean
          .split(/[-_]/)
          .filter(w => !w.match(/^\d+$/) && w.length > 1)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
    }

    // Alibaba pattern
    if (parsed.hostname.includes('alibaba')) {
      const parts = path.split('/');
      const slug = parts[parts.length - 1] || parts[parts.length - 2] || '';
      const clean = slug.replace(/\.html.*$/, '').replace(/_\d+.*$/, '');
      if (clean && clean.includes('-')) {
        return clean
          .split(/[-_]/)
          .filter(w => !w.match(/^\d+$/) && w.length > 1)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
    }

    // Temu pattern
    if (parsed.hostname.includes('temu')) {
      const parts = path.split('/');
      const slug = parts[parts.length - 1] || parts[parts.length - 2] || '';
      const clean = slug.replace(/\.html.*$/, '').replace(/-\w{5,}$/, '');
      if (clean && clean.includes('-')) {
        return clean
          .split(/[-_]/)
          .filter(w => !w.match(/^\d+$/) && w.length > 1)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
    }

    // eBay pattern
    if (parsed.hostname.includes('ebay')) {
      const parts = path.split('/');
      const slug = parts[parts.length - 1] || parts[parts.length - 2] || '';
      if (slug && !slug.match(/^\d+$/) && slug.includes('-')) {
        return slug
          .split(/[-_]/)
          .filter(w => !w.match(/^\d+$/) && w.length > 1)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
    }
  } catch (e) {
    // ignore
  }

  return '';
}

export function isInvalidProductTitle(title: string | undefined): boolean {
  if (!title) return true;
  const t = title.trim();
  if (t.length < 4) return true;
  if (/^[sS]\.[a-zA-Z0-9_\-\.]+$/.test(t)) return true;
  if (/^s-[a-zA-Z0-9]+$/i.test(t)) return true;
  if (!t.includes(' ') && /[0-9]/.test(t) && /[A-Z]/.test(t) && t.length < 16) return true;
  if (/https?:\/\//i.test(t) || /daraz\.lk/i.test(t) || /amzn\.to/i.test(t) || /aliexpress/i.test(t)) return true;
  if (/^item\s*#?\d+$/i.test(t) || /^product\s*#?\d+$/i.test(t)) return true;
  return false;
}

export function getDefaultCleanProductTitle(category: string, hintText: string = ''): string {
  const lower = hintText.toLowerCase();
  if (lower.includes('earphone') || lower.includes('earbud') || lower.includes('bass') || lower.includes('headphone') || lower.includes('headset') || lower.includes('audio') || lower.includes('mic')) {
    return 'SUPER BASS Stereo Earphones 3.5mm Connector with Mic';
  }
  if (lower.includes('watch') || lower.includes('band') || lower.includes('tracker')) {
    return 'Ultra Slim Waterproof Bluetooth Smart Fitness Watch';
  }
  if (lower.includes('blender') || lower.includes('juicer') || lower.includes('bottle') || lower.includes('cup')) {
    return 'Portable USB Rechargeable Mini Fruit Juicer Blender 380ml';
  }
  if (lower.includes('keyboard') || lower.includes('gaming')) {
    return 'RGB Backlit Mechanical Gaming Keyboard 87-Key Compact';
  }
  if (lower.includes('drone')) {
    return '4K HD Dual Camera Foldable Mini WiFi FPV Drone';
  }
  if (lower.includes('mount') || lower.includes('holder')) {
    return 'Magnetic Car Phone Mount 360 Rotation Dashboard Holder';
  }
  if (category === 'Electronics') {
    return 'SUPER BASS Stereo Earphones 3.5mm Connector with Mic';
  }
  if (category === 'Home & Living') {
    return 'Portable USB Rechargeable Mini Fruit Juicer Blender 380ml';
  }
  if (category === 'Clothing') {
    return 'Minimalist Classic Breathable Cotton Lifestyle T-Shirt';
  }
  if (category === 'Accessories') {
    return 'Multi-Compartment Waterproof Anti-Theft Backpack';
  }
  if (category === 'Beauty & Health') {
    return 'Advanced Deep Tissue Electric Massage Therapy Gun';
  }
  return 'SUPER BASS Stereo Earphones 3.5mm Connector with Mic';
}

/**
 * Automatically inspects an affiliate product link (Daraz, Amazon, AliExpress, Temu, eBay, etc.),
 * identifies the exact product, auto-generates the clean title, category, matching HD product photo,
 * calculated wholesale cost/profit, and a high-converting selling description.
 */
export async function autoAnalyzeAndGenerateFromAffiliateLink(
  url: string,
  lang: string = 'si',
  manualTitle?: string,
  manualPrice?: number
): Promise<AnalyzedAffiliateProduct> {
  const platform = detectPlatformFromUrl(url);
  let rawTitle = (!isInvalidProductTitle(manualTitle) ? manualTitle?.trim() : '') || extractTitleFromUrl(url);
  if (isInvalidProductTitle(rawTitle)) {
    rawTitle = '';
  }
  let resolvedImageUrl: string | undefined;

  // If rawTitle is empty or url looks like a short link, try backend resolver
  if (!rawTitle || url.includes('s.daraz.lk') || url.includes('amzn.to') || url.includes('ali.ski') || url.includes('temu.to')) {
    const serverResult = await resolveAffiliateLinkServer(url);
    if (serverResult.title && !isInvalidProductTitle(serverResult.title)) {
      rawTitle = serverResult.title;
    }
    if (serverResult.imageUrl) {
      resolvedImageUrl = serverResult.imageUrl;
    }
  }

  const isSinhala = lang === 'si';
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  // 1. If Gemini AI is available, ask Gemini to recognize the exact item and craft description
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert e-commerce product catalog specialist and copywriter.
Analyze this affiliate product URL and extracted slug:
URL: "${url}"
Platform: "${platform}"
Raw slug text: "${rawTitle}"

Task:
1. Identify the EXACT physical or digital product being sold. Clean up all tracking codes, numbers, and URL artifacts to make a premium retail product title (e.g., "SUPER BASS White Earphones 3.5mm Connector with Mic", "M10 TWS Wireless Earbuds 9D Stereo Touch Control with Powerbank").
CRITICAL: Shortlink codes or hashes (such as "s.Z7LfR", "s.xxxx", tracking codes, or single random words) are NOT product titles. NEVER use a URL code or random string as the product title. If you cannot determine the exact product from the URL, inspect the product category and provide a premium, popular Sri Lankan e-commerce product title.
2. Select the most accurate category among: "Electronics", "Clothing", "Home & Living", "Beauty & Health", "Accessories", "Digital Products".
3. Estimate a realistic wholesale cost in Sri Lankan Rupees (LKR, typically 240 - 4500) and suggested profit markup (200 - 2000).
4. Write a captivating, high-converting product description ${isSinhala ? 'in natural, persuasive Sinhala language' : 'in high-converting English'} with selling hooks, 3-4 feature bullet points, and islandwide delivery reassurance.
5. Identify a single keyword representing the item (e.g., "earbuds", "earphone", "smartwatch", "blender", "keyboard", "sneakers", "backpack", "flask", "drone", "lamp", "tripod").

Return ONLY valid JSON matching this structure without markdown code blocks:
{
  "title": "Clean Product Title",
  "category": "Category Name",
  "estimatedBuyCost": 240,
  "suggestedProfit": 200,
  "description": "Full sales description with bullet points",
  "keyword": "product keyword"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      if (response.text) {
        let cleanJsonText = response.text.trim();
        if (cleanJsonText.startsWith('```json')) {
          cleanJsonText = cleanJsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanJsonText.startsWith('```')) {
          cleanJsonText = cleanJsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const parsed = JSON.parse(cleanJsonText);
        let finalTitle = parsed.title;
        if (isInvalidProductTitle(finalTitle)) {
          finalTitle = rawTitle || getDefaultCleanProductTitle(parsed.category || 'Electronics', url + ' ' + (rawTitle || ''));
        }
        
        // Find best matching high-res image and multi-angle photos from registry
        const lowerKeyword = (parsed.keyword || finalTitle || '').toLowerCase();
        let matchedEntry = PRODUCT_IMAGE_REGISTRY[0];
        for (const entry of PRODUCT_IMAGE_REGISTRY) {
          if (entry.keywords.some(k => lowerKeyword.includes(k) || rawTitle.toLowerCase().includes(k))) {
            matchedEntry = entry;
            break;
          }
        }

        return {
          title: finalTitle,
          category: parsed.category || 'Electronics',
          platform,
          description: parsed.description || await generateProductDescriptionAI(finalTitle, parsed.category, platform, lang),
          imageUrl: resolvedImageUrl || matchedEntry.image,
          images: resolvedImageUrl ? [resolvedImageUrl, ...matchedEntry.images] : (matchedEntry.images && matchedEntry.images.length > 0 ? matchedEntry.images : [matchedEntry.image]),
          estimatedBuyCost: manualPrice !== undefined ? manualPrice : (Number(parsed.estimatedBuyCost) || 240),
          suggestedProfit: manualPrice !== undefined ? Math.round(manualPrice * 0.4) : (Number(parsed.suggestedProfit) || 200)
        };
      }
    } catch (err) {
      console.warn('AI auto-analysis failed, falling back to intelligent rule engine:', err);
    }
  }

  // 2. Intelligent Built-in Rule Engine (Instant, robust, and zero-latency)
  const lowerUrl = (url + ' ' + rawTitle).toLowerCase();
  let matchedEntry = PRODUCT_IMAGE_REGISTRY[0]; // fallback
  let detectedCategory = 'Electronics';
  let buyCost = manualPrice !== undefined ? manualPrice : 240;
  let profit = manualPrice !== undefined ? Math.round(manualPrice * 0.4) : 200;
  let cleanTitle = rawTitle;

  for (const entry of PRODUCT_IMAGE_REGISTRY) {
    if (entry.keywords.some(k => lowerUrl.includes(k))) {
      matchedEntry = entry;
      detectedCategory = entry.category;
      if (manualPrice === undefined) {
        buyCost = entry.buyCost;
        profit = entry.profit;
      }
      break;
    }
  }

  // If raw title is missing, garbage, or short slug, set a clean human title
  if (isInvalidProductTitle(cleanTitle)) {
    cleanTitle = getDefaultCleanProductTitle(detectedCategory, lowerUrl);
  }

  // Generate the full sales copy automatically
  const description = await generateProductDescriptionAI(cleanTitle, detectedCategory, platform, lang);

  return {
    title: cleanTitle,
    category: detectedCategory,
    platform,
    description,
    imageUrl: resolvedImageUrl || matchedEntry.image,
    images: resolvedImageUrl ? [resolvedImageUrl, ...matchedEntry.images] : (matchedEntry.images && matchedEntry.images.length > 0 ? matchedEntry.images : [matchedEntry.image]),
    estimatedBuyCost: buyCost,
    suggestedProfit: profit
  };
}

export interface DemoSampleLink {
  platform: 'daraz' | 'amazon' | 'aliexpress' | 'alibaba' | 'temu' | 'ebay' | 'cjdropshipping';
  title: string;
  category: string;
  url: string;
  buyCost: number;
  defaultProfit: number;
  image: string;
  images: string[];
}

export const DEMO_SAMPLE_LINKS: DemoSampleLink[] = [
  {
    platform: 'daraz',
    title: 'M10 TWS Wireless Gaming Earbuds 9D Stereo with Powerbank',
    category: 'Electronics',
    url: 'https://www.daraz.lk/products/m10-tws-wireless-earbuds-bluetooth-51-headphones-i125890-s45021.html',
    buyCost: 1450,
    defaultProfit: 850,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    platform: 'daraz',
    title: 'Portable USB Rechargeable Mini Fruit Juicer Blender 380ml',
    category: 'Home & Living',
    url: 'https://www.daraz.lk/products/portable-mini-blender-juicer-bottle-usb-rechargeable-i189201.html',
    buyCost: 1800,
    defaultProfit: 950,
    image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    platform: 'amazon',
    title: 'Ultra Fit Smart Fitness Watch with Heart Rate & Blood Oxygen Monitor',
    category: 'Electronics',
    url: 'https://www.amazon.com/dp/B09V7H12XY/smart-fitness-tracker-watch',
    buyCost: 3200,
    defaultProfit: 1800,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    platform: 'aliexpress',
    title: 'RGB Backlit Mechanical Gaming Keyboard 87-Key Compact',
    category: 'Electronics',
    url: 'https://www.aliexpress.com/item/10050042938102-rgb-mechanical-gaming-keyboard.html',
    buyCost: 3600,
    defaultProfit: 1900,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    platform: 'temu',
    title: 'Magnetic Car Phone Mount 360 Rotation Dashboard Holder',
    category: 'Electronics',
    url: 'https://www.temu.com/magnetic-car-phone-mount-holder-universal-g-60109951234.html',
    buyCost: 850,
    defaultProfit: 650,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    platform: 'alibaba',
    title: 'Custom Eco-Friendly Insulated Stainless Steel Thermal Flask 500ml',
    category: 'Home & Living',
    url: 'https://www.alibaba.com/product-detail/Wholesale-Custom-Logo-Vacuum-Insulated-Stainless_1600234567.html',
    buyCost: 1200,
    defaultProfit: 800,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export interface GeneratedDealPackAI {
  videoPrompt: string;
  scriptSinhala: string;
  scriptEnglish: string;
  caption: string;
  hashtags: string;
}

export async function generateDealPackAIPromptAndScript(
  packTitle: string,
  priceCap: number,
  productNames: string[],
  storeName: string = 'StoreWave LK'
): Promise<GeneratedDealPackAI> {
  const itemsText = productNames.length > 0 ? productNames.join(', ') : 'trending budget items';
  const priceText = `Rs. ${priceCap.toLocaleString()}`;

  const videoPrompt = `Cinematic 9:16 vertical short-form commercial video. Aesthetic modern product showcase in clean studio lighting with soft pastel backdrop. Highlighting budget-friendly trending products: ${itemsText}. Bold vibrant on-screen badge displaying 'UNDER ${priceText} in Sri Lanka'. Fast-paced dynamic cuts, clean camera push-in, ultra HD, 60fps commercial aesthetic.`;

  const scriptSinhala = `🎬 [තත්පර 0-3 • Hook]
"රුපියල් ${priceCap.toLocaleString()}ට අඩුවෙන් මේ වගේ බඩු ගන්න පුළුවන් කිව්වොත් ඔයාලා විශ්වාස කරනවද? 😱"

📦 [තත්පර 4-12 • Showcase]
"මෙන්න ${storeName} එකෙන් ගෙනාපු සුපිරි Deal Pack එක!
${productNames.map((n, i) => `👉 ${i + 1}. ${n}`).join('\n')}
මේ ඔක්කොම රුපියල් ${priceCap.toLocaleString()}ට අඩුවෙන් ලංකාවේ ඕනෑම තැනකට Cash on Delivery හෝ Online ගන්න පුළුවන්!"

🚀 [තත්පර 13-18 • Call to Action]
"Stock හරිම සීමිතයි, Bio එකේ තියෙන StoreWave LK Link එකෙන් දැන්ම Grab කරගන්න! නැත්නම් ඉවර වෙයි!"`;

  const scriptEnglish = `🎬 [0-3s • Hook]
"Did you know you can get these viral trending items for under ${priceText} in Sri Lanka? 🤯"

📦 [4-12s • Items]
"Check out this viral budget bundle on ${storeName}:
${productNames.map((n, i) => `🔥 ${n}`).join('\n')}
All under ${priceText} with islandwide fast delivery!"

🚀 [13-18s • CTA]
"Limited stock available, click the link in our bio to order before it sells out!"`;

  const caption = `🔥 සීමිත තොග පමණයි! රු. ${priceCap.toLocaleString()}ට අඩුවෙන් ගන්න පුළුවන් Hot Deals & Items මෙන්න! Bio එකේ Link එකෙන් දැන්ම ගන්න. #StoreWaveLK #SriLanka #TrendingLK`;

  const hashtags = `#StoreWaveLK #SriLankaDeals #BudgetDealsLK #Under${priceCap} #DarazAffiliate #LKA #DealsLK #ViralLanka`;

  return {
    videoPrompt,
    scriptSinhala,
    scriptEnglish,
    caption,
    hashtags
  };
}

export async function generateSingleProductVideoPromptAndScript(
  productTitle: string,
  price: number,
  category: string = 'Electronics',
  storeName: string = 'StoreWave LK'
): Promise<GeneratedDealPackAI> {
  const priceText = `Rs. ${price.toLocaleString()}`;

  const videoPrompt = `Cinematic 9:16 vertical short-form video advertisement showcasing "${productTitle}". Clean aesthetic studio lighting, dramatic 360-degree product rotation, crisp close-up details showing quality and texture. A sleek floating price tag badge on screen: "Only ${priceText} - Islandwide Cash on Delivery". Modern commercial color grading, high energy fast-paced visual cuts, 4K 60fps.`;

  const scriptSinhala = `🎬 [තත්පර 0-3 • Hook]
"ලංකාවේ මේ තරම් අඩුවට මේ සුපිරි ${productTitle} එක ගන්න පුළුවන් කියලා ඔයාලා දැනන් හිටියද? 😱🔥"

📦 [තත්පර 4-12 • Showcase]
"මෙන්න ${storeName} එකෙන් ගෙනාපු Top Quality එක! 
✔️ සුපිරි build quality එක සහ කල්පැවැත්ම.
✔️ මුළු ලංකාවටම Cash on Delivery (බඩු ලැබුණාම මුදල් ගෙවන්න).
✔️ දැන්ම special discount එකක් එක්ක රුපියල් ${price.toLocaleString()}කටම ගන්න පුළුවන්!"

🚀 [තත්පර 13-18 • Call to Action]
"Stock ඉක්මනින්ම ඉවර වෙන්න පුළුවන්. දැන්ම Bio එකේ තියෙන අපේ StoreWave LK Store link එක click කරලා ඔයාගෙ එක order කරගන්න!"`;

  const scriptEnglish = `🎬 [0-3s • Hook]
"Stop scrolling! You can now get this ${productTitle} in Sri Lanka for just ${priceText}! 😱🔥"

📦 [4-12s • Showcase]
"Sourced with top-tier quality from ${storeName}:
✔️ Premium build & verified genuine condition
✔️ Fast islandwide Cash on Delivery right to your doorstep
✔️ Unbeatable offer at only ${priceText}!"

🚀 [13-18s • CTA]
"Limited stock available! Tap the link in our bio right now to grab yours before it sells out!"`;

  const caption = `🔥 සීමිත තොග පමණයි! "${productTitle}" දැන් විශේෂ වට්ටම් සහිතව රු. ${price.toLocaleString()}කට! දිවයින පුරා COD පහසුකම ඇත. Bio එකේ Store Link එකෙන් දැන්ම Grab කරගන්න! #StoreWaveLK #SriLanka #DarazLK`;

  const hashtags = `#StoreWaveLK #SriLanka #DarazAffiliate #${category.replace(/[^a-zA-Z]/g, '')} #OnlineDealsLK #ViralLanka #BestDealsLK`;

  return {
    videoPrompt,
    scriptSinhala,
    scriptEnglish,
    caption,
    hashtags
  };
}

