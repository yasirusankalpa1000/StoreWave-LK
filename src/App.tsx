/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  ShoppingBag, 
  Sparkles, 
  Globe, 
  PlusCircle, 
  LayoutDashboard, 
  CheckCircle2, 
  X,
  CreditCard,
  LogOut,
  LogIn,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Share2
} from 'lucide-react';

import { Product, Order, StoreTheme, StoreSettings, TenantStore, CurrencyCode, ProductReview, MerchantUser } from './types/store';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_SETTINGS, 
  INITIAL_THEME, 
  INITIAL_TENANT_STORES 
} from './data/mockData';
import { SupportedLanguage, LANGUAGES, getT } from './utils/i18n';
import { 
  getStoreFromCloud, 
  getStoreByEmailFromCloud, 
  saveStoreToCloud, 
  saveOrderToCloud, 
  sanitizeDocId 
} from './utils/firebase';

import { Storefront } from './components/Storefront';
import { SaaSPricing } from './components/SaaSPricing';
import { MerchantDashboard } from './components/MerchantDashboard';
import { StoreWaveLogo } from './components/StoreWaveLogo';

export type AppMode = 'storefront' | 'pricing' | 'merchant';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('storefront');

  // Multi-Language: English ('en') default on load
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('nextgen_language');
      return (saved as SupportedLanguage) || 'en';
    } catch (e) {
      return 'en';
    }
  });

  // Currency: LKR default
  const [currency, setCurrency] = useState<CurrencyCode>('LKR');

  // Persistent Application State via localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('nextgen_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nextgen_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  const [theme, setTheme] = useState<StoreTheme>(() => {
    try {
      const saved = localStorage.getItem('nextgen_theme');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.bannerText?.includes('Minimalist Essentials')) {
          return INITIAL_THEME;
        }
        return parsed;
      }
      return INITIAL_THEME;
    } catch (e) {
      return INITIAL_THEME;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('nextgen_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.storeName === 'AURA Studios' || !parsed.storeName) {
          parsed.storeName = 'TrendWave LK';
          parsed.tagline = 'Viral TikTok Finds, Smart Gadgets & Trending Essentials';
        }
        return parsed;
      }
    } catch (e) {}
    return {
      ...INITIAL_SETTINGS,
      affiliateIds: {
        daraz: 'SL_AFF_MASTER_99',
        amazon: 'nextgenstore-20',
        aliexpress: 'alitrack_88',
        temu: 'aff_temu_lk',
        alibaba: 'ali_drop_12',
        ebay: 'epn_lk_55',
        cjdropshipping: 'cj_partner_77'
      }
    };
  });

  const [tenants, setTenants] = useState<TenantStore[]>(() => {
    try {
      const saved = localStorage.getItem('nextgen_tenants');
      return saved ? JSON.parse(saved) : INITIAL_TENANT_STORES;
    } catch (e) {
      return INITIAL_TENANT_STORES;
    }
  });

  // Owner Mode vs Customer View (By default false: customers only see public store with no edit/delete capability)
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(false);

  // Merchant Authentication / Logged In User state
  const [loggedInUser, setLoggedInUser] = useState<MerchantUser | null>(() => {
    try {
      const saved = localStorage.getItem('nextgen_logged_in_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Public visitors start unauthenticated (pure customer view)
    return null;
  });

  // Public Buyer Mode vs Full Merchant Navigation
  const [isPublicBuyerView, setIsPublicBuyerView] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return !!params.get('store') || params.get('view') === 'buyer' || !!params.get('pack') || !!params.get('product');
    } catch (e) {
      return false;
    }
  });
  const [isPreviewingCustomerView, setIsPreviewingCustomerView] = useState<boolean>(false);
  const [dockLinkCopied, setDockLinkCopied] = useState<boolean>(false);

  // Password & Security State
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginPasswordError, setLoginPasswordError] = useState<string | null>(null);
  const [createPassword, setCreatePassword] = useState<string>('');

  // Logout Confirmation Modal state (User Request: ask "Are you sure you want to log out?")
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState<boolean>(false);

  // Merchant Login Modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginStoreName, setLoginStoreName] = useState<string>('');

  // Blank Canvas option for new store creators
  const [startWithBlankCanvas, setStartWithBlankCanvas] = useState<boolean>(false);

  // Boot: Sync with URL parameter (?store=slug, ?pack=slug, ?product=id) and Cloud Firestore
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const storeParam = params.get('store');
      const viewParam = params.get('view');
      const packParam = params.get('pack');
      const productParam = params.get('product');

      if (storeParam || viewParam === 'buyer' || packParam || productParam) {
        setIsPublicBuyerView(true);
      }

      if (storeParam) {
        getStoreFromCloud(storeParam).then(cloudStore => {
          if (cloudStore) {
            if (cloudStore.settings) setSettings(cloudStore.settings);
            if (cloudStore.theme) setTheme(cloudStore.theme);
            if (cloudStore.products) setProducts(cloudStore.products);
          } else {
            // Local fallback
            const localTenant = tenants.find(t => t.slug === storeParam || t.id === storeParam);
            if (localTenant) {
              const cleanEmail = localTenant.ownerEmail.toLowerCase();
              const savedProds = localStorage.getItem(`nextgen_products_${cleanEmail}`);
              if (savedProds) setProducts(JSON.parse(savedProds));
              const savedSets = localStorage.getItem(`nextgen_settings_${cleanEmail}`);
              if (savedSets) setSettings(JSON.parse(savedSets));
            }
          }
        });
      }
    } catch (e) {
      console.warn('URL parsing error:', e);
    }
  }, []);

  const handleUpdateLanguage = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('nextgen_language', newLang);
    } catch (e) {}
  };

  const handleUpdateProducts = (newProds: Product[]) => {
    setProducts(newProds);
    try {
      localStorage.setItem('nextgen_products', JSON.stringify(newProds));
      if (loggedInUser?.email) {
        localStorage.setItem(`nextgen_products_${loggedInUser.email.toLowerCase()}`, JSON.stringify(newProds));
      }
    } catch (e) {}
  };

  const handleUpdateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('nextgen_orders', JSON.stringify(newOrders));
      if (loggedInUser?.email) {
        localStorage.setItem(`nextgen_orders_${loggedInUser.email.toLowerCase()}`, JSON.stringify(newOrders));
      }
    } catch (e) {}
  };

  const handleUpdateTheme = (newTheme: StoreTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('nextgen_theme', JSON.stringify(newTheme));
      if (loggedInUser?.email) {
        localStorage.setItem(`nextgen_theme_${loggedInUser.email.toLowerCase()}`, JSON.stringify(newTheme));
      }
    } catch (e) {}
  };

  const handleUpdateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('nextgen_settings', JSON.stringify(newSettings));
      if (loggedInUser?.email) {
        localStorage.setItem(`nextgen_settings_${loggedInUser.email.toLowerCase()}`, JSON.stringify(newSettings));
      }
    } catch (e) {}
  };

  // Create Store Modal state for new users/merchants
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [createStoreName, setCreateStoreName] = useState('');
  const [createOwnerName, setCreateOwnerName] = useState('');
  const [createOwnerEmail, setCreateOwnerEmail] = useState('');
  const [createSuccessAlert, setCreateSuccessAlert] = useState(false);

  const t = getT(language);

  // New order placed from storefront
  const handlePlaceOrder = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    handleUpdateOrders(updated);

    // Save order to Cloud Firestore
    const currentSlug = tenants.find(t => t.ownerEmail.toLowerCase() === loggedInUser?.email?.toLowerCase())?.slug 
      || settings.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    saveOrderToCloud(currentSlug, newOrder);
  };

  // Add new review to product
  const handleAddReview = (productId: string, review: ProductReview) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          reviewCount: p.reviewCount + 1,
          reviews: [review, ...(p.reviews || [])]
        };
      }
      return p;
    });
    handleUpdateProducts(updated);
  };

  // Login feedback / alert message
  const [loginAlert, setLoginAlert] = useState<{ type: 'existing' | 'new_blank'; messageSi: string; messageEn: string; storeName: string } | null>(null);

  // Helper to load store data for a specific email
  const loadStoreDataForEmail = (email: string, storeTitle?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existingTenant = tenants.find(t => t.ownerEmail.toLowerCase() === cleanEmail);

    if (existingTenant) {
      // 1. Existing Account: Load that merchant's store, settings, and saved products
      let storeProds: Product[] = INITIAL_PRODUCTS;
      let storeSettings: StoreSettings = {
        ...INITIAL_SETTINGS,
        storeName: existingTenant.name,
        tagline: `${existingTenant.name} • Official Partner Store`
      };

      try {
        const savedProds = localStorage.getItem(`nextgen_products_${cleanEmail}`);
        if (savedProds) {
          storeProds = JSON.parse(savedProds);
        } else {
          // Fallback to general saved products if founder email
          const generalProds = localStorage.getItem('nextgen_products');
          if (generalProds && (cleanEmail === 'yasirusankalpa2026@gmail.com' || cleanEmail.includes('yasiru'))) {
            storeProds = JSON.parse(generalProds);
          }
        }

        const savedSets = localStorage.getItem(`nextgen_settings_${cleanEmail}`);
        if (savedSets) {
          storeSettings = JSON.parse(savedSets);
        }
      } catch (e) {}

      setProducts(storeProds);
      setSettings(storeSettings);

      const user: MerchantUser = {
        email: cleanEmail,
        name: existingTenant.ownerName,
        storeName: existingTenant.name,
        storeId: existingTenant.id
      };
      setLoggedInUser(user);
      try {
        localStorage.setItem('nextgen_logged_in_user', JSON.stringify(user));
        localStorage.setItem('nextgen_products', JSON.stringify(storeProds));
        localStorage.setItem('nextgen_settings', JSON.stringify(storeSettings));
      } catch (e) {}

      return { isNew: false, storeName: existingTenant.name };
    } else {
      // 2. New Account: Create a brand new clean blank store with zero products (Empty Store Canvas)
      const generatedName = storeTitle?.trim() || `${cleanEmail.split('@')[0].toUpperCase()} Boutique`;
      const slug = generatedName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const newTenant: TenantStore = {
        id: `store-${Date.now()}`,
        slug,
        name: generatedName,
        ownerName: cleanEmail.split('@')[0],
        ownerEmail: cleanEmail,
        plan: 'free_trial',
        monthlyFee: 1900,
        status: 'trial',
        productsCount: 0,
        monthlySales: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };

      const updatedTenants = [newTenant, ...tenants];
      setTenants(updatedTenants);
      try {
        localStorage.setItem('nextgen_tenants', JSON.stringify(updatedTenants));
      } catch (e) {}

      const newSettings: StoreSettings = {
        ...settings,
        storeName: generatedName,
        tagline: `${generatedName} • Official Partner Store`
      };
      setSettings(newSettings);

      // Start with completely clean blank store (0 items)
      const emptyProducts: Product[] = [];
      setProducts(emptyProducts);

      const user: MerchantUser = {
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        storeName: generatedName,
        storeId: newTenant.id
      };
      setLoggedInUser(user);
      try {
        localStorage.setItem('nextgen_logged_in_user', JSON.stringify(user));
        localStorage.setItem(`nextgen_products_${cleanEmail}`, JSON.stringify(emptyProducts));
        localStorage.setItem(`nextgen_settings_${cleanEmail}`, JSON.stringify(newSettings));
        localStorage.setItem('nextgen_products', JSON.stringify(emptyProducts));
        localStorage.setItem('nextgen_settings', JSON.stringify(newSettings));
      } catch (e) {}

      return { isNew: true, storeName: generatedName };
    }
  };

  // Create store submission
  const handleRegisterNewStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createStoreName || !createOwnerName) return;

    const cleanEmail = (createOwnerEmail || `${createStoreName.toLowerCase().replace(/[^a-z0-9]/g, '-')}@commerce.lk`).trim().toLowerCase();
    const slug = createStoreName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTenant: TenantStore = {
      id: `store-${Date.now()}`,
      slug,
      name: createStoreName,
      ownerName: createOwnerName,
      ownerEmail: cleanEmail,
      plan: 'free_trial',
      monthlyFee: 1900,
      status: 'trial',
      productsCount: 0,
      monthlySales: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedTenants = [newTenant, ...tenants.filter(t => t.ownerEmail.toLowerCase() !== cleanEmail)];
    setTenants(updatedTenants);
    try {
      localStorage.setItem('nextgen_tenants', JSON.stringify(updatedTenants));
    } catch (e) {}

    const newSettings: StoreSettings = {
      ...settings,
      storeName: createStoreName,
      tagline: `${createStoreName} • Official Partner Store`
    };
    handleUpdateSettings(newSettings);

    const user: MerchantUser = {
      email: cleanEmail,
      name: createOwnerName,
      storeName: createStoreName,
      storeId: newTenant.id
    };
    setLoggedInUser(user);
    try {
      localStorage.setItem('nextgen_logged_in_user', JSON.stringify(user));
      localStorage.setItem(`nextgen_settings_${cleanEmail}`, JSON.stringify(newSettings));
    } catch (e) {}

    // If blank canvas chosen by store creator, start with empty catalog!
    const newProducts = startWithBlankCanvas ? [] : INITIAL_PRODUCTS;
    handleUpdateProducts(newProducts);
    try {
      localStorage.setItem(`nextgen_products_${cleanEmail}`, JSON.stringify(newProducts));
    } catch (e) {}

    // Save merchant password if set
    if (createPassword) {
      try {
        localStorage.setItem(`nextgen_password_${cleanEmail}`, createPassword);
      } catch (e) {}
    }

    setCreateSuccessAlert(true);
    setTimeout(() => {
      setCreateSuccessAlert(false);
      setIsCreateStoreOpen(false);
      setIsOwnerMode(true);
      setCurrentMode('merchant');
    }, 1200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    const cleanEmail = loginEmail.trim().toLowerCase();

    // Check Password Protection for store security
    const storedPassword = localStorage.getItem(`nextgen_password_${cleanEmail}`);
    if (storedPassword) {
      if (!loginPassword || loginPassword !== storedPassword) {
        setLoginPasswordError(
          language === 'si'
            ? 'මුරපදය වැරදියි! ඔබගේ Store එකේ ආරක්ෂාව සඳහා කරුණාකර නිවැරදි මුරපදය ඇතුළත් කරන්න.'
            : 'Incorrect password! Please enter the correct password to verify ownership.'
        );
        return;
      }
    } else if (loginPassword) {
      // First time setting password for this email account
      try {
        localStorage.setItem(`nextgen_password_${cleanEmail}`, loginPassword);
      } catch (e) {}
    }

    setLoginPasswordError(null);
    const result = loadStoreDataForEmail(loginEmail, loginStoreName);

    if (result.isNew) {
      setLoginAlert({
        type: 'new_blank',
        messageSi: `අලුත් ගිණුමක් හඳුනා ගන්නා ලදී! ඔබ සඳහා අලුත්ම හිස් වෙළඳසැලක් (${result.storeName}) සාර්ථකව විවෘත විය.`,
        messageEn: `New merchant recognized! A brand new blank store (${result.storeName}) has been created for you.`,
        storeName: result.storeName
      });
    } else {
      setLoginAlert({
        type: 'existing',
        messageSi: `සාදරයෙන් පිළිගනිමු! ඔබගේ පෙර වෙළඳසැල (${result.storeName}) සහ භාණ්ඩ සියල්ල සාර්ථකව පූරණය විය.`,
        messageEn: `Welcome back! Your existing store (${result.storeName}) and all saved products have been restored.`,
        storeName: result.storeName
      });
    }

    setTimeout(() => {
      setLoginAlert(null);
      setIsOwnerMode(true);
      setIsLoginModalOpen(false);
      setCurrentMode('merchant');
    }, 1400);
  };

  // Current store slug for public sharing and cloud storage
  const currentStoreSlug = tenants.find(t => t.ownerEmail.toLowerCase() === loggedInUser?.email?.toLowerCase())?.slug 
    || settings.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  // If in Pure Public Customer View (TikTok / Reels / Buyer mode)
  if (isPublicBuyerView) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        {/* Customer Only Storefront: Clean, professional, zero admin buttons, only products + buy */}
        <Storefront
          products={products}
          theme={theme}
          settings={settings}
          currency={currency}
          language={language}
          onChangeCurrency={setCurrency}
          onChangeLanguage={handleUpdateLanguage}
          onPlaceOrder={handlePlaceOrder}
          onNavigatePricing={() => {}}
          onAddReview={handleAddReview}
          isOwnerMode={false}
          isPublicBuyer={true}
        />

        {/* Floating return pill only visible if merchant is testing preview mode */}
        {isPreviewingCustomerView && (
          <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2">
            <button
              type="button"
              onClick={() => {
                setIsPublicBuyerView(false);
                setIsPreviewingCustomerView(false);
                setCurrentMode('merchant');
              }}
              className="bg-slate-950/90 hover:bg-slate-900 text-white px-4 py-2.5 rounded-full border border-slate-700 shadow-2xl flex items-center gap-2 text-xs font-bold transition cursor-pointer backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>{language === 'si' ? 'නැවත Dashboard එකට යන්න' : 'Exit Preview • Return to Dashboard'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Universal Navbar (Only shown in Dashboard & Pricing modes, NEVER in Storefront) */}
      {currentMode !== 'storefront' && (
        <nav className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Logo & Platform Name */}
            <div 
              onClick={() => setCurrentMode('storefront')}
              className="flex items-center gap-3 cursor-pointer group"
              title={language === 'si' ? 'StoreFront එක බලන්න' : 'View Storefront'}
            >
              <StoreWaveLogo size="md" variant="full" theme="dark" showBadge={true} />
              <div className="hidden lg:flex flex-col pl-2.5 border-l border-slate-800">
                <span className="text-[11px] text-emerald-400 font-bold block truncate max-w-[140px] leading-tight">
                  {settings.storeName}
                </span>
                <span className="text-[9px] text-slate-500 font-medium block leading-tight">
                  {language === 'si' ? 'සජීවී වෙළඳසැල' : 'Live Storefront'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setCurrentMode('storefront')}
                className="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.storefront}</span>
              </button>

              <button
                onClick={() => setCurrentMode('merchant')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  currentMode === 'merchant'
                    ? 'bg-white text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.merchantAdmin}</span>
                {orders.filter(o => o.paymentStatus === 'pending').length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center">
                    {orders.filter(o => o.paymentStatus === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsPublicBuyerView(true);
                  setIsPreviewingCustomerView(true);
                }}
                className="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 font-bold"
                title={language === 'si' ? 'පාරිභෝගිකයාට පෙනෙන අයුරු (බඩු සහ Buy විතරක්)' : 'Live Customer View'}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'si' ? 'Customer View' : 'Buyer View'}</span>
              </button>
            </div>

            {/* Universal Language Selector, User Auth & Create Store Button */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="relative flex items-center">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
                <select
                  value={language}
                  onChange={(e) => handleUpdateLanguage(e.target.value as SupportedLanguage)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold pl-6 pr-2 sm:pr-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none cursor-pointer appearance-none"
                  title={t.language}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Merchant Login / Logged In User Pill with Logout */}
              {loggedInUser ? (
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 sm:px-2.5 py-1 rounded-xl text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  <span className="text-slate-300 font-medium hidden lg:inline truncate max-w-[130px]">
                    {loggedInUser.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLogoutConfirmOpen(true)}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 px-1 py-0.5 rounded cursor-pointer transition"
                    title={language === 'si' ? 'ගිණුමෙන් ඉවත් වන්න (Log Out)' : 'Log Out'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline font-bold text-[10px]">
                      {language === 'si' ? 'ඉවත් වන්න' : 'Log Out'}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === 'si' ? 'ලොගින්' : 'Sign In'}</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Main Mode View */}
      <main className="flex-1">
        {currentMode === 'storefront' && (
          <>
            {/* Pure Clean Storefront: Zero black bars at the top. Storefront starts immediately at top! */}
            <Storefront
              products={products}
              theme={theme}
              settings={settings}
              currency={currency}
              language={language}
              onChangeCurrency={setCurrency}
              onChangeLanguage={handleUpdateLanguage}
              onPlaceOrder={handlePlaceOrder}
              onNavigatePricing={() => setCurrentMode('pricing')}
              onAddReview={handleAddReview}
              onUpdateTheme={handleUpdateTheme}
              onUpdateSettings={handleUpdateSettings}
              isOwnerMode={!!loggedInUser && !isPublicBuyerView}
              isPublicBuyer={!loggedInUser || isPublicBuyerView}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onOpenDashboard={() => setCurrentMode('merchant')}
            />

            {/* Bottom Navigation Switcher for Store Owner (Only shown when merchant is logged in) */}
            {!!loggedInUser && !isPublicBuyerView && (
              <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
              <div className="pointer-events-auto bg-slate-950/95 text-white px-4 py-2.5 rounded-full border border-slate-800 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 pl-1 pr-2 border-r border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300 font-medium hidden sm:inline">
                    {language === 'si' ? 'ඔබගේ Store එක (Live View)' : 'Live Storefront'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const storeSlug = currentStoreSlug || settings.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    const publicUrl = typeof window !== 'undefined'
                      ? `${window.location.origin}/?store=${storeSlug}&view=buyer`
                      : `/?store=${storeSlug}&view=buyer`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(publicUrl);
                      setDockLinkCopied(true);
                      setTimeout(() => setDockLinkCopied(false), 2500);
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  title={language === 'si' ? 'පාරිභෝගිකයින්ට දෙන Link එක Copy කරගන්න' : 'Copy Customer Link for TikTok / Reels'}
                >
                  <Share2 className="w-3.5 h-3.5 text-white" />
                  <span>
                    {dockLinkCopied 
                      ? (language === 'si' ? 'Link එක Copied! ✅' : 'Copied! ✅') 
                      : (language === 'si' ? '🔗 Customer Link එක Copy කරන්න' : '🔗 Customer Link')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentMode('merchant')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-full font-black text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{language === 'si' ? '⚙️ Dashboard එකට යන්න' : '⚙️ Merchant Dashboard'}</span>
                </button>
              </div>
            </div>
            )}
          </>
        )}

        {currentMode === 'pricing' && (
          <SaaSPricing
            language={language}
            onSelectPlan={() => setIsCreateStoreOpen(true)}
            onOpenCreateStore={() => setIsCreateStoreOpen(true)}
          />
        )}

        {currentMode === 'merchant' && (
          <MerchantDashboard
            products={products}
            orders={orders}
            theme={theme}
            settings={settings}
            language={language}
            loggedInUser={loggedInUser}
            onLogoutClick={() => setIsLogoutConfirmOpen(true)}
            onUpdateProducts={handleUpdateProducts}
            onUpdateOrders={handleUpdateOrders}
            onUpdateTheme={handleUpdateTheme}
            onUpdateSettings={handleUpdateSettings}
            onSwitchToStorefront={() => setCurrentMode('storefront')}
            currentStoreSlug={currentStoreSlug}
            onPreviewBuyerStore={() => {
              setIsPublicBuyerView(true);
              setIsPreviewingCustomerView(true);
            }}
          />
        )}
      </main>

      {/* Mobile-Only Sticky Bottom Navigation Bar (Shown only in Dashboard & Pricing modes) */}
      {currentMode !== 'storefront' && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 shadow-lg">
          <div className="flex items-center justify-around text-[10px] font-bold">
            <button
              onClick={() => setCurrentMode('storefront')}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition text-slate-500 hover:text-slate-900"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{t.storefront}</span>
            </button>

            <button
              onClick={() => setCurrentMode('merchant')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition relative ${
                currentMode === 'merchant' ? 'text-indigo-600 font-black' : 'text-slate-500'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>{t.merchantAdmin}</span>
              {orders.filter(o => o.paymentStatus === 'pending').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-3" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create New Merchant Store (14-Day Free Trial) */}
      {isCreateStoreOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl relative text-xs">
            <button 
              onClick={() => setIsCreateStoreOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            {/* StoreWave LK Official Brand Logo */}
            <div className="flex justify-center pt-1 pb-1">
              <StoreWaveLogo size="md" variant="full" showBadge={true} />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider text-[10px]">
                {t.startFreeTrial}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">{t.createStore}</h3>
              <p className="text-slate-500 text-[11px]">Enter your brand name to launch your store in 30 seconds.</p>
            </div>

            {createSuccessAlert && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Store created! Redirecting to your Admin Dashboard...</span>
              </div>
            )}

            <form onSubmit={handleRegisterNewStore} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Store Name:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Trendy Ceylon Fashion"
                  required
                  value={createStoreName}
                  onChange={(e) => setCreateStoreName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Your Full Name:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nuwan Perera"
                  required
                  value={createOwnerName}
                  onChange={(e) => setCreateOwnerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Email Address:</label>
                <input 
                  type="email" 
                  placeholder="nuwan@gmail.com"
                  required
                  value={createOwnerEmail}
                  onChange={(e) => setCreateOwnerEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{language === 'si' ? 'මුරපදය (Store Password):' : 'Store Password:'}</span>
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
                <span className="text-[10px] text-slate-500 block">
                  {language === 'si' 
                    ? '🔒 වෙනත් කිසිවෙකුට ඔබේ Store එකට හෝ Dashboard එකට පිවිසිය නොහැකි ලෙස ආරක්ෂා වේ' 
                    : '🔒 Secures your dashboard against unauthorized access'}
                </span>
              </div>

              {/* Blank Store Canvas Option */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={startWithBlankCanvas}
                  onChange={(e) => setStartWithBlankCanvas(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                />
                <div className="text-[11px]">
                  <span className="font-bold text-slate-800 block">
                    {language === 'si' ? '📄 හිස් පිටුවකින් ආරම්භ කරන්න (Blank Store Canvas)' : '📄 Start with a Blank Store (Zero Products)'}
                  </span>
                  <span className="text-slate-500 block text-[10px]">
                    {language === 'si' ? 'නියැදි භාණ්ඩ රහිතව ඔබේම බඩු එකතු කර කඩය සකස් කර ගැනීමට' : 'Start with empty inventory to add only your own items'}
                  </span>
                </div>
              </label>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">What is included in your 14-day trial:</div>
                <div>✓ Multi-channel Daraz & Amazon Affiliate link generator</div>
                <div>✓ 1-Click WhatsApp & Cash on delivery orders</div>
                <div>✓ Bank slip upload verification</div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Launch My Free Store →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Merchant Login */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 space-y-4 shadow-2xl relative text-xs">
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            {/* StoreWave LK Official Brand Logo */}
            <div className="flex justify-center pt-1 pb-1">
              <StoreWaveLogo size="md" variant="full" showBadge={true} />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider text-[10px]">
                {language === 'si' ? 'පරිපාලක පිවිසුම' : 'Merchant Access'}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {language === 'si' ? 'වෙළඳසැල් හිමිකරු ලොගින් වන්න' : 'Merchant Sign In'}
              </h3>
              <p className="text-slate-500 text-[11px]">
                {language === 'si' ? 'ඔබේ ඊමේල් ලිපිනය ලබා දී Dashboard එකට පිවිසෙන්න.' : 'Enter your email to manage your store and inventory.'}
              </p>
            </div>

            {loginAlert ? (
              <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in zoom-in-95 duration-200 ${
                loginAlert.type === 'existing' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-indigo-50 border-indigo-200 text-indigo-900'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-black text-sm">
                    {loginAlert.type === 'existing' 
                      ? (language === 'si' ? 'පෙර ගිණුම සාර්ථකව පූරණය විය' : 'Existing Store Restored!') 
                      : (language === 'si' ? 'අලුත් හිස් Store එකක් නිර්මාණය විය' : 'New Blank Store Created!')}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {language === 'si' ? loginAlert.messageSi : loginAlert.messageEn}
                </p>
                <div className="pt-1 text-[10px] opacity-75 font-bold flex items-center gap-1">
                  <span>Redirecting to Merchant Dashboard...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-0.5">
                    {language === 'si' ? '💡 ස්වයංක්‍රීය හඳුනාගැනීම (Smart Detection):' : '💡 Automatic Account Detection:'}
                  </span>
                  {language === 'si'
                    ? '• මෙම ඊමේල් එකෙන් කලින් සාදන ලද Store එකක් ඇත්නම්, එම Store එක සහ එහි බඩු කෙළින්ම පූරණය වේ.'
                    : '• If this email has an existing store, your store and catalog will load automatically.'}
                  <br />
                  {language === 'si'
                    ? '• අලුත් ඊමේල් එකක් නම්, ඔබටම වෙනම හිස් Store එකක් (0 Products) ස්වයංක්‍රීයව විවෘත වේ.'
                    : '• If it is a new email, a brand new blank store (0 items) will be opened for you.'}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'ඊමේල් ලිපිනය (Email):' : 'Email Address:'}
                  </label>
                  <input 
                    type="email" 
                    placeholder="e.g. yasirusankalpa2026@gmail.com"
                    required
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginPasswordError(null);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{language === 'si' ? 'මුරපදය (Password):' : 'Password:'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="text-[10px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showLoginPassword ? (language === 'si' ? 'සඟවන්න' : 'Hide') : (language === 'si' ? 'පෙන්වන්න' : 'Show')}</span>
                    </button>
                  </div>
                  <input 
                    type={showLoginPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginPasswordError(null);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs"
                  />
                  {loginPasswordError && (
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{loginPasswordError}</span>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-500 block">
                    {language === 'si' 
                      ? '🔒 වෙනත් කිසිවෙකුට ඔබේ Store එකට හෝ Dashboard එකට පිවිසිය නොහැක' 
                      : '🔒 Protects your store from unauthorized access'}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'වෙළඳසැලේ නම (අලුත් Store එකක් සඳහා නම්):' : 'Store Name (If creating new):'}
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. My Ceylon Boutique"
                    value={loginStoreName}
                    onChange={(e) => setLoginStoreName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {language === 'si' ? 'පිවිසෙන්න (Sign In / Open Store) →' : 'Sign In / Open Store →'}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      setIsCreateStoreOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-700 font-bold text-[11px] underline cursor-pointer"
                  >
                    {language === 'si' ? 'අලුත් Store එකක් සවිස්තරාත්මකව හදන්න අවශ්‍යද? මෙතැන ඔබන්න' : 'Need to customize new store details? Click here'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Logout Confirmation (User Request: "log out ebuvama oyata log out venna onamada kiyalath damu") */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 space-y-4 shadow-2xl relative text-xs">
            <button 
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  {language === 'si' ? 'ඔබට Log Out වීමට අවශ්‍යද?' : 'Are you sure you want to log out?'}
                </h3>
                <span className="text-[11px] text-slate-500">
                  {loggedInUser?.email}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
              {language === 'si' 
                ? 'ඔබ මෙම පරිපාලක ගිණුමෙන් Log Out වනු ඇත. ඔබේ වෙළඳසැල පාරිභෝගිකයින්ට සාමාන්‍ය ලෙස විවෘතව පවතින අතර, ඔබට නැවත ඕනෑම වේලාවක ඔබේ ඊමේල් එකෙන් පිවිසිය හැක.'
                : 'You will be logged out of your Merchant Admin session. Visitors can still view and buy from your store, and you can log back in anytime.'}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer text-center"
              >
                {language === 'si' ? 'නැත, අවලංගු කරන්න' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoggedInUser(null);
                  try {
                    localStorage.removeItem('nextgen_logged_in_user');
                  } catch (e) {}
                  setIsLogoutConfirmOpen(false);
                  setIsOwnerMode(false);
                  setCurrentMode('storefront');
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer text-center shadow-xs"
              >
                {language === 'si' ? 'ඔව්, Log Out වන්න' : 'Yes, Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
