import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Smartphone, 
  Truck, 
  FileText, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  Sparkles,
  Layers,
  Percent
} from 'lucide-react';

export const SellerProfitGuide: React.FC = () => {
  // Interactive Profit Calculator State
  const [productCost, setProductCost] = useState<number>(1500); // Product buy cost
  const [sellingPrice, setSellingPrice] = useState<number>(3800); // Selling price
  const [deliveryCharged, setDeliveryCharged] = useState<number>(450); // From customer
  const [courierFee, setCourierFee] = useState<number>(400); // Paid to courier
  const [packagingCost, setPackagingCost] = useState<number>(100); // Box/Bag
  const [monthlyOrders, setMonthlyOrders] = useState<number>(60); // 2 orders per day

  // Calculations
  const revenuePerOrder = sellingPrice + deliveryCharged;
  const costPerOrder = productCost + courierFee + packagingCost;
  const netProfitPerOrder = revenuePerOrder - costPerOrder;
  const profitMarginPercent = Math.round((netProfitPerOrder / sellingPrice) * 100);
  const monthlyTotalProfit = netProfitPerOrder * monthlyOrders;
  const monthlyRevenue = revenuePerOrder * monthlyOrders;

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-2xl border border-indigo-500/20">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            ඔබේ Store එකෙන් සල්ලි හොයන සැබෑ ක්‍රමය (Seller Blueprint)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            ඔබේම Online Store එකෙන් බඩු විකුණලා <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">මාසිකව ලක්ෂ ගණන්</span> උපයන්නේ මෙහෙමයි!
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            ඔබේ Platform එක අන් අයට විකිණීමට අමතරව, <strong>ඔබටම Store එකක් දමා</strong> භාණ්ඩ විකුණා ඉහළ ලාභයක් ලබාගන්නා සැබෑ පියවර 5 සහ Live Profit Calculator එක මෙන්න.
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Step by Step Real Process */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">පියවරෙන් පියවර බඩු විකුණන සැබෑ ක්‍රමවේදය (5 Steps)</h2>
            <p className="text-sm text-slate-500">කඩයක් දමා පළමු order එකේ සිට මුදල් අතට එනතෙක් සම්පූර්ණ ගමන</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">විකුණන්න බඩු හොයාගැනීම (Sourcing)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ඔබට ක්‍රම 3කින් භාණ්ඩ ලබාගත හැක:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>පිටකොටුව / පමුණුව (Wholesale):</strong> ඇඳුම්, accessories, bags තොග මිලට (උදා: රු. 1,200 කට ගෙන රු. 3,500 ට විකිණිය හැක).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Digital Products ($0 Cost):</strong> Canva templates, Notion planners, E-books (වියදම රුපියල් 0යි).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Local Creators:</strong> අතින් බඩු හදන (crafts, jewellery) අයගෙන් කොමිස් එකකට අරන් විකිණීම.</span>
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Store එකට බඩු දැමීම (Listing)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ඔබේ Store Admin Dashboard එකට ගොස්:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Phone එකෙන් ලස්සන Photos 2ක් 3ක් ගෙන upload කරන්න.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>අපේ Built-in <strong>"Generate with AI"</strong> ඔබා ආකර්ෂණීය Description එකක් ලබාගන්න.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>මිල (Price) සහ Sizes/Colors ඇතුළත් කර Save කරන්න. දැන් භාණ්ඩය Live!</span>
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">පාරිභෝගිකයින් ගෙන්වා ගැනීම (Traffic)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ads වලට රුපියලක්වත් වියදම් නොකර Organic Sales ගන්න හැටි:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>TikTok & Reels:</strong> භාණ්ඩය අතේ තියාගෙන, unpack කරන වීඩියෝ (Aesthetic reels) දිනපතා 1ක් දාන්න.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Bio එකේ ඔබේ Store Link එක දමන්න (උදා: <em>aurastudios.store</em>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>වීඩියෝ එකක් viral වූ විට මිනිසුන් link එක ඔබා කඩේට පැමිණේ.</span>
              </li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
              4
            </div>
            <h3 className="text-lg font-bold text-slate-900">Order එක ලැබීම සහ ගෙවීම (Payment)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Customer බඩුව තෝරා Checkout එකෙන් Order එක දමයි:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Bank Deposit නම්:</strong> Customer ඔබේ බැංකු ගිණුමට සල්ලි දමා Slip එක upload කරයි. ඔබ Dashboard එකෙන් බලා Verify කරයි.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>WhatsApp Order නම්:</strong> කෙළින්ම ඔබේ WhatsApp එකට message එක එයි.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Cash on Delivery (COD) නම්:</strong> බඩුව ලැබුණම මුදල් ගෙවයි.</span>
              </li>
            </ul>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4 md:col-span-2 lg:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-lg">
              5
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delivery කිරීම සහ මුදල් අතට ගැනීම (Fulfillment)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-indigo-600" />
                  භෞතික භාණ්ඩ (Physical Goods)
                </div>
                <p className="text-slate-600">
                  ලංකාවේ Courier සේවාවක් (Prompt Express, Koombiyo, Fardar හෝ Domex) අමතන්න. ඔවුන් ඔබේ නිවසටම පැමිණ පාර්සලය ගෙන ගොස් customer ට බාරදී COD මුදල් දින 2කින් ඔබේ බැංකු ගිණුමට දමයි.
                </p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  ඩිජිටල් භාණ්ඩ (Digital Files)
                </div>
                <p className="text-slate-600">
                  ඔබට කිසිම Courier කෙනෙක් අවශ්‍ය නැත! Customer මුදල් ගෙවූ සැනින් හෝ Bank Slip verify කළ සැනින් auto-download link එක screen එකට සහ email එකට යයි. සල්ලි කෙළින්ම ඔබේ අතේ!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Profit Simulator */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <DollarSign className="w-3.5 h-3.5" />
              Live Interactive Simulator
            </div>
            <h3 className="text-2xl font-black text-slate-900">සජීවී ලාභ ගණනය කිරීමේ කැල්කියුලේටරය (Profit Simulator)</h3>
            <p className="text-sm text-slate-500">ඔබේ භාණ්ඩයේ මිල ගණන් වෙනස් කර මාසිකව ලැබෙන සැබෑ ශුද්ධ ලාභය මෙතැනින් පරීක්ෂා කරන්න</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-right">
            <span className="text-xs text-emerald-700 font-semibold block">ශුද්ධ ලාභ ප්‍රතිශතය (Net Margin)</span>
            <span className="text-2xl font-black text-emerald-600">{profitMarginPercent}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* Input 1: Product Buy Cost */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>භාණ්ඩය ගත් තොග මිල (Product Cost Price):</span>
                <span className="text-indigo-600 font-bold">Rs. {productCost.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={10000} 
                step={100}
                value={productCost} 
                onChange={(e) => setProductCost(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-400">ඩිජිටල් භාණ්ඩයක් නම් මෙය රු. 0 දක්වා අඩු කරන්න</span>
            </div>

            {/* Input 2: Selling Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>පාරිභෝගිකයාට විකුණන මිල (Selling Price):</span>
                <span className="text-indigo-600 font-bold">Rs. {sellingPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min={500} 
                max={25000} 
                step={100}
                value={sellingPrice} 
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Input 3: Delivery fee from customer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Customer ගෙන් ගන්නා Delivery ගාස්තුව:</span>
                  <span className="text-slate-900 font-bold">Rs. {deliveryCharged}</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={1000} 
                  step={50}
                  value={deliveryCharged} 
                  onChange={(e) => setDeliveryCharged(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Courier එකට යන සැබෑ ගාස්තුව:</span>
                  <span className="text-slate-900 font-bold">Rs. {courierFee}</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={1000} 
                  step={50}
                  value={courierFee} 
                  onChange={(e) => setCourierFee(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Input 4: Monthly Orders */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>මසකට ලැබෙන Orders ගණන:</span>
                <span className="text-indigo-600 font-bold">{monthlyOrders} Orders (දිනකට ~{Math.round(monthlyOrders/30)})</span>
              </div>
              <input 
                type="range" 
                min={10} 
                max={500} 
                step={5}
                value={monthlyOrders} 
                onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">එක් භාණ්ඩයකින් ලාභය</span>
              <div className="text-3xl font-black text-emerald-400">
                Rs. {netProfitPerOrder.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 block">සියලු Courier සහ Packaging වියදම් අඩු කර</span>
            </div>

            <div className="h-px bg-slate-800" />

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">මාසික ශුද්ධ ලාභය (Monthly Net Income)</span>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Rs. {monthlyTotalProfit.toLocaleString()}
              </div>
              <p className="text-xs text-slate-300">
                (ඩොලර් වලින්: ~${Math.round(monthlyTotalProfit / 310)} USD)
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-xs space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>මාසික මුළු ආදායම:</span>
                <span className="font-semibold text-white">Rs. {monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform ගාස්තු:</span>
                <span className="font-semibold text-emerald-400">Rs. 0 (ඔබට නොමිලේ!)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
