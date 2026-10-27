import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Layers, Store } from 'lucide-react';
import { SupportedLanguage, getT } from '../utils/i18n';
import { StoreWaveLogo } from './StoreWaveLogo';

interface SaaSPricingProps {
  language: SupportedLanguage;
  onSelectPlan: (plan: string) => void;
  onOpenCreateStore: () => void;
}

export const SaaSPricing: React.FC<SaaSPricingProps> = ({
  language,
  onSelectPlan,
  onOpenCreateStore
}) => {
  const t = getT(language);

  const plans = [
    {
      id: 'starter',
      name: t.starterPlan,
      price: t.starterPrice,
      period: '/ month',
      description: t.starterSub,
      popular: false,
      features: [
        'Up to 50 Products Catalog',
        'Daraz & Amazon Affiliate Link Generator',
        '1-Click WhatsApp & Cash on Delivery Orders',
        'Basic Storefront Themes & Customization',
        'Instant Digital Product Downloads',
        'SSL Security & Mobile Optimization'
      ]
    },
    {
      id: 'pro',
      name: t.proPlan,
      price: t.proPrice,
      period: '/ month',
      description: t.proSub,
      popular: true,
      features: [
        'Unlimited Products Catalog',
        'Multi-Platform Affiliate Hub (Daraz, Amazon, AliExpress, Temu, eBay)',
        '1-Click Product Link Importer with Custom Markup',
        'Manual Bank Slip Upload & Verification Dashboard',
        'Customer Photo Reviews & 5-Star Ratings Engine',
        'Multi-Language & Multi-Currency Switcher',
        'AI Product Description & Copywriter Generator'
      ]
    },
    {
      id: 'business',
      name: t.businessPlan,
      price: t.businessPrice,
      period: '/ month',
      description: t.businessSub,
      popular: false,
      features: [
        'All Pro Features Included',
        'Custom Domain Connection (yourbrand.com)',
        '0% Additional Platform Transaction Fees',
        'Priority 24/7 Dedicated Support',
        'Advanced Inventory Multi-Location Sync',
        'Staff Accounts & Role Permissions'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center">
          <StoreWaveLogo size="lg" variant="full" theme="light" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'si' ? 'ශ්‍රී ලංකාවේ #1 Store Builder එක' : 'Sri Lanka\'s #1 Cloud Store Platform'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          {t.pricingTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {t.pricingSubtitle}
        </p>
        <span className="text-xs text-slate-400 block">{t.billedMonthly}</span>
      </div>

      {/* Pricing Cards Grid (Mobile First) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              plan.popular
                ? 'bg-gradient-to-b from-slate-900 to-indigo-950 text-white shadow-2xl ring-2 ring-indigo-500 scale-100 md:scale-105'
                : 'bg-white text-slate-900 border border-slate-200/90 shadow-sm hover:shadow-md'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                {t.popularBadge}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black">{plan.name}</h3>
                <p className={`text-xs mt-1 ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-3xl sm:text-4xl font-black">{plan.price}</span>
                <span className={`text-xs font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.period}
                </span>
              </div>

              <div className={`h-px ${plan.popular ? 'bg-slate-800' : 'bg-slate-100'}`} />

              {/* Features List */}
              <ul className="space-y-2.5 text-xs">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-emerald-400' : 'text-indigo-600'}`} />
                    <span className={plan.popular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  onSelectPlan(plan.id);
                  onOpenCreateStore();
                }}
                className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  plan.popular
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>{t.startFreeTrial}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <div className="font-bold text-slate-900">Zero Risk 14-Day Free Trial</div>
            <div>No credit card required. Cancel anytime with a single click.</div>
          </div>
        </div>
        <button
          onClick={onOpenCreateStore}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition whitespace-nowrap cursor-pointer"
        >
          {t.createStore} →
        </button>
      </div>
    </div>
  );
};
