import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  Check, 
  X, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  Upload, 
  CreditCard, 
  Download, 
  ArrowRight, 
  Eye, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Globe, 
  Camera, 
  ExternalLink,
  Zap,
  Tag,
  Trash2,
  AlertCircle,
  Play,
  Film,
  Video,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Palette
} from 'lucide-react';
import { Product, Order, StoreTheme, StoreSettings, OrderItem, PaymentMethod, CurrencyCode, ProductReview } from '../types/store';
import { LANGUAGES, SupportedLanguage, getT, formatPrice } from '../utils/i18n';
import { StoreWaveLogo } from './StoreWaveLogo';

interface StorefrontProps {
  products: Product[];
  theme: StoreTheme;
  settings: StoreSettings;
  currency: CurrencyCode;
  language: SupportedLanguage;
  onChangeCurrency: (currency: CurrencyCode) => void;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onPlaceOrder: (order: Order) => void;
  onNavigatePricing: () => void;
  onAddReview: (productId: string, review: ProductReview) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdateTheme?: (theme: StoreTheme) => void;
  onUpdateSettings?: (settings: StoreSettings) => void;
  isOwnerMode?: boolean;
  isPublicBuyer?: boolean;
}

export const Storefront: React.FC<StorefrontProps> = ({
  products,
  theme,
  settings,
  currency,
  language,
  onChangeCurrency,
  onChangeLanguage,
  onPlaceOrder,
  onNavigatePricing,
  onAddReview,
  onDeleteProduct,
  onUpdateTheme,
  onUpdateSettings,
  isOwnerMode = false,
  isPublicBuyer = false
}) => {
  const t = getT(language);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'photo' | 'video'>('photo');
  
  // Cart state
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  
  // Quick Store & Banner Customizer state (for editing top sentences, banner, logo and announcement)
  const [isQuickEditOpen, setIsQuickEditOpen] = useState<boolean>(false);
  const [quickEditTab, setQuickEditTab] = useState<'banner' | 'store' | 'announcement'>('banner');
  const [editStoreName, setEditStoreName] = useState<string>(settings.storeName);
  const [editTagline, setEditTagline] = useState<string>(settings.tagline || '');
  const [editLogoUrl, setEditLogoUrl] = useState<string>(settings.logoUrl || '');
  const [editAnnouncement, setEditAnnouncement] = useState<string>(theme.announcementBar || '');
  const [editShowAnnouncement, setEditShowAnnouncement] = useState<boolean>(theme.showAnnouncement ?? true);
  const [editBannerText, setEditBannerText] = useState<string>(theme.bannerText || '');
  const [editBannerSubtext, setEditBannerSubtext] = useState<string>(theme.bannerSubtext || '');
  const [editBannerImage, setEditBannerImage] = useState<string>(theme.bannerImage || '');
  const [editPrimaryColor, setEditPrimaryColor] = useState<string>(theme.primaryColor || '#0f172a');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  // Sync state if props change externally
  useEffect(() => {
    setEditStoreName(settings.storeName);
    setEditTagline(settings.tagline || '');
    setEditLogoUrl(settings.logoUrl || '');
  }, [settings.storeName, settings.tagline, settings.logoUrl]);

  useEffect(() => {
    setEditAnnouncement(theme.announcementBar || '');
    setEditShowAnnouncement(theme.showAnnouncement ?? true);
    setEditBannerText(theme.bannerText || '');
    setEditBannerSubtext(theme.bannerSubtext || '');
    setEditBannerImage(theme.bannerImage || '');
    setEditPrimaryColor(theme.primaryColor || '#0f172a');
  }, [theme.announcementBar, theme.showAnnouncement, theme.bannerText, theme.bannerSubtext, theme.bannerImage, theme.primaryColor]);

  const handleSaveQuickCustomization = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        storeName: editStoreName.trim() || settings.storeName,
        tagline: editTagline.trim(),
        logoUrl: editLogoUrl.trim() || undefined
      });
    }
    if (onUpdateTheme) {
      onUpdateTheme({
        ...theme,
        announcementBar: editAnnouncement.trim(),
        showAnnouncement: editShowAnnouncement,
        bannerText: editBannerText.trim(),
        bannerSubtext: editBannerSubtext.trim(),
        bannerImage: editBannerImage.trim() || theme.bannerImage,
        primaryColor: editPrimaryColor
      });
    }
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setIsQuickEditOpen(false);
    }, 700);
  };
  
  // Product Variant selection in detail view
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  // Review Form in detail view
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewAuthor, setReviewAuthor] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState<string>('');

  // Checkout form state
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Colombo');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_slip');
  const [bankSlipUrl, setBankSlipUrl] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  // Storefront Product Deletion states
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deletedSuccessToast, setDeletedSuccessToast] = useState<string | null>(null);

  // Categories list
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Check if COD is restricted based on Store Settings or Dropship Margin items in cart
  const isCodDisabled = 
    settings.allowCOD === false || 
    cart.some(item => {
      const fullProd = products.find(p => p.id === item.productId);
      return fullProd?.fulfillmentType === 'dropship_margin' || fullProd?.codAvailable === false;
    });

  // Shipping calculation
  const isFreeShipping = cartSubtotal >= settings.shippingRules.freeShippingThreshold;
  const shippingFee = cart.some(i => products.find(p => p.id === i.productId)?.isDigital) && cart.every(i => products.find(p => p.id === i.productId)?.isDigital)
    ? 0 // All items are digital
    : isFreeShipping 
      ? 0 
      : (selectedDistrict === 'Colombo' ? settings.shippingRules.colomboRate : settings.shippingRules.outstationRate);
  
  const totalAmount = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  // Add to cart helper
  const handleAddToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.productId === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: quantity,
            selectedSize: size,
            selectedColor: color,
            image: product.images[0]
          }
        ];
      }
    });
    setIsCartOpen(true);
    if (selectedProduct) setSelectedProduct(null);
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      return updated;
    });
  };

  // Coupon apply
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount);
    } else if (couponCode.toUpperCase() === 'FIRST500') {
      setDiscountAmount(500);
    } else {
      alert('Invalid coupon code. Try code: SAVE10');
    }
  };

  // Place order
  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) {
      alert('Please fill out your name, phone number, and delivery address.');
      return;
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      customerEmail: customerEmail || `${customerPhone}@customer.lk`,
      shippingAddress,
      district: selectedDistrict,
      items: [...cart],
      subtotal: cartSubtotal,
      shippingFee,
      discount: discountAmount,
      total: totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'bank_slip' && bankSlipUrl ? 'pending' : (paymentMethod === 'card' ? 'verified' : 'pending'),
      fulfillmentStatus: 'processing',
      bankSlipUrl: bankSlipUrl || undefined,
      createdAt: new Date().toLocaleString()
    };

    onPlaceOrder(newOrder);
    setOrderSuccess(newOrder);
    setCart([]);
  };

  // Quick WhatsApp trigger
  const handleDirectWhatsAppOrder = (product: Product) => {
    const formattedPrice = formatPrice(product.price, currency);
    const message = encodeURIComponent(
      `Hello ${settings.storeName}! I want to order this item:\n\n` +
      `Product: ${product.title}\n` +
      `Price: ${formattedPrice}\n` +
      `Category: ${product.category}\n\n` +
      `Please let me know how to proceed with payment and delivery!`
    );
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  // Partner Affiliate URL Builder with full multi-platform tag injection
  const getAffiliateBuyUrl = (product: Product): string => {
    const rawUrl = product.affiliateUrl || product.sourceUrl;
    if (!rawUrl) return '#';
    let finalUrl = rawUrl.trim();
    const separator = finalUrl.includes('?') ? '&' : '?';

    if (product.importedFrom === 'daraz' && settings.affiliateIds?.daraz && !finalUrl.includes('aff_id=')) {
      return `${finalUrl}${separator}dsource=affiliate&aff_id=${encodeURIComponent(settings.affiliateIds.daraz)}`;
    }
    if (product.importedFrom === 'amazon' && settings.affiliateIds?.amazon && !finalUrl.includes('tag=')) {
      return `${finalUrl}${separator}tag=${encodeURIComponent(settings.affiliateIds.amazon)}`;
    }
    if (product.importedFrom === 'aliexpress' && settings.affiliateIds?.aliexpress && !finalUrl.includes('aff_fcid=')) {
      return `${finalUrl}${separator}aff_fcid=${encodeURIComponent(settings.affiliateIds.aliexpress)}`;
    }
    if (product.importedFrom === 'temu' && settings.affiliateIds?.temu && !finalUrl.includes('referral_code=')) {
      return `${finalUrl}${separator}referral_code=${encodeURIComponent(settings.affiliateIds.temu)}`;
    }
    if (product.importedFrom === 'alibaba' && settings.affiliateIds?.alibaba && !finalUrl.includes('aff_id=')) {
      return `${finalUrl}${separator}aff_id=${encodeURIComponent(settings.affiliateIds.alibaba)}`;
    }
    if (product.importedFrom === 'ebay' && settings.affiliateIds?.ebay && !finalUrl.includes('campid=')) {
      return `${finalUrl}${separator}campid=${encodeURIComponent(settings.affiliateIds.ebay)}`;
    }
    if (product.importedFrom === 'cjdropshipping' && settings.affiliateIds?.cjdropshipping && !finalUrl.includes('partner=')) {
      return `${finalUrl}${separator}partner=${encodeURIComponent(settings.affiliateIds.cjdropshipping)}`;
    }
    return finalUrl;
  };

  const getPartnerButtonLabel = (_platform?: string): string => {
    if (language === 'si') {
      return 'මිලදී ගන්න (Buy Now)';
    }
    return 'Buy Now';
  };

  // Direct 1-Click Buy Now (Skips directly to Checkout for store products, or opens affiliate URL)
  const handleDirectBuyNow = (product: Product) => {
    if (product.fulfillmentType === 'affiliate') {
      window.open(getAffiliateBuyUrl(product), '_blank');
      return;
    }
    handleAddToCart(product, product.variants?.size?.[0], product.variants?.color?.[0], 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !reviewAuthor || !reviewComment) return;

    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor,
      rating: reviewRating,
      date: 'Just now',
      comment: reviewComment,
      photoUrl: reviewPhotoUrl || undefined,
      verifiedPurchase: true
    };

    onAddReview(selectedProduct.id, newReview);
    setSelectedProduct({
      ...selectedProduct,
      reviewCount: selectedProduct.reviewCount + 1,
      reviews: [newReview, ...(selectedProduct.reviews || [])]
    });

    setReviewAuthor('');
    setReviewComment('');
    setReviewPhotoUrl('');
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 md:pb-16">
      {/* 1. Announcement Bar */}
      {theme.showAnnouncement && theme.announcementBar && (
        <div 
          style={{ backgroundColor: theme.primaryColor || '#1e293b' }}
          className="text-white text-xs sm:text-sm py-2 px-3 text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs relative group"
        >
          <span>{theme.announcementBar}</span>
          {!isPublicBuyer && (
            <button
              type="button"
              onClick={() => {
                setQuickEditTab('announcement');
                setIsQuickEditOpen(true);
              }}
              className="sm:absolute sm:right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-[10px] font-bold text-white transition cursor-pointer"
              title={language === 'si' ? 'උඩ වාක්‍යය (නිවේදනය) වෙනස් කරන්න' : 'Edit Announcement'}
            >
              <Pencil className="w-2.5 h-2.5" />
              <span>{language === 'si' ? 'වාක්‍ය වෙනස් කරන්න' : 'Edit Notice'}</span>
            </button>
          )}
        </div>
      )}

      {/* 2. Mobile-Optimized Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo & Store Name (TrendWave LK Brand) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {settings.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.storeName} 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover shadow-sm border border-slate-200 cursor-pointer" 
                onClick={() => {
                  if (!isPublicBuyer) {
                    setQuickEditTab('store');
                    setIsQuickEditOpen(true);
                  }
                }}
              />
            ) : (
              <div 
                className="cursor-pointer"
                onClick={() => {
                  if (!isPublicBuyer) {
                    setQuickEditTab('store');
                    setIsQuickEditOpen(true);
                  }
                }}
              >
                <StoreWaveLogo size="sm" variant="icon" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-2xl font-black tracking-tight text-slate-900 truncate">
                  {settings.storeName}
                </h1>
                <span className="px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-2xs">
                  LK
                </span>
                {!isPublicBuyer && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuickEditTab('store');
                      setIsQuickEditOpen(true);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                    title={language === 'si' ? 'කඩේ නම සහ Logo එක වෙනස් කරන්න' : 'Edit Store Name & Logo'}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:block truncate font-medium">{settings.tagline}</span>
            </div>
          </div>

          {/* Desktop Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm mx-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white pl-10 pr-4 py-2 rounded-full text-xs sm:text-sm border border-transparent focus:border-slate-300 focus:outline-none transition-all"
            />
          </div>

          {/* Right Action: Language + Currency + Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Language Dropdown */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
                className="bg-slate-100 text-slate-800 text-[11px] sm:text-xs font-bold pl-6 pr-2 sm:pr-3 py-1.5 rounded-full border border-slate-200 focus:outline-none cursor-pointer appearance-none"
                title={t.language}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
              className="bg-slate-100 text-slate-800 text-[11px] sm:text-xs font-black px-2 sm:px-3 py-1.5 rounded-full border border-slate-200 focus:outline-none cursor-pointer"
              title={t.currency}
            >
              <option value="LKR">LKR (Rs.)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all font-semibold text-xs sm:text-sm shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t.cart}</span>
              {cartItemCount > 0 && (
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] sm:text-xs font-black flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-3 pb-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 pl-8 pr-3 py-1.5 rounded-full text-xs border border-transparent focus:border-slate-300 focus:outline-none"
            />
          </div>
        </div>
      </header>

      {/* 3. Hero Banner (Mobile Optimized) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg min-h-[260px] sm:min-h-[380px] flex items-center text-white group">
          <img 
            src={theme.bannerImage} 
            alt="Hero Banner" 
            className="absolute inset-0 w-full h-full object-cover object-center brightness-50"
          />

          {/* Quick Edit Banner Button for Store Owner */}
          {!isPublicBuyer && (
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20">
              <button
                type="button"
                onClick={() => {
                  setQuickEditTab('banner');
                  setIsQuickEditOpen(true);
                }}
                className="bg-slate-950/80 hover:bg-slate-950 text-white border border-white/25 hover:border-emerald-400 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold transition backdrop-blur-md cursor-pointer group/btn"
                title={language === 'si' ? 'බැනරයේ මාතෘකා සහ පින්තූරය වෙනස් කරන්න' : 'Edit Banner Heading & Image'}
              >
                <Palette className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:rotate-12 transition-transform" />
                <span>{language === 'si' ? '✏️ බැනරය සහ වාක්‍ය වෙනස් කරන්න' : '✏️ Edit Banner & Texts'}</span>
              </button>
            </div>
          )}
          <div className="relative z-10 p-5 sm:p-12 max-w-2xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Sparkles className="w-3 h-3" />
              {t.officialPartner}
            </div>
            <h2 className="text-2xl sm:text-5xl font-black tracking-tight leading-tight">
              {theme.bannerText}
            </h2>
            <p className="text-slate-200 text-xs sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-none">
              {theme.bannerSubtext}
            </p>
            <div className="pt-1 flex flex-wrap gap-2.5">
              <a 
                href="#products-section" 
                className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition shadow-md text-xs sm:text-sm cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>{t.exploreProducts}</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Trust Badges (Compact on mobile) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs text-slate-700">
          <div className="flex items-center gap-2 p-1.5">
            <Truck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate">{t.islandwideDelivery}</div>
              <div className="text-[10px] text-slate-500 truncate">{t.islandwideSub}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5">
            <MessageCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate">{t.oneClickWhatsApp}</div>
              <div className="text-[10px] text-slate-500 truncate">{t.oneClickWhatsAppSub}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5">
            <Upload className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate">{t.bankSlipUpload}</div>
              <div className="text-[10px] text-slate-500 truncate">{t.bankSlipSub}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate">{t.digitalDownloads}</div>
              <div className="text-[10px] text-slate-500 truncate">{t.digitalDownloadsSub}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Products Section */}
      <section id="products-section" className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4 sm:space-y-6">
        {/* Category Pills & Count */}
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'All' ? t.all : cat}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {t.showingItems} {filteredProducts.length}
          </span>
        </div>

        {/* Product Grid (Responsive: 1 col on mobile, 2 col on tablet, 3-4 on desktop) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 my-6 shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                {language === 'si' ? 'වෙළඳසැලේ භාණ්ඩ තවම නොමැත' : 'Your Store Catalog is Empty'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {language === 'si'
                  ? 'ඔබ ආරම්භ කර ඇත්තේ හිස් පිටුවකිනි (Blank Store Canvas). Dashboard වෙත ගොස් Daraz, Amazon Affiliate හෝ ඔබේම නිෂ්පාදන එකතු කර සජීවීව අලෙවිය ආරම්භ කරන්න!'
                  : 'You have started with a clean blank canvas! Head to your Merchant Dashboard to import Daraz/Amazon affiliate items or upload your own products.'}
              </p>
            </div>
            {isOwnerMode && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const event = new CustomEvent('open-add-product-or-dashboard');
                    window.dispatchEvent(event);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'si' ? 'භාණ්ඩ එකතු කිරීමට Dashboard යන්න' : 'Go to Dashboard & Add Products'}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(product => {
            const discountPercent = product.compareAtPrice 
              ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
              : 0;

            const isPartnerImported = !!product.importedFrom;

            return (
              <div 
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {product.videoUrl && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Video</span>
                        </span>
                      )}
                      {product.importedFrom && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                          <ExternalLink className="w-2.5 h-2.5" />
                          {product.importedFrom}
                        </span>
                      )}
                      {product.isDigital && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                          ⚡ {t.instantDigital}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold shadow-xs">
                          -{discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Direct Delete from Store button (Only visible if store owner mode is enabled) */}
                    {isOwnerMode && onDeleteProduct && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToDelete(product);
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition shadow-sm backdrop-blur-xs cursor-pointer z-10"
                        title={language === 'si' ? 'මෙම භාණ්ඩය කඩයෙන් ඉවත් කරන්න' : 'Delete product from store'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Quick View Button */}
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedImageIndex(0);
                        setActiveMediaTab('photo');
                        setSelectedSize(product.variants?.size?.[0] || '');
                        setSelectedColor(product.variants?.color?.[0] || '');
                        setSelectedQuantity(1);
                      }}
                      className="absolute inset-x-3 bottom-3 py-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> {t.quickView}
                    </button>
                  </div>

                  {/* Product Content */}
                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{product.category}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400">({product.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {product.title}
                    </h3>

                    {/* Price converted */}
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {formatPrice(product.price, currency)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatPrice(product.compareAtPrice, currency)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions: Clean Buy Now Button & Cart/WhatsApp */}
                <div className="p-3.5 pt-0 space-y-1.5">
                  {/* Clean Buy Button: Direct to Affiliate link or Direct to Store Checkout */}
                  {product.fulfillmentType === 'affiliate' ? (
                    <a
                      href={getAffiliateBuyUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs text-center"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{language === 'si' ? 'මිලදී ගන්න (Buy Now)' : 'Buy Now'}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDirectBuyNow(product)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs text-center"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{language === 'si' ? 'මිලදී ගන්න (Buy Now)' : 'Buy Now'}</span>
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleAddToCart(product, product.variants?.size?.[0], product.variants?.color?.[0], 1)}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> {t.cartButton}
                    </button>
                    <button
                      onClick={() => handleDirectWhatsAppOrder(product)}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      title="Order via WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3" /> {t.whatsAppButton}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* 6. Product Quick View & Reviews Modal (Mobile Touch Friendly) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
              {/* Product Gallery & Video Viewer (Daraz-style interactive carousel) */}
              <div className="space-y-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group flex items-center justify-center">
                  {activeMediaTab === 'video' && selectedProduct.videoUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <video 
                        src={selectedProduct.videoUrl} 
                        controls 
                        autoPlay 
                        loop 
                        playsInline 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-3 left-3 bg-rose-600/90 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>{language === 'si' ? 'වීඩියෝ දසුන' : 'Live Video'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <img 
                        src={selectedProduct.images[selectedImageIndex] || selectedProduct.images[0]} 
                        alt={selectedProduct.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Counter Badge */}
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <span>{selectedImageIndex + 1} / {selectedProduct.images.length}</span>
                      </div>

                      {/* Video Quick Switch Badge */}
                      {selectedProduct.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setActiveMediaTab('video')}
                          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-slate-950/90 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-md shadow-xl transition cursor-pointer border border-white/20"
                        >
                          <Play className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          <span>{language === 'si' ? 'වීඩියෝව බලන්න' : 'Watch Video'}</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Navigation Arrows (Daraz Carousel Prev / Next) */}
                  {(selectedProduct.images.length > 1 || selectedProduct.videoUrl) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (activeMediaTab === 'video') {
                            setActiveMediaTab('photo');
                            setSelectedImageIndex(selectedProduct.images.length - 1);
                          } else if (selectedImageIndex > 0) {
                            setSelectedImageIndex(selectedImageIndex - 1);
                          } else {
                            if (selectedProduct.videoUrl) {
                              setActiveMediaTab('video');
                            } else {
                              setSelectedImageIndex(selectedProduct.images.length - 1);
                            }
                          }
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition opacity-80 group-hover:opacity-100 cursor-pointer"
                        title="Previous"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (activeMediaTab === 'photo') {
                            if (selectedImageIndex < selectedProduct.images.length - 1) {
                              setSelectedImageIndex(selectedImageIndex + 1);
                            } else if (selectedProduct.videoUrl) {
                              setActiveMediaTab('video');
                            } else {
                              setSelectedImageIndex(0);
                            }
                          } else {
                            setActiveMediaTab('photo');
                            setSelectedImageIndex(0);
                          }
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition opacity-80 group-hover:opacity-100 cursor-pointer"
                        title="Next"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails Filmstrip (Photos + Video together) */}
                <div className="flex gap-2 flex-wrap items-center pt-0.5">
                  {selectedProduct.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedImageIndex(i);
                        setActiveMediaTab('photo');
                      }}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer bg-slate-100 ${
                        activeMediaTab === 'photo' && selectedImageIndex === i 
                          ? 'border-indigo-600 ring-2 ring-indigo-600/40 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt={`thumbnail ${i}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[8px] font-bold text-center py-0.2">
                          Cover
                        </span>
                      )}
                    </button>
                  ))}

                  {/* Video Thumbnail Button */}
                  {selectedProduct.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('video')}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer bg-slate-950 text-white flex flex-col items-center justify-center relative ${
                        activeMediaTab === 'video'
                          ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-xs' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                      title={language === 'si' ? 'භාණ්ඩයේ වීඩියෝව බලන්න' : 'Watch product video'}
                    >
                      <Play className="w-5 h-5 fill-rose-500 text-rose-500" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-rose-400 mt-0.5">Video</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {selectedProduct.category}
                    </span>
                    {selectedProduct.videoUrl && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>{language === 'si' ? 'වීඩියෝ සහිතයි' : 'Video Included'}</span>
                      </span>
                    )}
                    {selectedProduct.importedFrom && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {t.importedFrom} {selectedProduct.importedFrom.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                    {selectedProduct.title}
                  </h2>

                  {/* Video Trigger button in header */}
                  {selectedProduct.videoUrl && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('video')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer shadow-2xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                        <span>{language === 'si' ? '▶ වීඩියෝව නරඹන්න' : '▶ Watch Video'}</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      {formatPrice(selectedProduct.price, currency)}
                    </span>
                    {selectedProduct.compareAtPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(selectedProduct.compareAtPrice, currency)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedProduct.description}
                </p>

                {/* Variants: Size */}
                {selectedProduct.variants?.size && selectedProduct.variants.size.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">{t.selectSize}</label>
                    <div className="flex gap-2">
                      {selectedProduct.variants.size.map(sz => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            selectedSize === sz 
                              ? 'bg-slate-900 text-white border-slate-900' 
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variants: Color */}
                {selectedProduct.variants?.color && selectedProduct.variants.color.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">{t.selectColor}</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.variants.color.map(col => (
                        <button
                          key={col}
                          onClick={() => setSelectedColor(col)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            selectedColor === col 
                              ? 'bg-slate-900 text-white border-slate-900 font-bold' 
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-3 pt-1">
                  <label className="text-xs font-bold text-slate-800">{t.quantity}</label>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button 
                      onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                      className="px-3 py-1.5 hover:bg-slate-200 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold">{selectedQuantity}</span>
                    <button 
                      onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                      className="px-3 py-1.5 hover:bg-slate-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons: Clean Buy Now vs Direct Store order */}
                <div className="space-y-2 pt-3">
                  {selectedProduct.fulfillmentType === 'affiliate' ? (
                    <a
                      href={getAffiliateBuyUrl(selectedProduct)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm text-center"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{language === 'si' ? 'මිලදී ගන්න (Buy Now)' : 'Buy Now'}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        handleDirectBuyNow(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm text-center"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{language === 'si' ? 'දැන්ම මිලදී ගන්න (Buy Now)' : 'Buy Now'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleAddToCart(selectedProduct, selectedSize, selectedColor, selectedQuantity)}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> {t.addToCart}
                  </button>
                  <button
                    onClick={() => handleDirectWhatsAppOrder(selectedProduct)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" /> {t.orderWhatsAppDirect}
                  </button>

                  {/* Storefront Direct Delete from Modal (Only visible if store owner mode is enabled) */}
                  {isOwnerMode && onDeleteProduct && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {language === 'si' ? 'වෙළඳසැල් පාලනය:' : 'Store Management:'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(selectedProduct)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>{language === 'si' ? 'මෙම භාණ්ඩය කඩයෙන් ඉවත් කරන්න' : 'Delete from Store'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Photo Reviews Section */}
            <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                    <span>{t.customerReviews}</span>
                    <span className="text-amber-500 font-bold text-sm">({selectedProduct.rating} ★)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedProduct.reviewCount} {t.reviewsCount}</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  {t.writeReview}
                </button>
              </div>

              {/* Review Form Drawer */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>
                  <textarea 
                    rows={2}
                    placeholder="Write your review..." 
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Attach Photo URL (optional)" 
                    value={reviewPhotoUrl}
                    onChange={(e) => setReviewPhotoUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                  selectedProduct.reviews.map(rev => (
                    <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{rev.author}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">Verified</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400 text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-700">{rev.comment}</p>
                      {rev.photoUrl && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 mt-1.5">
                          <img src={rev.photoUrl} alt="review" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-5 sm:p-6 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 font-black text-base sm:text-lg text-slate-900">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <span>{t.yourCart} ({cartItemCount})</span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-slate-600 font-medium text-xs sm:text-sm">{t.cartEmpty}</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                  >
                    {t.continueShopping}
                  </button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 items-center">
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{item.title}</h4>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-[10px] text-slate-500">
                          {item.selectedSize ? `${item.selectedSize} ` : ''}
                          {item.selectedColor ? `${item.selectedColor}` : ''}
                        </p>
                      )}
                      <div className="text-xs font-black text-slate-900 mt-0.5">
                        {formatPrice(item.price * item.quantity, currency)}
                      </div>
                    </div>
                    {/* Quantity modifier */}
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                      <button 
                        onClick={() => updateCartQuantity(index, -1)}
                        className="p-1 hover:bg-slate-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(index, 1)}
                        className="p-1 hover:bg-slate-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-slate-200 pt-3 space-y-2.5">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-500">{t.subtotal}</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartSubtotal, currency)}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {t.taxesShippingCalc}
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {t.proceedCheckout} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. 1-Page Express Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600">1-Page Checkout</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{t.checkoutTitle}</h2>
              </div>

              <form onSubmit={handleCompleteCheckout} className="space-y-4 sm:space-y-6">
                {/* 1. Customer Details */}
                <div className="space-y-2.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t.customerDetails}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input 
                      type="text" 
                      placeholder={t.fullName} 
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-slate-900 focus:outline-none"
                    />
                    <input 
                      type="tel" 
                      placeholder={t.phoneWhatsApp} 
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder={t.emailOptional} 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-slate-900 focus:outline-none"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <input 
                        type="text" 
                        placeholder={t.streetAddress} 
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <select 
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:border-slate-900 focus:outline-none font-medium cursor-pointer"
                      >
                        <option value="Colombo">Colombo ({formatPrice(settings.shippingRules.colomboRate, currency)})</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Kalutara">Kalutara</option>
                        <option value="Kandy">Kandy</option>
                        <option value="Galle">Galle</option>
                        <option value="Matara">Matara</option>
                        <option value="Kurunegala">Kurunegala</option>
                        <option value="Outstation">Outstation ({formatPrice(settings.shippingRules.outstationRate, currency)})</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method selection */}
                <div className="space-y-2.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t.paymentMethod}
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_slip')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-left flex flex-col justify-between cursor-pointer ${
                        paymentMethod === 'bank_slip' 
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/20' 
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 mb-1 text-indigo-600" />
                      <span>{t.bankSlip}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('whatsapp')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-left flex flex-col justify-between cursor-pointer ${
                        paymentMethod === 'whatsapp' 
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-600/20' 
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 mb-1 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      disabled={isCodDisabled}
                      onClick={() => {
                        if (!isCodDisabled) setPaymentMethod('cod');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-left flex flex-col justify-between ${
                        isCodDisabled 
                          ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : paymentMethod === 'cod' 
                            ? 'border-slate-900 bg-slate-100 text-slate-900 ring-2 ring-slate-900/20 cursor-pointer' 
                            : 'border-slate-200 bg-white text-slate-700 cursor-pointer'
                      }`}
                      title={isCodDisabled ? (language === 'si' ? 'මෙම භාණ්ඩය සඳහා COD අක්‍රියයි (Prepaid Only)' : 'COD unavailable for this item') : t.cod}
                    >
                      <Truck className="w-3.5 h-3.5 mb-1 text-slate-900" />
                      <div className="flex items-center justify-between w-full">
                        <span>{t.cod}</span>
                        {isCodDisabled && (
                          <span className="text-[9px] text-rose-600 font-black bg-rose-50 px-1 py-0.5 rounded">
                            {language === 'si' ? 'අක්‍රියයි' : 'Blocked'}
                          </span>
                        )}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('koko')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-left flex flex-col justify-between cursor-pointer ${
                        paymentMethod === 'koko' 
                          ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-600/20' 
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 mb-1 text-purple-600" />
                      <span>{t.kokoPay}</span>
                    </button>
                  </div>

                  {/* COD Restriction Explanation Notice */}
                  {isCodDisabled && (
                    <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-black text-amber-900 block">
                          {language === 'si' 
                            ? '🚫 මෙම භාණ්ඩය සඳහා භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම (COD) අක්‍රියයි' 
                            : '🚫 Cash on Delivery (COD) Unavailable for this item (Prepaid Only)'}
                        </span>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          {language === 'si'
                            ? 'මෙම භාණ්ඩය කෙළින්ම ඔබේ ලිපිනයටම සුරක්ෂිතව එවීමට කලින් මුදල් ගෙවීම (Prepaid) අවශ්‍ය වේ. කරුණාකර Bank Slip එක Upload කරන්න හෝ WhatsApp මඟින් සම්බන්ධ වන්න.'
                            : 'This item requires upfront prepaid payment for direct door-to-door delivery. Please select Bank Slip or WhatsApp payment.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bank Slip Info Box */}
                  {paymentMethod === 'bank_slip' && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs">
                      <div className="font-bold text-indigo-950">
                        Official Bank Transfer Account:
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 text-slate-800 space-y-0.5 text-[11px]">
                        <div><strong>Bank:</strong> {settings.bankDetails.bankName}</div>
                        <div><strong>Account No:</strong> <span className="font-mono font-bold text-indigo-600">{settings.bankDetails.accountNumber}</span></div>
                        <div><strong>Account Name:</strong> {settings.bankDetails.accountHolder}</div>
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 block text-[11px]">Attach Deposit Slip URL:</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter image URL" 
                            value={bankSlipUrl}
                            onChange={(e) => setBankSlipUrl(e.target.value)}
                            className="flex-1 p-2 rounded-lg border border-slate-300 text-xs bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setBankSlipUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80')}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] cursor-pointer"
                          >
                            Demo Slip
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Coupon Code */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={t.couponCodePlaceholder} 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                  >
                    {t.apply}
                  </button>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{t.subtotal}</span>
                    <span>{formatPrice(cartSubtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.deliveryFee} ({selectedDistrict}):</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-600">{t.freeShipping}</strong> : formatPrice(shippingFee, currency)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>{t.discount}</span>
                      <span>- {formatPrice(discountAmount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                    <span>{t.totalToPay}</span>
                    <span>{formatPrice(totalAmount, currency)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" /> {t.confirmOrder} ({formatPrice(totalAmount, currency)})
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 9. Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Order Placed Successfully! 🎉</h3>
              <p className="text-xs text-slate-500">Order ID: <strong className="text-slate-900">{orderSuccess.orderNumber}</strong></p>
              <p className="text-xs text-slate-600">
                Thank you <strong>{orderSuccess.customerName}</strong>! Your order details have been received.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  setIsCheckoutOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal: Delete Product from Store */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 space-y-4 shadow-2xl relative text-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                {language === 'si' ? 'භාණ්ඩය කඩයෙන් ඉවත් කරන්නද?' : 'Delete Product from Store?'}
              </h3>
              <p className="text-slate-600 text-xs font-semibold line-clamp-2">
                "{productToDelete.title}"
              </p>
              <p className="text-[11px] text-rose-600 font-bold pt-1">
                {language === 'si' 
                  ? 'මෙම භාණ්ඩය ඔබගේ Storefront එකෙන් ස්ථිරවම ඉවත් වනු ඇත.' 
                  : 'This product will be permanently deleted from your store.'}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onDeleteProduct) onDeleteProduct(productToDelete.id);
                  if (selectedProduct?.id === productToDelete.id) {
                    setSelectedProduct(null);
                  }
                  const deletedTitle = productToDelete.title;
                  setProductToDelete(null);
                  setDeletedSuccessToast(deletedTitle);
                  setTimeout(() => setDeletedSuccessToast(null), 3000);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer shadow-xs transition"
              >
                {language === 'si' ? 'ඔව්, ඉවත් කරන්න' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-50 transition"
              >
                {language === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {deletedSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-slate-800 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            {language === 'si' 
              ? `"${deletedSuccessToast}" කඩයෙන් ඉවත් කරන ලදී!` 
              : `"${deletedSuccessToast}" deleted from store!`}
          </span>
        </div>
      )}
      {/* Quick Header & Banner Customizer Modal for Store Owner */}
      {isQuickEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl relative text-xs max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setIsQuickEditOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-1">
                <Palette className="w-3 h-3 text-emerald-600" />
                <span>{language === 'si' ? 'සජීවීව වෙනස් කරන්න (Live Store Editor)' : 'Live Storefront Editor'}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {language === 'si' ? 'උඩින් පෙනෙන වාක්‍ය සහ බැනරය වෙනස් කරන්න' : 'Edit Header, Banners & Store Texts'}
              </h3>
              <p className="text-slate-500 text-[11px]">
                {language === 'si' 
                  ? 'පාරිභෝගිකයින් දකින උඩ නිවේදනය, ප්‍රධාන මාතෘකාව, විස්තරය සහ කඩේ නම මෙතැනින් ලයිව් වෙනස් කරන්න.' 
                  : 'Customize the top announcement bar, store name, hero banner heading and background image.'}
              </p>
            </div>

            {/* Success Alert */}
            {saveSuccessMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{language === 'si' ? 'වෙනස්කම් සාර්ථකව සුරැකිණි! ✅' : 'Changes saved successfully! ✅'}</span>
              </div>
            )}

            {/* Tab Selector */}
            <div className="flex border-b border-slate-200 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setQuickEditTab('banner')}
                className={`pb-2 px-2 transition cursor-pointer flex items-center gap-1.5 ${
                  quickEditTab === 'banner'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🌅 {language === 'si' ? 'ප්‍රධාන බැනරය' : 'Hero Banner'}</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickEditTab('store')}
                className={`pb-2 px-2 transition cursor-pointer flex items-center gap-1.5 ${
                  quickEditTab === 'store'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🏪 {language === 'si' ? 'කඩේ නම & Logo' : 'Store Name & Logo'}</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickEditTab('announcement')}
                className={`pb-2 px-2 transition cursor-pointer flex items-center gap-1.5 ${
                  quickEditTab === 'announcement'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>📢 {language === 'si' ? 'උඩ නිවේදනය' : 'Top Notice'}</span>
              </button>
            </div>

            {/* Tab 1: Hero Banner */}
            {quickEditTab === 'banner' && (
              <div className="space-y-3.5 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'ප්‍රධාන බැනර් මාතෘකාව (Heading):' : 'Banner Heading:'}
                  </label>
                  <input 
                    type="text" 
                    value={editBannerText}
                    onChange={(e) => setEditBannerText(e.target.value)}
                    placeholder="e.g. TrendWave LK — Sri Lanka's #1 Trending Finds"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'බැනර් උප මාතෘකාව (Subtitle):' : 'Banner Subtitle / Description:'}
                  </label>
                  <textarea 
                    rows={2}
                    value={editBannerSubtext}
                    onChange={(e) => setEditBannerSubtext(e.target.value)}
                    placeholder="e.g. Discover viral gadgets, tech essentials & lifestyle products with cash on delivery."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'බැනර් පින්තූරයේ Link එක (Banner Image URL):' : 'Banner Image URL:'}
                  </label>
                  <input 
                    type="text" 
                    value={editBannerImage}
                    onChange={(e) => setEditBannerImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Preset Banner Quick Chooser */}
                <div className="space-y-1 pt-1">
                  <span className="font-bold text-slate-700 text-[11px] block">
                    {language === 'si' ? 'නැතහොත් ලස්සන Preset Background එකක් තෝරන්න:' : 'Or pick a popular preset background:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        name: 'Tech & Gadgets',
                        url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1600&q=80'
                      },
                      {
                        name: 'Minimalist Store',
                        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80'
                      },
                      {
                        name: 'Viral TikTok Finds',
                        url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&q=80'
                      },
                      {
                        name: 'Luxury Lifestyle',
                        url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1600&q=80'
                      }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditBannerImage(preset.url)}
                        className={`group relative rounded-xl overflow-hidden border-2 text-left transition cursor-pointer h-16 ${
                          editBannerImage === preset.url ? 'border-emerald-500 ring-2 ring-emerald-400' : 'border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover brightness-60 group-hover:scale-105 transition-transform" />
                        <span className="absolute inset-0 flex items-center justify-center p-1 text-[10px] font-bold text-white text-center leading-tight drop-shadow-md">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Store Identity */}
            {quickEditTab === 'store' && (
              <div className="space-y-3.5 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'කඩේ නම (Store Name):' : 'Store Name:'}
                  </label>
                  <input 
                    type="text" 
                    value={editStoreName}
                    onChange={(e) => setEditStoreName(e.target.value)}
                    placeholder="e.g. TrendWave LK"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'කඩේ යටින් වැටෙන කෙටි විස්තරය (Tagline):' : 'Store Tagline:'}
                  </label>
                  <input 
                    type="text" 
                    value={editTagline}
                    onChange={(e) => setEditTagline(e.target.value)}
                    placeholder="e.g. Viral TikTok Finds & Smart Gadgets"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'ඔබගේ Custom Logo Link එක (Logo Image URL):' : 'Custom Logo Image URL (Optional):'}
                  </label>
                  <input 
                    type="text" 
                    value={editLogoUrl}
                    onChange={(e) => setEditLogoUrl(e.target.value)}
                    placeholder="https://.../my-store-logo.png"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    {language === 'si' 
                      ? 'හිස්ව තැබුවහොත් StoreWave LK නිල සංකේතය ස්වයංක්‍රීයව පෙන්වනු ඇත.' 
                      : 'Leave blank to use the official StoreWave LK logo symbol.'}
                  </span>
                </div>
              </div>
            )}

            {/* Tab 3: Announcement Bar */}
            {quickEditTab === 'announcement' && (
              <div className="space-y-3.5 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={editShowAnnouncement}
                    onChange={(e) => setEditShowAnnouncement(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-800 block">
                      {language === 'si' ? 'උඩින් පෙනෙන නිවේදනය පෙන්වන්න (Show Top Announcement Bar)' : 'Show Top Announcement Bar'}
                    </span>
                    <span className="text-slate-500 block text-[10px]">
                      {language === 'si' ? 'වෙබ් එකේ උඩින්ම පාරිභෝගිකයින්ට පෙනෙන විශේෂ පණිවිඩය' : 'Banner shown at the very top of the store'}
                    </span>
                  </div>
                </label>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'නිවේදන වාක්‍යය (Announcement Text):' : 'Announcement Text:'}
                  </label>
                  <input 
                    type="text" 
                    value={editAnnouncement}
                    onChange={(e) => setEditAnnouncement(e.target.value)}
                    placeholder="🔥 දිවයින පුරා නොමිලේ බෙදාහැරීම • Cash on Delivery Available"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-500 focus:outline-none font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'උඩ තීරුවේ වර්ණය (Bar Color):' : 'Bar Background Color:'}
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { name: 'Dark Slate', hex: '#0f172a' },
                      { name: 'Indigo', hex: '#4338ca' },
                      { name: 'Emerald', hex: '#047857' },
                      { name: 'Ruby', hex: '#b91c1c' },
                      { name: 'Purple', hex: '#6d28d9' }
                    ].map(col => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setEditPrimaryColor(col.hex)}
                        style={{ backgroundColor: col.hex }}
                        className={`w-8 h-8 rounded-full border-2 transition cursor-pointer shadow-xs ${
                          editPrimaryColor === col.hex ? 'border-white ring-2 ring-indigo-500 scale-110' : 'border-transparent'
                        }`}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleSaveQuickCustomization}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{language === 'si' ? '💾 වෙනස්කම් සුරකින්න (Save Changes)' : '💾 Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsQuickEditOpen(false)}
                className="py-3 px-5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                {language === 'si' ? 'වසන්න' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
