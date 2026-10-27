import React, { useState } from 'react';
import { 
  Plus, 
  Package, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Trash2, 
  Check, 
  X, 
  ExternalLink, 
  Eye, 
  MessageCircle, 
  Palette, 
  Settings as SettingsIcon,
  DownloadCloud,
  Link as LinkIcon,
  Zap,
  Tag,
  ArrowRight,
  TrendingUp,
  Percent,
  Sliders,
  Store,
  Layers,
  Edit3,
  LogOut,
  Truck,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Video,
  Play,
  Film
} from 'lucide-react';
import { Product, Order, StoreTheme, StoreSettings, AffiliatePlatform, MerchantUser } from '../types/store';
import { SupportedLanguage, getT } from '../utils/i18n';
import { 
  generateProductDescriptionAI, 
  extractTitleFromUrl, 
  detectPlatformFromUrl,
  autoAnalyzeAndGenerateFromAffiliateLink,
  getCategorySamplePhotos,
  DEMO_SAMPLE_LINKS, 
  DemoSampleLink 
} from '../utils/aiGenerator';

interface MerchantDashboardProps {
  products: Product[];
  orders: Order[];
  theme: StoreTheme;
  settings: StoreSettings;
  language: SupportedLanguage;
  loggedInUser?: MerchantUser | null;
  onLogoutClick?: () => void;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateTheme: (theme: StoreTheme) => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onSwitchToStorefront: () => void;
  currentStoreSlug?: string;
  onPreviewBuyerStore?: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  products,
  orders,
  theme,
  settings,
  language,
  loggedInUser,
  onLogoutClick,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateTheme,
  onUpdateSettings,
  onSwitchToStorefront,
  currentStoreSlug,
  onPreviewBuyerStore
}) => {
  const t = getT(language);

  const [activeTab, setActiveTab] = useState<'sourcing' | 'orders' | 'products' | 'customize' | 'settings'>('sourcing');
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  
  // New Product Modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Clothing');
  const [newCostPrice, setNewCostPrice] = useState<number>(2000);
  const [newProfitAmount, setNewProfitAmount] = useState<number>(1500);
  const [newPrice, setNewPrice] = useState<number>(3500);
  const [newComparePrice, setNewComparePrice] = useState<number>(4500);
  const [newStock, setNewStock] = useState<number>(20);
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState<string>('');
  const [activeManualMediaIndex, setActiveManualMediaIndex] = useState<number>(0);
  const [activeManualMediaType, setActiveManualMediaType] = useState<'photo' | 'video'>('photo');
  const [manualPhotoInputUrl, setManualPhotoInputUrl] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [showUrlImageInput, setShowUrlImageInput] = useState<boolean>(false);
  const [showUrlVideoInput, setShowUrlVideoInput] = useState<boolean>(false);
  const [isVideoUploading, setIsVideoUploading] = useState<boolean>(false);
  const [isDigital, setIsDigital] = useState(false);
  const [newFulfillmentType, setNewFulfillmentType] = useState<'affiliate' | 'dropship_margin' | 'physical_stock'>('dropship_margin');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // 1-Click Sourcing & Importer state
  const [importSource, setImportSource] = useState<AffiliatePlatform>('daraz');
  const [importUrl, setImportUrl] = useState('');
  const [importedTitle, setImportedTitle] = useState('');
  const [importedCategory, setImportedCategory] = useState('Electronics');
  const [importedBuyCost, setImportedBuyCost] = useState<number>(1800);
  const [importFulfillmentType, setImportFulfillmentType] = useState<'dropship_margin' | 'affiliate'>('dropship_margin');
  
  // Custom Profit Mode state: 'fixed' (Rs.), 'percent' (%), or 'direct' (Selling Price)
  const [profitMode, setProfitMode] = useState<'fixed' | 'percent' | 'direct'>('fixed');
  const [customProfitRs, setCustomProfitRs] = useState<number>(950);
  const [customProfitPercent, setCustomProfitPercent] = useState<number>(50);
  const [customDirectPrice, setCustomDirectPrice] = useState<number>(2750);
  
  const [importedDescription, setImportedDescription] = useState('');
  const [importedImageUrl, setImportedImageUrl] = useState('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80');
  const [importedImages, setImportedImages] = useState<string[]>(['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80']);
  const [importedVideoUrl, setImportedVideoUrl] = useState<string>('');
  const [activeImportMediaIndex, setActiveImportMediaIndex] = useState<number>(0);
  const [activeImportMediaType, setActiveImportMediaType] = useState<'photo' | 'video'>('photo');
  const [isImportDraggingOver, setIsImportDraggingOver] = useState<boolean>(false);
  const [showImportUrlInput, setShowImportUrlInput] = useState<boolean>(false);
  const [showImportVideoInput, setShowImportVideoInput] = useState<boolean>(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string>('');
  const [isGeneratingImportAI, setIsGeneratingImportAI] = useState(false);
  const [isAutoAnalyzingAffiliate, setIsAutoAnalyzingAffiliate] = useState<boolean>(false);
  const [autoAnalyzedNotice, setAutoAnalyzedNotice] = useState<string>('');
  const [quickModalAffiliateUrl, setQuickModalAffiliateUrl] = useState<string>('');
  const [isQuickAnalyzingModal, setIsQuickAnalyzingModal] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessProduct, setImportSuccessProduct] = useState<Product | null>(null);

  const handleImportImageFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const dataUrl = e.target.result as string;
          setImportedImages(prev => [...prev, dataUrl]);
          setImportedImageUrl(prev => prev || dataUrl);
          setActiveImportMediaType('photo');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImportImage = (indexToRemove: number) => {
    setImportedImages(prev => {
      const filtered = prev.filter((_, i) => i !== indexToRemove);
      if (activeImportMediaIndex >= filtered.length) {
        setActiveImportMediaIndex(Math.max(0, filtered.length - 1));
      }
      setImportedImageUrl(filtered[0] || '');
      return filtered;
    });
  };

  const handleSetCoverImportImage = (indexToCover: number) => {
    setImportedImages(prev => {
      const copy = [...prev];
      const [item] = copy.splice(indexToCover, 1);
      const next = [item, ...copy];
      setImportedImageUrl(next[0] || '');
      setActiveImportMediaIndex(0);
      setActiveImportMediaType('photo');
      return next;
    });
  };

  const handleImportVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert(language === 'si' ? 'කරුණාකර වීඩියෝ ගොනුවක් (MP4, WebM) තෝරන්න.' : 'Please select a valid video file.');
      return;
    }
    if (file.size > 80 * 1024 * 1024) {
      alert(language === 'si' ? 'වීඩියෝවේ ප්‍රමාණය 80MB ට වඩා අඩු විය යුතුය.' : 'Video size must be less than 80MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImportedVideoUrl(e.target.result as string);
        setActiveImportMediaType('video');
      }
    };
    reader.readAsDataURL(file);
  };

  // Inline Product Profit Edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editCostPrice, setEditCostPrice] = useState<number>(0);
  const [editSellingPrice, setEditSellingPrice] = useState<number>(0);

  // In-app delete confirmation modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Affiliate Partner IDs state
  const [darazAffId, setDarazAffId] = useState(settings.affiliateIds?.daraz || 'SL_AFF_MASTER_99');
  const [amazonAffId, setAmazonAffId] = useState(settings.affiliateIds?.amazon || 'nextgenstore-20');
  const [aliExpressAffId, setAliExpressAffId] = useState(settings.affiliateIds?.aliexpress || 'ali_track_88');
  const [alibabaAffId, setAlibabaAffId] = useState(settings.affiliateIds?.alibaba || 'ali_drop_12');
  const [temuAffId, setTemuAffId] = useState(settings.affiliateIds?.temu || 'aff_temu_lk');
  const [ebayAffId, setEbayAffId] = useState(settings.affiliateIds?.ebay || 'epn_lk_55');
  const [cjAffId, setCjAffId] = useState(settings.affiliateIds?.cjdropshipping || 'cj_partner_77');
  const [saveSuccessBadge, setSaveSuccessBadge] = useState(false);

  // Selected Order for Slip Inspection
  const [inspectSlipOrder, setInspectSlipOrder] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'processing' | 'delivered'>('all');

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'verified' ? o.total : 0), 0);
  const pendingSlipsCount = orders.filter(o => o.paymentMethod === 'bank_slip' && o.paymentStatus === 'pending').length;
  const totalOrdersCount = orders.length;

  // Real-time calculated selling price & profit
  const calculateFinalPriceAndProfit = () => {
    let sellPrice = 0;
    let pocketProfit = 0;
    const cost = Math.max(0, importedBuyCost || 0);

    if (profitMode === 'fixed') {
      pocketProfit = Math.max(0, customProfitRs || 0);
      sellPrice = cost + pocketProfit;
    } else if (profitMode === 'percent') {
      const margin = Math.max(0, customProfitPercent || 0);
      pocketProfit = Math.round((cost * margin) / 100);
      sellPrice = cost + pocketProfit;
    } else {
      sellPrice = Math.max(cost, customDirectPrice || cost);
      pocketProfit = sellPrice - cost;
    }

    const marginPct = cost > 0 ? Math.round((pocketProfit / cost) * 100) : 0;
    const comparePrice = Math.round(sellPrice * 1.3);

    return { sellPrice, pocketProfit, marginPct, comparePrice };
  };

  const { sellPrice, pocketProfit, marginPct, comparePrice } = calculateFinalPriceAndProfit();

  // Intelligent Affiliate Auto-Analysis & Description Generation
  const runAutoAffiliateAnalysis = async (urlToAnalyze: string) => {
    if (!urlToAnalyze || urlToAnalyze.trim().length < 8) return;
    setIsAutoAnalyzingAffiliate(true);
    setAutoAnalyzedNotice(language === 'si' ? '🤖 AI භාණ්ඩය හඳුනාගෙන සුපිරි විස්තරය ස්වයංක්‍රීයව ලියමින් පවතී...' : '🤖 AI identifying product & writing sales copy...');
    try {
      const result = await autoAnalyzeAndGenerateFromAffiliateLink(urlToAnalyze.trim(), language);
      setImportedTitle(result.title);
      setImportedCategory(result.category);
      setImportSource(result.platform);
      setImportedBuyCost(result.estimatedBuyCost);
      setCustomProfitRs(result.suggestedProfit);
      setImportedImageUrl(result.imageUrl);
      setImportedImages(result.images && result.images.length > 0 ? result.images : [result.imageUrl]);
      setActiveImportMediaIndex(0);
      setActiveImportMediaType('photo');
      setImportedDescription(result.description);
      setAutoAnalyzedNotice(
        language === 'si'
          ? `✓ AI මඟින් "${result.title}" හඳුනාගෙන සුපිරි විස්තරය ස්වයංක්‍රීයව ලියන ලදී!`
          : `✓ AI identified "${result.title}" & auto-generated sales copy!`
      );
    } catch (e) {
      console.error('Affiliate analysis error:', e);
    } finally {
      setIsAutoAnalyzingAffiliate(false);
    }
  };

  // Auto-parse URL when pasted into importer
  const handleUrlChange = (url: string) => {
    setImportUrl(url);
    if (url.trim().length > 8) {
      const extracted = extractTitleFromUrl(url);
      setImportedTitle(extracted);
      const plat = detectPlatformFromUrl(url);
      setImportSource(plat);

      // Auto-trigger analysis if valid web link pasted
      if (url.startsWith('http://') || url.startsWith('https://')) {
        runAutoAffiliateAnalysis(url);
      }
    }
  };

  // Quick Load Demo Sample Link - Auto loads and generates AI description
  const handleLoadSampleLink = async (sample: DemoSampleLink) => {
    setImportSource(sample.platform);
    setImportUrl(sample.url);
    setImportedTitle(sample.title);
    setImportedCategory(sample.category);
    setImportedBuyCost(sample.buyCost);
    setCustomProfitRs(sample.defaultProfit);
    setProfitMode('fixed');
    setImportedImageUrl(sample.image);
    setImportedImages(sample.images && sample.images.length > 0 ? sample.images : [sample.image]);
    setActiveImportMediaIndex(0);
    setActiveImportMediaType('photo');
    
    // Auto-generate AI description instantly
    setIsGeneratingImportAI(true);
    try {
      const text = await generateProductDescriptionAI(sample.title, sample.category, sample.platform, language);
      setImportedDescription(text);
      setAutoAnalyzedNotice(
        language === 'si' 
          ? `✓ "${sample.title}" සාම්පලයේ විස්තරය AI මඟින් ලියන ලදී.` 
          : `✓ Loaded sample with AI sales copy.`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImportAI(false);
    }
  };

  // Quick modal affiliate auto-analyzer
  const handleQuickModalAffiliateAnalyze = async (urlToAnalyze: string) => {
    if (!urlToAnalyze || urlToAnalyze.trim().length < 8) return;
    setIsQuickAnalyzingModal(true);
    try {
      const result = await autoAnalyzeAndGenerateFromAffiliateLink(urlToAnalyze.trim(), language);
      setNewTitle(result.title);
      setNewCategory(result.category);
      setNewCostPrice(result.estimatedBuyCost);
      setNewProfitAmount(result.suggestedProfit);
      setNewPrice(result.estimatedBuyCost + result.suggestedProfit);
      setNewComparePrice(Math.round((result.estimatedBuyCost + result.suggestedProfit) * 1.3));
      setNewDescription(result.description);
      setNewImages(result.images && result.images.length > 0 ? result.images : [result.imageUrl]);
      setActiveManualMediaIndex(0);
      setActiveManualMediaType('photo');
      setNewFulfillmentType('affiliate');
      setQuickModalAffiliateUrl('');
    } catch (e) {
      console.error('Quick modal affiliate error:', e);
    } finally {
      setIsQuickAnalyzingModal(false);
    }
  };

  // Generate AI Description for Importer
  const handleGenerateImportAIDescription = async () => {
    const titleToUse = importedTitle.trim() || extractTitleFromUrl(importUrl) || 'Trending Lifestyle Gadget';
    setIsGeneratingImportAI(true);
    try {
      const text = await generateProductDescriptionAI(titleToUse, importedCategory, importSource, language);
      setImportedDescription(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImportAI(false);
    }
  };

  // Add Product AI Description (Manual)
  const handleGenerateManualAIDescription = async () => {
    if (!newTitle) {
      alert(language === 'si' ? 'කරුණාකර මුලින් භාණ්ඩයේ නම ඇතුළත් කරන්න.' : 'Please enter a product title first.');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const text = await generateProductDescriptionAI(newTitle, newCategory, 'Store Direct', language);
      setNewDescription(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Photos Upload Handlers (Drag & Drop + Mobile File Picker)
  const handleImageFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const dataUrl = e.target.result as string;
          setNewImages(prev => {
            const next = [...prev, dataUrl];
            if (prev.length === 0) {
              setActiveManualMediaIndex(0);
            }
            return next;
          });
          setActiveManualMediaType('photo');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddSamplePhotos = () => {
    const sampleList = getCategorySamplePhotos(newCategory);
    setNewImages(prev => [...prev, ...sampleList]);
    setActiveManualMediaType('photo');
  };

  const handleManualAddPhotoUrl = (url: string) => {
    if (!url || !url.trim()) return;
    setNewImages(prev => [...prev, url.trim()]);
    setManualPhotoInputUrl('');
    setShowUrlImageInput(false);
    setActiveManualMediaType('photo');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setNewImages(prev => {
      const filtered = prev.filter((_, i) => i !== indexToRemove);
      if (activeManualMediaIndex >= filtered.length) {
        setActiveManualMediaIndex(Math.max(0, filtered.length - 1));
      }
      return filtered;
    });
  };

  const handleSetCoverImage = (indexToCover: number) => {
    setNewImages(prev => {
      const copy = [...prev];
      const [item] = copy.splice(indexToCover, 1);
      setActiveManualMediaIndex(0);
      setActiveManualMediaType('photo');
      return [item, ...copy];
    });
  };

  // Video Upload Handler
  const handleVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert(language === 'si' ? 'කරුණාකර වීඩියෝ ගොනුවක් (MP4, WebM) තෝරන්න.' : 'Please select a valid video file.');
      return;
    }
    if (file.size > 80 * 1024 * 1024) {
      alert(language === 'si' ? 'වීඩියෝවේ ප්‍රමාණය 80MB ට වඩා අඩු විය යුතුය.' : 'Video size must be less than 80MB.');
      return;
    }
    setIsVideoUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setNewVideoUrl(e.target.result as string);
        setActiveManualMediaType('video');
      }
      setIsVideoUploading(false);
    };
    reader.onerror = () => {
      setIsVideoUploading(false);
      alert('Error reading video file.');
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Importer Save
  const handleSaveImportedProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!importUrl) {
      alert(language === 'si' ? 'කරුණාකර භාණ්ඩයේ ලින්ක් එක (URL) ඇතුළත් කරන්න.' : 'Please paste a product URL from Daraz, Amazon, or AliExpress.');
      return;
    }

    setIsImporting(true);
    const title = importedTitle.trim() || extractTitleFromUrl(importUrl);
    const buyCost = importedBuyCost || 1800;
    const finalPrice = sellPrice || Math.round(buyCost * 1.5);
    const finalCompare = comparePrice || Math.round(finalPrice * 1.3);
    const finalImages = importedImages.length > 0 
      ? importedImages 
      : (importedImageUrl.trim() ? [importedImageUrl.trim()] : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']);
    const description = importedDescription || `🔥 ${title}\n\n• Verified direct from ${importSource.toUpperCase()}.\n• High quality build & ergonomic design.\n• Express islandwide delivery available with buyer protection.`;

    // Construct affiliate tracking link
    let finalAffiliateUrl = importUrl.trim();
    const separator = finalAffiliateUrl.includes('?') ? '&' : '?';
    if (importSource === 'daraz' && darazAffId && !finalAffiliateUrl.includes('aff_id=')) {
      finalAffiliateUrl = `${finalAffiliateUrl}${separator}dsource=affiliate&aff_id=${encodeURIComponent(darazAffId)}`;
    } else if (importSource === 'amazon' && amazonAffId && !finalAffiliateUrl.includes('tag=')) {
      finalAffiliateUrl = `${finalAffiliateUrl}${separator}tag=${encodeURIComponent(amazonAffId)}`;
    }

    const newProduct: Product = {
      id: `imported-${Date.now()}`,
      title,
      description,
      price: finalPrice,
      compareAtPrice: finalCompare,
      costPrice: buyCost,
      customProfitAmount: pocketProfit,
      customProfitPercent: marginPct,
      images: finalImages,
      videoUrl: importedVideoUrl.trim() || undefined,
      category: importedCategory,
      stock: 40,
      importedFrom: importSource,
      sourceUrl: importUrl,
      affiliateUrl: finalAffiliateUrl,
      affiliateCommission: `Rs. ${pocketProfit.toLocaleString()} (${marginPct}% Profit)`,
      tags: [`${importSource.toUpperCase()} Hot Deal`, 'Affiliate Sourced'],
      fulfillmentType: importFulfillmentType,
      codAvailable: importFulfillmentType === 'affiliate',
      rating: 4.9,
      reviewCount: 24,
      reviews: [
        {
          id: `rev-${Date.now()}`,
          author: 'Dulanja S.',
          rating: 5,
          date: 'Yesterday',
          comment: 'Ordered through partner link. Exactly as described and quick delivery!',
          verifiedPurchase: true
        }
      ]
    };

    // Prepend to top of catalog and persist
    const updated = [newProduct, ...products];
    onUpdateProducts(updated);
    try {
      localStorage.setItem('nextgen_products', JSON.stringify(updated));
    } catch (e) {}

    setIsImporting(false);
    setImportSuccessProduct(newProduct);
  };

  // Add Product Handler (Manual)
  const handleSaveManualProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const finalSellPrice = newPrice || (newCostPrice + newProfitAmount);
    const finalImages = newImages.length > 0 
      ? newImages 
      : (newImageUrl.trim() ? [newImageUrl.trim()] : getCategorySamplePhotos(newCategory));

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      price: finalSellPrice,
      compareAtPrice: newComparePrice || Math.round(finalSellPrice * 1.25),
      costPrice: newCostPrice,
      customProfitAmount: newProfitAmount,
      customProfitPercent: newCostPrice > 0 ? Math.round((newProfitAmount / newCostPrice) * 100) : 50,
      stock: newStock,
      description: newDescription || 'Premium lifestyle item with fast shipping.',
      images: finalImages,
      videoUrl: newVideoUrl.trim() || undefined,
      isDigital,
      fulfillmentType: newFulfillmentType,
      codAvailable: newFulfillmentType === 'physical_stock',
      rating: 5.0,
      reviewCount: 1,
      tags: ['New Arrival'],
      variants: {
        size: isDigital ? [] : ['M', 'L'],
        color: isDigital ? [] : ['Standard']
      }
    };

    const updated = [newProd, ...products];
    onUpdateProducts(updated);
    try {
      localStorage.setItem('nextgen_products', JSON.stringify(updated));
    } catch (e) {}

    setIsAddProductOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
    setNewImages([]);
    setNewVideoUrl('');
    setActiveManualMediaIndex(0);
    setActiveManualMediaType('photo');
    setManualPhotoInputUrl('');
    setShowUrlImageInput(false);
    setShowUrlVideoInput(false);
  };

  // Delete product - in-app confirmation modal
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;
    const updated = products.filter(p => p.id !== productToDelete.id);
    onUpdateProducts(updated);
    try {
      localStorage.setItem('nextgen_products', JSON.stringify(updated));
    } catch (e) {}
    if (importSuccessProduct?.id === productToDelete.id) {
      setImportSuccessProduct(null);
    }
    setProductToDelete(null);
  };

  // Open Edit Profit Modal
  const handleOpenEditProfit = (product: Product) => {
    setEditingProduct(product);
    setEditCostPrice(product.costPrice || Math.round(product.price * 0.5));
    setEditSellingPrice(product.price);
  };

  // Save Edited Profit for existing product
  const handleSaveEditedProfit = () => {
    if (!editingProduct) return;
    const updated = products.map(p => {
      if (p.id === editingProduct.id) {
        const profit = Math.max(0, editSellingPrice - editCostPrice);
        const margin = editCostPrice > 0 ? Math.round((profit / editCostPrice) * 100) : 0;
        return {
          ...p,
          costPrice: editCostPrice,
          price: editSellingPrice,
          customProfitAmount: profit,
          customProfitPercent: margin,
          compareAtPrice: Math.round(editSellingPrice * 1.3),
          affiliateCommission: `Rs. ${profit.toLocaleString()} (${margin}% Profit)`
        };
      }
      return p;
    });

    onUpdateProducts(updated);
    try {
      localStorage.setItem('nextgen_products', JSON.stringify(updated));
    } catch (e) {}
    setEditingProduct(null);
  };

  // Save Affiliate Partner IDs
  const handleSaveAffiliateIds = () => {
    const newSettings: StoreSettings = {
      ...settings,
      affiliateIds: {
        ...settings.affiliateIds,
        daraz: darazAffId,
        amazon: amazonAffId,
        aliexpress: aliExpressAffId,
        alibaba: alibabaAffId,
        temu: temuAffId,
        ebay: ebayAffId,
        cjdropshipping: cjAffId
      }
    };
    onUpdateSettings(newSettings);
    try {
      localStorage.setItem('nextgen_settings', JSON.stringify(newSettings));
    } catch (e) {}
    setSaveSuccessBadge(true);
    setTimeout(() => setSaveSuccessBadge(false), 2500);
  };

  // Order Actions: Verify Slip
  const handleVerifyBankSlip = (orderId: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, paymentStatus: 'verified' as const, fulfillmentStatus: 'processing' as const } : o);
    onUpdateOrders(updated);
    try {
      localStorage.setItem('nextgen_orders', JSON.stringify(updated));
    } catch (e) {}
    if (inspectSlipOrder?.id === orderId) {
      setInspectSlipOrder(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending') return o.paymentStatus === 'pending';
    return o.fulfillmentStatus === orderFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              {t.merchantAdmin}
            </span>
            <span className="text-xs text-slate-400">• {t.storeActive}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{settings.storeName}</h2>
          <p className="text-xs text-slate-500">{t.hubSubtitle}</p>
          {loggedInUser && (
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-600 font-medium">
              <span>👤 {language === 'si' ? 'හිමිකරු ගිණුම:' : 'Logged in as:'}</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-mono">{loggedInUser.email}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {loggedInUser && onLogoutClick && (
            <button
              type="button"
              onClick={onLogoutClick}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
              title={language === 'si' ? 'ගිණුමෙන් ඉවත් වන්න' : 'Log Out'}
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>{language === 'si' ? 'ඉවත් වන්න (Log Out)' : 'Log Out'}</span>
            </button>
          )}
          <button
            onClick={onSwitchToStorefront}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> {t.storefront}
          </button>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {language === 'si' ? 'භාණ්ඩයක් එකතු කරන්න' : 'Add Product'}
          </button>
        </div>
      </div>

      {/* 🚀 Public Customer Link (TikTok / Reels / Bio Link Card) */}
      {(() => {
        const storeSlug = currentStoreSlug || settings.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const publicUrl = typeof window !== 'undefined' 
          ? `${window.location.origin}/?store=${storeSlug}&view=buyer`
          : `/?store=${storeSlug}&view=buyer`;

        const handleCopyLink = () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(publicUrl);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2500);
          }
        };

        return (
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-indigo-500/30 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                    {language === 'si' ? 'පාරිභෝගිකයින් සඳහා වන නිල වෙළඳසැල් සබැඳිය' : 'Public Customer Storefront Link'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                    TikTok / Reels / Bio Link
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {language === 'si' 
                    ? 'පාරිභෝගිකයින්ට පෙනෙන්නේ ඔබ එකතු කළ බඩු සහ මිලදී ගැනීමේ Checkout පමණි' 
                    : 'Clean Buyer View: Customers only see your products and checkout page'}
                </h3>
                <p className="text-[11px] text-slate-300 max-w-2xl leading-relaxed">
                  {language === 'si'
                    ? 'මෙම Link එක ඔබේ TikTok, Facebook Reels, Instagram Bio හෝ WhatsApp හරහා Customers ලාට යවන්න. පාරිභෝගිකයාට Admin dashboard හෝ වෙනත් කිසිවක් නොපෙනෙන අතර, සාප්පු සවාරි කර බඩු ඇණවුම් කිරීමට පමණක් ඉඩ ලැබේ.'
                    : 'Share this link in your social bios. Customers who open it will only see your store products with zero distractions or admin controls.'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>{language === 'si' ? 'Link එක Copy විය!' : 'Link Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4 text-slate-950" />
                      <span>{language === 'si' ? 'Link එක Copy කරන්න' : 'Copy Public Link'}</span>
                    </>
                  )}
                </button>

                {onPreviewBuyerStore && (
                  <button
                    type="button"
                    onClick={onPreviewBuyerStore}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
                    title={language === 'si' ? 'පාරිභෝගිකයාට පෙනෙන අයුරු බලන්න' : 'Preview Buyer View'}
                  >
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'si' ? 'පාරිභෝගික දසුන බලන්න' : 'Preview Buyer View'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Display Link input box */}
            <div className="flex items-center gap-2 bg-slate-900/90 rounded-xl p-2 border border-slate-800 text-xs font-mono text-indigo-300 overflow-hidden">
              <span className="text-slate-500 text-[11px] shrink-0 font-sans">🔗 Store Link:</span>
              <span className="truncate select-all text-emerald-300 font-semibold">{publicUrl}</span>
            </div>
          </div>
        );
      })()}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>{t.verifiedRevenue}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base sm:text-2xl font-black text-slate-900 truncate">
            Rs. {totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>{t.customerOrdersCount}</span>
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base sm:text-2xl font-black text-slate-900">{totalOrdersCount}</div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>{t.pendingSlips}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base sm:text-2xl font-black text-amber-600">{pendingSlipsCount}</div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>{t.activeProductsCount}</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-base sm:text-2xl font-black text-slate-900">{products.length}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-3 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('sourcing')}
          className={`pb-2.5 relative transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'sourcing' ? 'text-amber-600 border-b-2 border-amber-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{t.sourcingStation} 🔥</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2.5 relative transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'orders' ? 'text-indigo-600 border-b-2 border-indigo-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.customerOrdersCount}</span>
          {pendingSlipsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-black">
              {pendingSlipsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2.5 relative transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'products' ? 'text-indigo-600 border-b-2 border-indigo-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.activeProductsCount} ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customize')}
          className={`pb-2.5 relative transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'customize' ? 'text-indigo-600 border-b-2 border-indigo-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{language === 'si' ? 'තේමාව සහ බැනර්' : 'Theme & Banners'}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-2.5 relative transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>{language === 'si' ? 'සැකසුම්' : 'Settings'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAddProductOpen(true)}
          className="ml-auto mb-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>{language === 'si' ? '+ අලුත් භාණ්ඩයක්' : '+ Add Product'}</span>
        </button>
      </div>

      {/* Tab: Sourcing & 1-Click Importer & Profit Customizer */}
      {activeTab === 'sourcing' && (
        <div className="space-y-6">
          {/* SECTION 1: All Official Partner Registration Portals (Direct native links!) */}
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-4 sm:p-7 text-white shadow-xl space-y-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                {t.officialAffiliatePortals}
              </span>
              <h3 className="text-base sm:text-2xl font-black mt-1">
                {language === 'si' ? 'කෙළින්ම නිල Affiliate සහ Seller Portals වෙත පිවිසෙන්න' : 'Access Official Partner & Seller Registration Portals Directly'}
              </h3>
              <p className="text-xs text-slate-300">
                {t.officialAffiliateDesc}
              </p>
            </div>

            {/* Direct Official Portals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
              {/* Daraz Affiliate */}
              <a
                href="https://affiliate.daraz.lk/login"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-between shadow-md transition group"
              >
                <div>
                  <div className="text-[10px] uppercase opacity-80">Official Partner Portal</div>
                  <div className="font-black text-sm">Daraz Affiliate Program</div>
                  <div className="text-[10px] text-orange-200">affiliate.daraz.lk/login</div>
                </div>
                <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Daraz Seller Center */}
              <a
                href="https://sellercenter.daraz.lk/registration/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-orange-700 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-between shadow-md transition group"
              >
                <div>
                  <div className="text-[10px] uppercase opacity-80">Official Seller Center</div>
                  <div className="font-black text-sm">Daraz Seller Registration</div>
                  <div className="text-[10px] text-orange-200">sellercenter.daraz.lk</div>
                </div>
                <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Amazon Associates */}
              <a
                href="https://affiliate-program.amazon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-between shadow-md transition group"
              >
                <div>
                  <div className="text-[10px] uppercase opacity-80">Amazon Global Associates</div>
                  <div className="font-black text-sm">Amazon Associates Hub</div>
                  <div className="text-[10px] text-amber-200">affiliate-program.amazon.com</div>
                </div>
                <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Alibaba Dropshipping */}
              <a
                href="https://dropshipping.alibaba.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-between shadow-md transition group"
              >
                <div>
                  <div className="text-[10px] uppercase opacity-80">B2B Wholesale / Dropship</div>
                  <div className="font-black text-sm">Alibaba Dropshipping</div>
                  <div className="text-[10px] text-amber-200">dropshipping.alibaba.com</div>
                </div>
                <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* AliExpress Portals */}
              <a
                href="https://portals.aliexpress.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-between shadow-md transition group"
              >
                <div>
                  <div className="text-[10px] uppercase opacity-80">Global Retail Dropship</div>
                  <div className="font-black text-sm">AliExpress Portals</div>
                  <div className="text-[10px] text-red-200">portals.aliexpress.com</div>
                </div>
                <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Temu Affiliate */}
              <a
                href="https://www.temu.com/affiliate-program.html"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-between shadow-md transition group"
              >
                <div>
                  <div className="text-[10px] uppercase opacity-80">Viral High Commission</div>
                  <div className="font-black text-sm">Temu Affiliate Program</div>
                  <div className="text-[10px] text-orange-200">temu.com/affiliate</div>
                </div>
                <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* eBay Partner Network */}
              <a
                href="https://partnernetwork.ebay.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-between shadow-md transition group"
              >
                <div>
                  <div className="text-[10px] uppercase opacity-80">eBay Global Marketplace</div>
                  <div className="font-black text-sm">eBay Partner Network</div>
                  <div className="text-[10px] text-blue-200">partnernetwork.ebay.com</div>
                </div>
                <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* CJ Dropshipping */}
              <a
                href="https://cjdropshipping.com/register.html"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-between shadow-md transition group"
              >
                <div>
                  <div className="text-[10px] uppercase opacity-80">Fast Warehouse Logistics</div>
                  <div className="font-black text-sm">CJ Dropshipping Portal</div>
                  <div className="text-[10px] text-purple-200">cjdropshipping.com</div>
                </div>
                <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Demo Sample Links (1-Click Test for User) */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-black text-slate-900 text-xs sm:text-sm">
                  {t.quickTestSamples}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {language === 'si' ? 'ක්ලික් කළ සැනින් විස්තර පිරවේ' : 'Click to auto-populate fields'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {DEMO_SAMPLE_LINKS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSampleLink(sample)}
                  className="p-2.5 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 text-left transition text-xs shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[9px] uppercase font-black text-indigo-600 mb-1">
                    <span>{sample.platform}</span>
                    <span>Rs. {sample.buyCost}</span>
                  </div>
                  <div className="font-bold text-slate-900 text-[11px] line-clamp-1 group-hover:text-indigo-600">
                    {sample.title}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">
                    +{sample.defaultProfit} Profit
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: 1-Click Product Link Importer with AI Description & Custom Profit Control */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                  <DownloadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">
                    {t.oneClickImport}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t.pasteUrlHelp}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>{language === 'si' ? '+ අතින් භාණ්ඩයක් එක් කරන්න (Manual Form)' : '+ Add Custom Product'}</span>
              </button>
            </div>

            {/* Success Alert with Instant View In Storefront Button */}
            {importSuccessProduct && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{t.importSuccessMsg}</span>
                  </div>
                  <button 
                    onClick={() => setImportSuccessProduct(null)}
                    className="text-emerald-700 hover:text-emerald-900 text-xs font-bold p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-xs text-slate-700">
                  <strong>{importSuccessProduct.title}</strong> — Price: <strong>Rs. {importSuccessProduct.price.toLocaleString()}</strong> (Your Profit: <strong>Rs. {importSuccessProduct.customProfitAmount?.toLocaleString()}</strong>)
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={onSwitchToStorefront}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{t.viewInStorefrontNow}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductToDelete(importSuccessProduct)}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>{language === 'si' ? 'මෙම භාණ්ඩය ඉවත් කරන්න (Delete)' : 'Delete this product'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportSuccessProduct(null);
                      setImportUrl('');
                      setImportedTitle('');
                      setImportedDescription('');
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition cursor-pointer"
                  >
                    {language === 'si' ? 'තව භාණ්ඩයක් ඇතුළත් කරන්න' : 'Import Another Product'}
                  </button>
                </div>
              </div>
            )}

            {/* AI Auto-Analysis Status Notification */}
            {isAutoAnalyzingAffiliate && (
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center gap-2 text-xs font-bold animate-pulse">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>{autoAnalyzedNotice || (language === 'si' ? '🤖 AI භාණ්ඩය හඳුනාගෙන සුපිරි විස්තරය ස්වයංක්‍රීයව ලියමින් පවතී...' : '🤖 AI identifying product & writing sales copy...')}</span>
              </div>
            )}
            {!isAutoAnalyzingAffiliate && autoAnalyzedNotice && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs font-bold shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{autoAnalyzedNotice}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setAutoAnalyzedNotice('')}
                  className="text-emerald-700 hover:text-emerald-950 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={(e) => handleSaveImportedProduct(e)} className="space-y-4">
              {/* URL Input */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-800 flex items-center justify-between">
                  <span>{t.pasteUrlLabel}</span>
                  {importSource && (
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {importSource}
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="url"
                      placeholder="https://www.daraz.lk/products/m10-tws-wireless-earbuds-i125890.html"
                      required
                      value={importUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => runAutoAffiliateAnalysis(importUrl)}
                    disabled={isAutoAnalyzingAffiliate || !importUrl.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50 shrink-0"
                    title={language === 'si' ? 'AI මඟින් භාණ්ඩය හඳුනාගෙන විස්තරය ලියන්න' : 'Auto detect product & generate sales copy'}
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-amber-200 ${isAutoAnalyzingAffiliate ? 'animate-spin' : ''}`} />
                    <span>{isAutoAnalyzingAffiliate ? (language === 'si' ? 'AI සොයයි...' : 'AI Analyzing...') : (language === 'si' ? '✨ Auto Detect' : '✨ Auto Detect')}</span>
                  </button>
                </div>
              </div>

              {/* Title & Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'භාණ්ඩයේ නම (Product Title):' : 'Product Title:'}
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Product title auto-extracted or type here"
                    value={importedTitle}
                    onChange={(e) => setImportedTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Platform:</label>
                  <select 
                    value={importSource}
                    onChange={(e) => setImportSource(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold cursor-pointer"
                  >
                    <option value="daraz">Daraz Sri Lanka</option>
                    <option value="amazon">Amazon Global</option>
                    <option value="aliexpress">AliExpress</option>
                    <option value="alibaba">Alibaba Wholesale</option>
                    <option value="temu">Temu</option>
                    <option value="ebay">eBay</option>
                    <option value="cjdropshipping">CJ Dropshipping</option>
                    <option value="walmart">Walmart</option>
                    <option value="etsy">Etsy</option>
                    <option value="clickbank">ClickBank (Digital)</option>
                  </select>
                </div>
              </div>

              {/* Sourcing Model Selector: Dropship Margin vs Direct Affiliate */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-800">
                  {language === 'si' ? 'විකිණීමේ සහ භාණ්ඩ යැවීමේ ක්‍රමය (Fulfillment Mode):' : 'Selling & Fulfillment Mode:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setImportFulfillmentType('dropship_margin')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      importFulfillmentType === 'dropship_margin'
                        ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-600/20 text-indigo-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs">
                        {language === 'si' ? '💰 Resell Dropship (ලාභය තබා විකිණීම)' : '💰 Resell Margin (Keep Profit)'}
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">Prepaid Only</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mt-1 leading-snug">
                      {language === 'si'
                        ? 'කස්ටමර් ඔබගේ කඩෙන් රු. 3,000 ට ගනී. COD අක්‍රියයි. කස්ටමර් ගෙවූ පසු ඔබ Daraz එකෙන් රු. 2,000 ට කස්ටමර්ගේ ලිපිනයට යවයි. ලාභය රු. 1,000 ඔබගේ බැංකුවට!'
                        : 'Customer buys from your store with your profit markup. COD is blocked. Customer pays you upfront, you order wholesale to customer address.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportFulfillmentType('affiliate')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      importFulfillmentType === 'affiliate'
                        ? 'bg-orange-50/70 border-orange-600 ring-2 ring-orange-600/20 text-orange-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs">
                        {language === 'si' ? '🔗 Direct Affiliate (නිල කොමිස් ක්‍රමය)' : '🔗 Direct Affiliate (Commission)'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">COD Supported</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mt-1 leading-snug">
                      {language === 'si'
                        ? 'පාරිභෝගිකයා Buy බටන් එක එබූ විට Daraz එකට යොමු වේ. Daraz මඟින් COD හෝ Card වලින් මුදල් එකතු කර භාණ්ඩය ලබා දේ. ඔබට Daraz එකෙන් කොමිස් ලැබේ.'
                        : 'Buy button redirects customer cleanly to Daraz. Daraz handles delivery & COD. You earn commission.'}
                    </p>
                  </button>
                </div>
              </div>

              {/* SECTION: Custom Profit & Pricing Control (User Request 10 - Explicitly customizable by seller!) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                      {t.customProfitTitle}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {t.customProfitDesc}
                  </span>
                </div>

                {/* Profit Mode Selector */}
                <div className="flex gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs font-bold max-w-fit">
                  <button
                    type="button"
                    onClick={() => setProfitMode('fixed')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      profitMode === 'fixed' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.profitModeFixed}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfitMode('percent')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      profitMode === 'percent' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.profitModePercent}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfitMode('direct')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      profitMode === 'direct' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.profitModeDirect}
                  </button>
                </div>

                {/* Pricing Calculation Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Buy Cost */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">{t.buyCostLabel}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 font-bold text-slate-400">Rs.</span>
                      <input 
                        type="number"
                        min="0"
                        value={importedBuyCost}
                        onChange={(e) => setImportedBuyCost(Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 font-black bg-white"
                      />
                    </div>
                  </div>

                  {/* Profit input depending on mode */}
                  <div className="space-y-1">
                    {profitMode === 'fixed' && (
                      <>
                        <label className="font-bold text-emerald-800">{t.profitModeFixed}:</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 font-bold text-emerald-600">+Rs.</span>
                          <input 
                            type="number"
                            min="0"
                            value={customProfitRs}
                            onChange={(e) => setCustomProfitRs(Number(e.target.value))}
                            className="w-full pl-12 pr-3 py-2 rounded-xl border-2 border-emerald-500 font-black text-emerald-700 bg-white focus:outline-none"
                          />
                        </div>
                      </>
                    )}

                    {profitMode === 'percent' && (
                      <>
                        <label className="font-bold text-emerald-800">{t.profitModePercent}:</label>
                        <div className="relative">
                          <span className="absolute right-3 top-2.5 font-bold text-emerald-600">%</span>
                          <input 
                            type="number"
                            min="0"
                            value={customProfitPercent}
                            onChange={(e) => setCustomProfitPercent(Number(e.target.value))}
                            className="w-full pl-3 pr-8 py-2 rounded-xl border-2 border-emerald-500 font-black text-emerald-700 bg-white focus:outline-none"
                          />
                        </div>
                      </>
                    )}

                    {profitMode === 'direct' && (
                      <>
                        <label className="font-bold text-emerald-800">{t.profitModeDirect}:</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 font-bold text-emerald-600">Rs.</span>
                          <input 
                            type="number"
                            min={importedBuyCost}
                            value={customDirectPrice}
                            onChange={(e) => setCustomDirectPrice(Number(e.target.value))}
                            className="w-full pl-10 pr-3 py-2 rounded-xl border-2 border-emerald-500 font-black text-emerald-700 bg-white focus:outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">
                      {language === 'si' ? 'වර්ගය (Category):' : 'Category:'}
                    </label>
                    <select 
                      value={importedCategory}
                      onChange={(e) => setImportedCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white cursor-pointer font-bold"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Beauty & Health">Beauty & Health</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Digital Products">Digital Products</option>
                    </select>
                  </div>
                </div>

                {/* Real-time Profit Summary Visualizer */}
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/90 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-emerald-800 uppercase font-bold block">{t.yourProfitLabel}</span>
                      <span className="text-sm sm:text-base font-black text-emerald-700">
                        +Rs. {pocketProfit.toLocaleString()} ({marginPct}% margin)
                      </span>
                    </div>
                    <div className="h-6 w-px bg-emerald-200" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">{t.finalSellingPriceLabel}</span>
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        Rs. {sellPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {t.compareAtPriceLabel} <span className="line-through font-bold">Rs. {comparePrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* AI Description Generator Button & Textarea */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="font-bold text-slate-800">
                    {language === 'si' ? 'භාණ්ඩ විස්තරය (Product Description):' : 'Product Description:'}
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateImportAIDescription}
                    disabled={isGeneratingImportAI}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-800 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isGeneratingImportAI ? t.aiWritingDescription : t.generateDescriptionWithAI}</span>
                  </button>
                </div>
                <textarea 
                  rows={4}
                  placeholder="Click the 'Generate Description with AI' button above or write custom details..."
                  value={importedDescription}
                  onChange={(e) => setImportedDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed focus:border-slate-900 focus:outline-none"
                />
              </div>

              {/* Daraz & Amazon Style Product Media Gallery (Unlimited Photos + Product Demo Video) */}
              <div className="space-y-3.5 p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>{language === 'si' ? '📸 භාණ්ඩයේ ඡායාරූප සහ Video (Photos & Video Gallery):' : '📸 Product Photos & Video:'}</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'si'
                        ? 'Daraz / Amazon මෙන් කැමති තරම් Photos ගණනක් සහ Product Video එකක් එකතු කරන්න'
                        : 'Add multiple product photos & demo video just like Daraz or Amazon'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black">
                      {importedImages.length} {language === 'si' ? 'Photos' : 'Photos'}
                    </span>
                    {importedVideoUrl && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Video Ready</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 1. Main Media Stage (Daraz Viewport) */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-black aspect-video sm:aspect-[16/10] max-h-72 w-full flex items-center justify-center shadow-sm">
                  {activeImportMediaType === 'video' && importedVideoUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <video 
                        src={importedVideoUrl} 
                        controls 
                        playsInline 
                        className="w-full h-full max-h-72 object-contain"
                      />
                      <div className="absolute top-3 left-3 bg-rose-600/90 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>{language === 'si' ? 'වීඩියෝ දසුන' : 'Video Preview'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setImportedVideoUrl('');
                          setActiveImportMediaType('photo');
                        }}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer transition"
                        title={language === 'si' ? 'වීඩියෝව ඉවත් කරන්න' : 'Remove video'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : importedImages.length > 0 && importedImages[activeImportMediaIndex] ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 group">
                      <img 
                        src={importedImages[activeImportMediaIndex]} 
                        alt="Product preview" 
                        className="w-full h-full object-contain max-h-72"
                      />
                      {activeImportMediaIndex === 0 && (
                        <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                          <span className="w-2 h-2 rounded-full bg-white"></span>
                          <span>{language === 'si' ? '⭐ Main Cover Photo (ප්‍රධාන පින්තූරය)' : '⭐ Main Cover'}</span>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        {activeImportMediaIndex !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImportImage(activeImportMediaIndex)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white font-black text-[11px] shadow-md cursor-pointer transition border border-white/20"
                          >
                            ⭐ {language === 'si' ? 'ප්‍රධාන පින්තූරය ලෙස තබන්න' : 'Set as Cover'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImportImage(activeImportMediaIndex)}
                          className="p-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white shadow-md cursor-pointer transition"
                          title={language === 'si' ? 'මෙම පින්තූරය ඉවත් කරන්න' : 'Remove this photo'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400 space-y-2">
                      <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
                      <p className="font-bold text-xs">
                        {language === 'si' ? 'තවම Photos ඇතුළත් කර නැත. පහතින් Photos එකතු කරන්න.' : 'No photos added yet. Use the buttons below.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Daraz-Style Thumbnails Strip (Photos + Video together) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span>
                      {language === 'si' ? 'පින්තූර සහ වීඩියෝ පෙළ (ක්ලික් කර බලන්න):' : 'Thumbnails Gallery (Click to view):'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {importedImages.length} {language === 'si' ? 'Photos එක් කර ඇත' : 'photos added'}
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap items-center p-2 rounded-2xl bg-white border border-slate-200 min-h-16">
                    {/* Photos Thumbnails */}
                    {importedImages.map((img, idx) => (
                      <div 
                        key={idx}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer group bg-slate-100 ${
                          activeImportMediaType === 'photo' && activeImportMediaIndex === idx 
                            ? 'border-indigo-600 ring-2 ring-indigo-600/30' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => {
                          setActiveImportMediaIndex(idx);
                          setActiveImportMediaType('photo');
                        }}
                      >
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[8px] font-black text-center py-0.2">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImportImage(idx);
                          }}
                          className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow-xs"
                          title="Remove"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}

                    {/* Video Thumbnail (if present) */}
                    {importedVideoUrl && (
                      <div
                        onClick={() => setActiveImportMediaType('video')}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer bg-slate-950 text-white flex flex-col items-center justify-center group ${
                          activeImportMediaType === 'video'
                            ? 'border-rose-500 ring-2 ring-rose-500/30'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                        title={language === 'si' ? 'වීඩියෝව බලන්න' : 'Watch Video'}
                      >
                        <Play className="w-5 h-5 fill-rose-500 text-rose-500" />
                        <span className="text-[8px] font-black uppercase tracking-wider text-rose-400 mt-0.5">Video</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImportedVideoUrl('');
                            setActiveImportMediaType('photo');
                          }}
                          className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow-xs"
                          title="Remove Video"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}

                    {/* Add More Photos Fast Tile */}
                    <label
                      htmlFor="sourcing-photo-multi-picker"
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 flex flex-col items-center justify-center cursor-pointer transition text-indigo-600"
                      title={language === 'si' ? 'තව Photos එක් කරන්න' : 'Add more photos'}
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-[8px] font-black uppercase">+ Photos</span>
                    </label>
                  </div>
                </div>

                {/* 3. Upload & Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {/* Multi-Photo Picker (Phone Gallery or PC files) */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsImportDraggingOver(true);
                    }}
                    onDragLeave={() => setIsImportDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsImportDraggingOver(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleImportImageFiles(e.dataTransfer.files);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-3 sm:p-4 text-center transition-all ${
                      isImportDraggingOver 
                        ? 'border-indigo-500 bg-indigo-50/80 scale-[0.99]' 
                        : 'border-slate-300 hover:border-indigo-400 bg-white'
                    }`}
                  >
                    <input
                      type="file"
                      id="sourcing-photo-multi-picker"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleImportImageFiles(e.target.files);
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="sourcing-photo-multi-picker" className="cursor-pointer block space-y-1">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center shadow-xs">
                        <Upload className="w-4 h-4" />
                      </div>
                      <p className="font-black text-slate-800 text-xs">
                        {language === 'si' 
                          ? '📁 Phone Gallery එකෙන් Photos (ඕනෑම ගණනක්) තෝරන්න' 
                          : '📁 Choose Multiple Photos from Phone / PC'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {language === 'si' ? 'එකවර Photos කිහිපයක්ම තෝරාගත හැක (Drag & Drop ද පුළුවන්)' : 'Select multiple images at once'}
                      </p>
                    </label>
                  </div>

                  {/* Video Uploader (File or URL) */}
                  <div className="border border-slate-200 rounded-2xl p-3 sm:p-4 bg-white flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                        <span>{language === 'si' ? '🎬 Product Demo Video (Daraz Style):' : '🎬 Product Demo Video:'}</span>
                      </span>
                      {importedVideoUrl && (
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          ✓ Added
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex gap-1.5">
                        <input
                          type="file"
                          id="sourcing-video-picker"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImportVideoFile(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="sourcing-video-picker"
                          className="flex-1 py-2 px-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition text-center"
                        >
                          <Film className="w-3.5 h-3.5 text-rose-600" />
                          <span>{language === 'si' ? 'Video File එකක් තෝරන්න' : 'Choose Video File'}</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowImportVideoInput(!showImportVideoInput)}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition"
                          title="Paste Video URL"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {showImportVideoInput && (
                        <div className="flex gap-1.5 pt-1">
                          <input 
                            type="text" 
                            placeholder="https://.../video.mp4"
                            value={importedVideoUrl}
                            onChange={(e) => {
                              setImportedVideoUrl(e.target.value);
                              if (e.target.value.trim()) setActiveImportMediaType('video');
                            }}
                            className="flex-1 p-2 rounded-xl border border-slate-300 text-xs font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Optional Web Photo URL input */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowImportUrlInput(!showImportUrlInput)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>{showImportUrlInput ? 'Hide photo web link input' : (language === 'si' ? '🔗 නැතහොත් Photo Web Link එකක් (URL) මඟින් එකතු කරන්න' : 'Or add photo by web URL')}</span>
                  </button>

                  {showImportUrlInput && (
                    <div className="mt-1.5 flex gap-1.5">
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/..."
                        value={tempPhotoUrl}
                        onChange={(e) => setTempPhotoUrl(e.target.value)}
                        className="flex-1 p-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempPhotoUrl.trim()) {
                            setImportedImages(prev => [...prev, tempPhotoUrl.trim()]);
                            setImportedImageUrl(prev => prev || tempPhotoUrl.trim());
                            setTempPhotoUrl('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                      >
                        Add Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isImporting}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <DownloadCloud className="w-4 h-4 text-emerald-400" />
                <span>{t.importAndPublishBtn}</span>
              </button>
            </form>
          </div>

          {/* SECTION 3: Connect Affiliate Partner IDs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  {t.connectAffiliate}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'si' 
                    ? 'ඔබේ Daraz, Amazon, AliExpress Affiliate Tracking IDs මෙහි දමන්න. පාරිභෝගිකයා මිලදී ගන්නා විට කොමිස් මුදල ඔබේ ගිණුමට ලැබේ.' 
                    : 'Save your partner tracking IDs. Buyer clicks and orders will automatically attribute commission to your accounts.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveAffiliateIds}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                {saveSuccessBadge ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                <span>{saveSuccessBadge ? (language === 'si' ? 'සාර්ථකව සුරැකිණි!' : 'Saved!') : (language === 'si' ? 'IDs සුරකින්න' : 'Save IDs')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Daraz Affiliate ID:</label>
                <input 
                  type="text" 
                  placeholder="e.g. SL_AFF_89234"
                  value={darazAffId}
                  onChange={(e) => setDarazAffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Amazon Associates Tag:</label>
                <input 
                  type="text" 
                  placeholder="e.g. nextgenstore-20"
                  value={amazonAffId}
                  onChange={(e) => setAmazonAffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">AliExpress Tracking ID:</label>
                <input 
                  type="text" 
                  placeholder="e.g. ali_track_55"
                  value={aliExpressAffId}
                  onChange={(e) => setAliExpressAffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Temu Referral Code:</label>
                <input 
                  type="text" 
                  placeholder="e.g. aff_temu_lk"
                  value={temuAffId}
                  onChange={(e) => setTemuAffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Alibaba Dropship ID:</label>
                <input 
                  type="text" 
                  placeholder="e.g. ali_drop_12"
                  value={alibabaAffId}
                  onChange={(e) => setAlibabaAffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">eBay Partner Network ID:</label>
                <input 
                  type="text" 
                  placeholder="e.g. epn_lk_55"
                  value={ebayAffId}
                  onChange={(e) => setEbayAffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">CJ Dropshipping ID:</label>
                <input 
                  type="text" 
                  placeholder="e.g. cj_partner_77"
                  value={cjAffId}
                  onChange={(e) => setCjAffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Orders & Bank Slips */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-base sm:text-lg">{t.customerOrdersCount}</h3>
            <div className="flex gap-1.5">
              {(['all', 'pending', 'processing', 'delivered'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition capitalize cursor-pointer ${
                    orderFilter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'pending' ? t.pendingSlips : f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                      <span className="block text-[10px] text-slate-400 font-sans">{order.createdAt}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-slate-500 text-[11px]">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.paymentStatus === 'verified' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentMethod === 'bank_slip' ? 'Bank Slip' : order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      {order.paymentMethod === 'bank_slip' && order.bankSlipUrl && (
                        <button
                          onClick={() => setInspectSlipOrder(order)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px] cursor-pointer"
                        >
                          Check Slip
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block p-1 rounded-lg bg-emerald-50 text-emerald-700"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Products List with Inline Profit & Price Control (User Request 10) */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                {t.activeProductsCount} ({products.length})
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'si' ? 'ඕනෑම භාණ්ඩයක විකුණුම් මිල සහ ලාභය වෙනස් කිරීමට "Edit Profit & Price" ඔබන්න.' : 'Edit profit margins or prices anytime with live recalculation.'}
              </p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> {language === 'si' ? 'භාණ්ඩයක් එක් කරන්න' : 'Add Product'}
            </button>
          </div>

          {products.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {language === 'si' ? 'ඔබේ වෙළඳසැලේ තවම භාණ්ඩ නොමැත' : 'No Products in Your Catalog'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {language === 'si'
                    ? '1-Click Importer මගින් Daraz හෝ Amazon භාණ්ඩ එකතු කරන්න, නැතහොත් "Add Product" මඟින් ඔබේම නිෂ්පාදන ඇතුළත් කරන්න.'
                    : 'Import affiliate products using 1-Click Importer or manually add your own products with custom prices.'}
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('sourcing')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs transition"
                >
                  {language === 'si' ? '1-Click Importer වෙත යන්න' : 'Open 1-Click Importer'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  {language === 'si' ? 'අලුත් භාණ්ඩයක් එක් කරන්න' : 'Add Manual Product'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map(product => {
              const cost = product.costPrice || Math.round(product.price * 0.5);
              const profit = product.customProfitAmount !== undefined 
                ? product.customProfitAmount 
                : Math.max(0, product.price - cost);

              return (
                <div key={product.id} className="p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3 bg-white hover:border-slate-300 transition">
                  <div className="flex gap-3 items-start">
                    <img src={product.images[0]} alt={product.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{product.title}</h4>
                      </div>
                      {product.importedFrom && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                          {product.importedFrom} Sourced
                        </span>
                      )}
                      <div className="text-[10px] text-slate-500 mt-0.5">{product.category} • Stock: {product.stock}</div>
                      
                      {/* Price and Profit Badges */}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs font-black text-slate-900">
                          Rs. {product.price.toLocaleString()}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          Profit: +Rs. {profit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditProfit(product)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{t.editProfit}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="p-1.5 px-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition flex items-center gap-1 text-[11px] font-bold"
                      title={language === 'si' ? 'කඩයෙන් ඉවත් කරන්න' : 'Delete Product'}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">{language === 'si' ? 'ඉවත් කරන්න' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* Tab: Theme */}
      {activeTab === 'customize' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-4 max-w-2xl text-xs">
          <h3 className="font-black text-slate-900 text-base sm:text-lg">
            {language === 'si' ? 'වෙළඳසැල් තේමාව සහ බැනර්' : 'Store Theme & Announcement'}
          </h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                {language === 'si' ? 'උඩින් පෙනෙන නිවේදනය (Announcement Bar):' : 'Top Announcement Text:'}
              </label>
              <input 
                type="text" 
                value={theme.announcementBar} 
                onChange={(e) => onUpdateTheme({ ...theme, announcementBar: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                {language === 'si' ? 'ප්‍රධාන බැනර් මාතෘකාව (Heading):' : 'Banner Heading:'}
              </label>
              <input 
                type="text" 
                value={theme.bannerText} 
                onChange={(e) => onUpdateTheme({ ...theme, bannerText: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                {language === 'si' ? 'බැනර් උප මාතෘකාව (Subtitle):' : 'Banner Subtitle:'}
              </label>
              <textarea 
                rows={2}
                value={theme.bannerSubtext} 
                onChange={(e) => onUpdateTheme({ ...theme, bannerSubtext: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <button
              onClick={() => {
                try {
                  localStorage.setItem('nextgen_theme', JSON.stringify(theme));
                } catch (e) {}
                alert(language === 'si' ? 'තේමාව සාර්ථකව සුරැකිණි!' : 'Theme updated successfully!');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              {language === 'si' ? 'තේමාව සුරකින්න' : 'Save Theme'}
            </button>
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-4 max-w-2xl text-xs">
          <h3 className="font-black text-slate-900 text-base sm:text-lg">
            {language === 'si' ? 'වෙළඳසැලේ සැකසුම්' : 'Store Settings'}
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {language === 'si' ? 'කඩේ නම (Store Name):' : 'Store Name:'}
                </label>
                <input 
                  type="text" 
                  value={settings.storeName} 
                  onChange={(e) => onUpdateSettings({ ...settings, storeName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {language === 'si' ? 'උප මාතෘකාව (Tagline):' : 'Store Tagline:'}
                </label>
                <input 
                  type="text" 
                  value={settings.tagline || ''} 
                  onChange={(e) => onUpdateSettings({ ...settings, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                {language === 'si' ? 'Custom Logo Image URL (විකල්පයි):' : 'Logo Image URL (Optional):'}
              </label>
              <input 
                type="text" 
                placeholder="https://.../logo.png"
                value={settings.logoUrl || ''} 
                onChange={(e) => onUpdateSettings({ ...settings, logoUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                {language === 'si' ? 'WhatsApp ඇණවුම් අංකය:' : 'WhatsApp Order Number:'}
              </label>
              <input 
                type="text" 
                value={settings.whatsappNumber} 
                onChange={(e) => onUpdateSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold">
                {language === 'si' ? 'තැන්පතු ලබාගන්නා නිල බැංකු ගිණුම:' : 'Official Bank Account for Deposits:'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Bank Name" 
                  value={settings.bankDetails.bankName} 
                  onChange={(e) => onUpdateSettings({
                    ...settings,
                    bankDetails: { ...settings.bankDetails, bankName: e.target.value }
                  })}
                  className="p-2 rounded-lg border border-slate-300 bg-white"
                />
                <input 
                  type="text" 
                  placeholder="Account Number" 
                  value={settings.bankDetails.accountNumber} 
                  onChange={(e) => onUpdateSettings({
                    ...settings,
                    bankDetails: { ...settings.bankDetails, accountNumber: e.target.value }
                  })}
                  className="p-2 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                />
              </div>
            </div>

            {/* COD & Courier Delivery Configuration (Sri Lanka Express Logistics) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                      {language === 'si' ? 'භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම (COD) සහ Courier සේවා' : 'Cash on Delivery (COD) & Courier Partner Settings'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'si' 
                        ? 'ඔබේම තොග (Physical Stock) ඇති භාණ්ඩ සඳහා COD ක්‍රියාත්මක කිරීමට මෙතැනින් තෝරන්න.' 
                        : 'Configure local delivery and COD options for your physical store inventory.'}
                    </p>
                  </div>
                </div>

                {/* COD Master Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.allowCOD !== false} 
                    onChange={(e) => onUpdateSettings({ ...settings, allowCOD: e.target.checked })} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Sri Lanka Courier Partner Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-[11px]">
                    {language === 'si' ? 'දේශීය Courier සේවාව (Delivery Partner):' : 'Delivery & Courier Service:'}
                  </label>
                  <select 
                    value={settings.courierPartner || 'koombiyo'} 
                    onChange={(e) => onUpdateSettings({ ...settings, courierPartner: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs cursor-pointer"
                  >
                    <option value="koombiyo">Koombiyo Delivery (කුම්බියෝ)</option>
                    <option value="domex">Domex Courier (ඩොමෙක්ස්)</option>
                    <option value="prompt_xpress">Prompt Xpress (ප්‍රොම්ප්ට්)</option>
                    <option value="fardar">Fardar Express (ෆාර්ඩාර්)</option>
                    <option value="certis">Certis Lanka Courier</option>
                    <option value="self">Self Delivery / Local Rider</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-[11px]">
                    {language === 'si' ? 'Courier Merchant / Account No:' : 'Courier Account / Merchant ID:'}
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. KMB-LK-9021" 
                    value={settings.courierAccountNo || ''} 
                    onChange={(e) => onUpdateSettings({ ...settings, courierAccountNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Informative Guidance Card */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{language === 'si' ? '💡 වැදගත් උපදෙස් (Dropshipping vs Physical Stock):' : '💡 Fulfillment & COD Rules:'}</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-blue-800 pl-1">
                  <li>
                    {language === 'si'
                      ? 'Daraz / Amazon Resell (Margin) භාණ්ඩ: මේවා සඳහා පද්ධතිය ස්වයංක්‍රීයවම COD අක්‍රිය කරයි (Prepaid Only). කස්ටමර් මුදල් කලින් ගෙවූ පසු ඔබ Daraz එකෙන් කස්ටමර්ගේ ලිපිනයට ඇණවුම් කරයි.'
                      : 'Third-party Dropship items: Checkout auto-disables COD (Prepaid only) so riders do not collect lower wholesale cash.'}
                  </li>
                  <li>
                    {language === 'si'
                      ? 'ඔබේම කඩේ තොග (Physical Stock): තෝරාගත් Courier සේවාව හරහා COD මඟින් භාණ්ඩ යවා කස්ටමර්ගෙන් මුදල් එකතු කරගත හැක.'
                      : 'Own inventory items: Delivered via your selected Courier partner with COD collection.'}
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => {
                try {
                  localStorage.setItem('nextgen_settings', JSON.stringify(settings));
                } catch (e) {}
                alert(language === 'si' ? 'සැකසුම් සාර්ථකව සුරැකිණි!' : 'Settings saved!');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              {language === 'si' ? 'සැකසුම් සුරකින්න' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Modal: Edit Profit & Price for existing product (User Request 10) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative text-xs">
            <button 
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase">
                {t.customProfitTitle}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {editingProduct.title}
              </h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">{t.buyCostLabel}</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400">Rs.</span>
                  <input 
                    type="number"
                    min="0"
                    value={editCostPrice}
                    onChange={(e) => setEditCostPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">{t.finalSellingPriceLabel}</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400">Rs.</span>
                  <input 
                    type="number"
                    min={editCostPrice}
                    value={editSellingPrice}
                    onChange={(e) => setEditSellingPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border-2 border-emerald-500 font-black text-emerald-700"
                  />
                </div>
              </div>

              {/* Calculated Profit Badge */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-800 block">{t.yourProfitLabel}</span>
                <span className="text-lg font-black text-emerald-700">
                  +Rs. {Math.max(0, editSellingPrice - editCostPrice).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ({editCostPrice > 0 ? Math.round(((editSellingPrice - editCostPrice) / editCostPrice) * 100) : 0}% Profit Margin)
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveEditedProfit}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs cursor-pointer shadow-xs hover:bg-slate-800 transition"
              >
                {t.saveProfit}
              </button>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Manual Product */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl relative text-xs">
            <button 
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {language === 'si' ? 'අලුත් භාණ්ඩයක් එක් කරන්න' : 'Add New Product to Store'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'si' ? 'කැමති මිල සහ ලාභය සකසා කඩයට එක් කරන්න.' : 'Create physical or digital products with custom profit.'}
              </p>
            </div>

            {/* Quick Affiliate Link Auto-Fill bar (User Request 9) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 border border-amber-200/90 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-black text-xs text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{language === 'si' ? 'Affiliate Link එකකින් ස්වයංක්‍රීයව එක් කරන්න:' : 'Auto Fill from Affiliate Link:'}</span>
                </span>
                <span className="text-[10px] font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {language === 'si' ? 'AI Auto Title & Copy' : '100% Automatic'}
                </span>
              </div>
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-700/60 absolute left-2.5 top-2.5" />
                  <input
                    type="url"
                    placeholder={language === 'si' ? 'Daraz, Amazon, AliExpress හෝ Temu link එක මෙතැනට දමන්න...' : 'Paste Daraz, Amazon, AliExpress, Temu link...'}
                    value={quickModalAffiliateUrl}
                    onChange={(e) => {
                      setQuickModalAffiliateUrl(e.target.value);
                      if (e.target.value.startsWith('http://') || e.target.value.startsWith('https://')) {
                        handleQuickModalAffiliateAnalyze(e.target.value);
                      }
                    }}
                    className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-amber-300 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickModalAffiliateAnalyze(quickModalAffiliateUrl)}
                  disabled={isQuickAnalyzingModal || !quickModalAffiliateUrl.trim()}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-1 shadow-sm transition cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isQuickAnalyzingModal ? 'animate-spin' : ''}`} />
                  <span>{isQuickAnalyzingModal ? (language === 'si' ? 'AI ලියයි...' : 'Generating...') : (language === 'si' ? 'Auto Fill' : 'Auto Fill')}</span>
                </button>
              </div>
              <p className="text-[10px] text-amber-900 leading-snug">
                {language === 'si' 
                  ? '💡 Affiliate Link එක දැමූ සැනින් භාණ්ඩයේ නම, පින්තූරය, මිල සහ විස්තරය AI මඟින් ස්වයංක්‍රීයව ලියවේ. අතින් දැමීමට නම් පහත කොටස් සාමාන්‍ය පරිදි පුරවන්න.' 
                  : '💡 Paste an affiliate link to auto-fill title, HD photo, price and description. Or enter details manually below.'}
              </p>
            </div>

            <form onSubmit={handleSaveManualProduct} className="space-y-4">
              {/* Product Title and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-800 text-xs">
                    {language === 'si' ? 'භාණ්ඩයේ නම (Title):' : 'Product Title:'}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Minimalist Linen Shirt"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs">
                    {language === 'si' ? 'වර්ගය (Category):' : 'Category:'}
                  </label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white cursor-pointer font-bold text-xs"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Beauty & Health">Beauty & Health</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Digital Products">Digital Products</option>
                  </select>
                </div>
              </div>

              {/* Daraz & Amazon Style Product Media Gallery (Top-level, Unlimited Photos + Video Demo) */}
              <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/20 border-2 border-indigo-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>{language === 'si' ? '📸 භාණ්ඩයේ පින්තූර සහ වීඩියෝ (Photos & Video Gallery):' : '📸 Product Photos & Video:'}</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'si'
                        ? 'Daraz / Amazon මෙන් ඕනෑම Photos ගණනක් (කැමති ප්‍රමාණයක්) සහ Product Video එකක් එක් කරන්න.'
                        : 'Add unlimited photos & demo video clip just like Daraz or Amazon.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black">
                      {newImages.length} {language === 'si' ? 'Photos ඇත' : 'Photos'}
                    </span>
                    {newVideoUrl && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Video Ready</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Media Preview Stage (Daraz Viewport) */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-black aspect-video max-h-56 w-full flex items-center justify-center shadow-inner">
                  {activeManualMediaType === 'video' && newVideoUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <video 
                        src={newVideoUrl} 
                        controls 
                        playsInline 
                        className="w-full h-full max-h-56 object-contain"
                      />
                      <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                        <Play className="w-2 h-2 fill-current" />
                        <span>{language === 'si' ? 'වීඩියෝ දසුන' : 'Video Preview'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewVideoUrl('');
                          setActiveManualMediaType('photo');
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer transition"
                        title={language === 'si' ? 'වීඩියෝව ඉවත් කරන්න' : 'Remove video'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : newImages.length > 0 && newImages[activeManualMediaIndex] ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 group">
                      <img 
                        src={newImages[activeManualMediaIndex]} 
                        alt="Product preview" 
                        className="w-full h-full object-contain max-h-56"
                      />
                      {activeManualMediaIndex === 0 ? (
                        <div className="absolute top-2 left-2 bg-emerald-600/95 text-white text-[9px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-md backdrop-blur-xs">
                          <span>⭐ {language === 'si' ? 'Main Cover Photo (ප්‍රධාන පින්තූරය)' : 'Main Cover'}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCoverImage(activeManualMediaIndex)}
                          className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-900 text-white font-black text-[10px] shadow-md cursor-pointer transition border border-white/20"
                        >
                          ⭐ {language === 'si' ? 'ප්‍රධාන පින්තූරය ලෙස තබන්න' : 'Set as Cover'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(activeManualMediaIndex)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white shadow-md cursor-pointer transition"
                        title={language === 'si' ? 'මෙම පින්තූරය ඉවත් කරන්න' : 'Remove photo'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-400 space-y-1.5">
                      <ImageIcon className="w-7 h-7 mx-auto text-slate-500" />
                      <p className="font-bold text-xs text-slate-300">
                        {language === 'si' ? 'තවම Photos ඇතුළත් කර නැත. පහතින් එකතු කරන්න.' : 'No photos added yet. Select photos below.'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {language === 'si' ? 'ඕනෑම photos ගණනක් එකවර තෝරාගත හැක.' : 'You can select multiple photos at once.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Thumbnails Filmstrip (Photos + Video) */}
                {(newImages.length > 0 || newVideoUrl) && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                      <span>{language === 'si' ? 'පින්තූර සහ වීඩියෝ පෙළ (ක්ලික් කර බලන්න):' : 'Thumbnails Strip (Click to view):'}</span>
                      <span className="text-[10px] text-slate-400">{newImages.length} photos</span>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center p-2 rounded-xl bg-white border border-slate-200 min-h-14">
                      {newImages.map((img, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setActiveManualMediaIndex(idx);
                            setActiveManualMediaType('photo');
                          }}
                          className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer group bg-slate-100 ${
                            activeManualMediaType === 'photo' && activeManualMediaIndex === idx 
                              ? 'border-indigo-600 ring-2 ring-indigo-600/30' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[8px] font-black text-center py-0.2">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow-xs"
                            title="Remove"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}

                      {/* Video Thumbnail (if present) */}
                      {newVideoUrl && (
                        <div
                          onClick={() => setActiveManualMediaType('video')}
                          className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer bg-slate-950 text-white flex flex-col items-center justify-center group ${
                            activeManualMediaType === 'video'
                              ? 'border-rose-500 ring-2 ring-rose-500/30'
                              : 'border-slate-800 hover:border-slate-700'
                          }`}
                          title={language === 'si' ? 'වීඩියෝව බලන්න' : 'Watch Video'}
                        >
                          <Play className="w-4 h-4 fill-rose-500 text-rose-500" />
                          <span className="text-[7px] font-black uppercase tracking-wider text-rose-400 mt-0.5">Video</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewVideoUrl('');
                              setActiveManualMediaType('photo');
                            }}
                            className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow-xs"
                            title="Remove Video"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}

                      {/* Fast Add More Photos button tile */}
                      <label
                        htmlFor="manual-photo-multi-picker"
                        className="w-14 h-14 rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 flex flex-col items-center justify-center cursor-pointer transition text-indigo-600"
                        title={language === 'si' ? 'තව Photos එක් කරන්න' : 'Add more photos'}
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-[8px] font-black mt-0.5">+Photo</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Upload & Controls Bar (Multiple photos supported) */}
                <input
                  type="file"
                  id="manual-photo-multi-picker"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleImageFiles(e.target.files);
                    }
                  }}
                  className="hidden"
                />

                {/* Action Buttons Row */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <label
                    htmlFor="manual-photo-multi-picker"
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{language === 'si' ? '📁 Phone / PC එකෙන් Photos තෝරන්න (Select Multiple)' : '📁 Choose Multiple Photos'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowUrlImageInput(!showUrlImageInput)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{language === 'si' ? '🔗 Image URL දමන්න' : '🔗 Add by URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddSamplePhotos}
                    className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'si' ? '✨ Sample Photos (1-Click)' : '✨ Sample Studio Photos'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlVideoInput(!showUrlVideoInput)}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                  >
                    <Video className="w-3.5 h-3.5 text-rose-600" />
                    <span>{language === 'si' ? '🎬 Product Video එකක්' : '🎬 Add Product Video'}</span>
                  </button>
                </div>

                {/* Inline Image URL Input */}
                {showUrlImageInput && (
                  <div className="p-3 rounded-xl bg-white border border-slate-300 space-y-2 animate-in fade-in duration-150">
                    <span className="font-bold text-[11px] text-slate-700 block">
                      {language === 'si' ? 'පින්තූරයේ Web Link එක (Direct Image URL) මෙතැනට දමන්න:' : 'Paste direct image URL (PNG/JPG/WebP):'}
                    </span>
                    <div className="flex gap-2">
                      <input 
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={manualPhotoInputUrl}
                        onChange={(e) => setManualPhotoInputUrl(e.target.value)}
                        className="flex-1 p-2 rounded-xl border border-slate-300 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleManualAddPhotoUrl(manualPhotoInputUrl)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                      >
                        {language === 'si' ? 'එක් කරන්න' : 'Add Photo'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Inline Video Upload or URL Input */}
                {showUrlVideoInput && (
                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-950 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-rose-600" />
                        <span>{language === 'si' ? 'Product Demo Video එකක් ඇතුළත් කරන්න:' : 'Product Demo Video:'}</span>
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setShowUrlVideoInput(false)}
                        className="text-[10px] text-rose-700 hover:underline cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <input
                          type="file"
                          id="inline-manual-video-picker"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleVideoFile(e.target.files[0]);
                              setShowUrlVideoInput(false);
                            }
                          }}
                          className="hidden"
                        />
                        <label 
                          htmlFor="inline-manual-video-picker"
                          className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-rose-300 text-rose-800 hover:bg-rose-100/60 font-bold text-xs cursor-pointer text-center"
                        >
                          <Film className="w-4 h-4 text-rose-600" />
                          <span>{isVideoUploading ? 'Uploading...' : (language === 'si' ? '📁 Video File එකක් තෝරන්න (MP4)' : 'Choose MP4 File')}</span>
                        </label>
                      </div>
                      <div className="flex gap-1.5">
                        <input 
                          type="url"
                          placeholder="https://.../demo-video.mp4"
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                          className="flex-1 p-2 rounded-xl border border-rose-300 bg-white text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newVideoUrl.trim()) {
                              setActiveManualMediaType('video');
                              setShowUrlVideoInput(false);
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing & Profit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs">{t.buyCostLabel}</label>
                  <input 
                    type="number" 
                    value={newCostPrice}
                    onChange={(e) => setNewCostPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-emerald-800 text-xs">{t.yourProfitLabel}</label>
                  <input 
                    type="number" 
                    value={newProfitAmount}
                    onChange={(e) => {
                      const prof = Number(e.target.value);
                      setNewProfitAmount(prof);
                      setNewPrice(newCostPrice + prof);
                    }}
                    className="w-full p-2.5 rounded-xl border-2 border-emerald-500 text-emerald-700 font-black text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 text-xs">{t.finalSellingPriceLabel}</label>
                <input 
                  type="number" 
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-slate-900 text-xs"
                />
              </div>

              {/* Superb AI Description Generator */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>{language === 'si' ? 'භාණ්ඩ විස්තරය (Description):' : 'Product Description:'}</span>
                      <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-100 px-1.5 py-0.2 rounded">
                        {language === 'si' ? 'Sales Copy' : 'High Converting'}
                      </span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateManualAIDescription}
                    disabled={isGeneratingAI}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                    <span>
                      {isGeneratingAI 
                        ? (language === 'si' ? 'AI ලියමින් පවතී...' : 'AI Generating...') 
                        : (language === 'si' ? '✨ AI සුපිරි විස්තරය ලියන්න' : '✨ Generate AI Sales Copy')}
                    </span>
                  </button>
                </div>
                <textarea 
                  rows={4}
                  required
                  placeholder={language === 'si' 
                    ? "භාණ්ඩයේ විශේෂාංග, වාසි සහ පාරිභෝගිකයාට ලැබෙන ප්‍රතිලාභ මෙහි ලියන්න (හෝ ඉහත AI බටන් එක ඔබන්න)..." 
                    : "Describe the product features, benefits, and shipping info (or click the AI button above)..."}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white leading-relaxed text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs cursor-pointer shadow-md transition"
              >
                {language === 'si' ? 'කඩයට භාණ්ඩය එක් කරන්න' : 'Publish Product to Store'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bank Slip Inspection */}
      {inspectSlipOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative text-xs">
            <button 
              onClick={() => setInspectSlipOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                Bank Deposit Slip Verification
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Order #{inspectSlipOrder.orderNumber} — Rs. {inspectSlipOrder.total.toLocaleString()}
              </h3>
              <p className="text-[11px] text-slate-500">{inspectSlipOrder.customerName} • {inspectSlipOrder.customerPhone}</p>
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              {inspectSlipOrder.bankSlipUrl ? (
                <img src={inspectSlipOrder.bankSlipUrl} alt="Bank Deposit Slip" className="w-full h-full object-contain" />
              ) : (
                <span className="text-slate-400">No slip image uploaded</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleVerifyBankSlip(inspectSlipOrder.id)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-xs transition"
              >
                Verify & Mark Paid
              </button>
              <button
                onClick={() => setInspectSlipOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal: Delete Product from Catalog */}
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
                  : 'This item will be permanently removed from your catalog and storefront.'}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
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
    </div>
  );
};
