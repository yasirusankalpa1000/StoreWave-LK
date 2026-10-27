import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Crown, 
  Store, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Plus, 
  Check, 
  X, 
  ArrowUpRight, 
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { TenantStore } from '../types/store';

interface SuperAdminDashboardProps {
  tenants: TenantStore[];
  onAddTenant: (tenant: TenantStore) => void;
  onUpdateTenantStatus: (id: string, status: TenantStore['status']) => void;
  onSwitchToMerchant: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  tenants,
  onAddTenant,
  onUpdateTenantStatus,
  onSwitchToMerchant
}) => {
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newPlan, setNewPlan] = useState<'starter' | 'pro'>('starter');

  // Monetization calculations
  const totalStores = tenants.length;
  const payingStores = tenants.filter(t => t.plan !== 'free_owner' && t.status === 'active');
  const monthlyRecurringRevenue = payingStores.reduce((sum, t) => sum + t.monthlyFee, 0);
  const totalPlatformGMV = tenants.reduce((sum, t) => sum + t.monthlySales, 0);

  // Projections
  const [projectedStoresCount, setProjectedStoresCount] = useState<number>(100);
  const averagePlanPrice = 2500; // Rs. 2,500/mo
  const projectedMRR = projectedStoresCount * averagePlanPrice;

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName || !newOwnerName) return;

    const slug = newStoreName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTenant: TenantStore = {
      id: `store-${Date.now()}`,
      slug,
      name: newStoreName,
      ownerName: newOwnerName,
      ownerEmail: newOwnerEmail || `${slug}@business.lk`,
      plan: newPlan,
      monthlyFee: newPlan === 'starter' ? 2000 : 3500,
      status: 'active',
      productsCount: 0,
      monthlySales: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddTenant(newTenant);
    setIsAddStoreOpen(false);
    setNewStoreName('');
    setNewOwnerName('');
    setNewOwnerEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner: Owner God-Mode */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-indigo-500/30">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
            <Crown className="w-4 h-4 text-amber-400" />
            Super-Admin (Platform Owner Mode)
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            ඔබේ E-Commerce Software Platform එක පාලනය කරන Master Hub එක
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            ඔබේම Store එක මෙහි <strong>ජීවිත කාලයටම 100% නොමිලේ</strong> ක්‍රියාත්මක වන අතර, අනෙකුත් වෙළඳුන්ගෙන් මාසික කුලී (SaaS Subscriptions) ලබාගැනීම මෙතැනින් පාලනය කරන්න.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsAddStoreOpen(true)}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> අලුත් Client Store එකක් හදන්න
          </button>
          <button
            onClick={onSwitchToMerchant}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition flex items-center justify-center gap-2"
          >
            ඔබේ Store එකට යන්න →
          </button>
        </div>
      </div>

      {/* KPI Cards: Platform Business Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Monthly Subscription Revenue (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            Rs. {monthlyRecurringRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">ඔබට ලැබෙන මාසික මෘදුකාංග කුලිය</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Client Stores</span>
            <Store className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalStores} Stores</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            {payingStores.length} Paying Clients
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Merchandise Sold (GMV)</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            Rs. {(totalPlatformGMV / 100000).toFixed(1)} Lakhs
          </div>
          <div className="text-[11px] text-slate-400">Platform එක හරහා විකිණුන මුළු බඩු</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>ඔබේ පෞද්ගලික Store තත්ත්වය</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">100% Free</div>
          <div className="text-[11px] text-slate-400">Lifetime Owner Access</div>
        </div>
      </div>

      {/* Stores List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-slate-900 text-lg">Platform Stores & Tenants (සේවාලාභීන්)</h3>
            <p className="text-xs text-slate-500">ඔබේ platform එකෙන් කඩ සාදාගෙන සිටින ව්‍යාපාරිකයන් සහ ඔවුන්ගේ Subscription තත්ත්වය</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{tenants.length} Total Stores Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Store Name</th>
                <th className="py-3 px-4">Owner Contact</th>
                <th className="py-3 px-4">Plan & Monthly Fee</th>
                <th className="py-3 px-4">Monthly Sales</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map(store => (
                <tr key={store.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {store.plan === 'free_owner' && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{store.name}</span>
                    </div>
                    <span className="text-[10px] text-indigo-600 font-mono">/{store.slug}.store</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-800">{store.ownerName}</div>
                    <div className="text-slate-400 text-[10px]">{store.ownerEmail}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 capitalize">
                      {store.plan.replace('_', ' ')}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      {store.monthlyFee === 0 ? 'Free (Owner)' : `Rs. ${store.monthlyFee.toLocaleString()}/mo`}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-black text-slate-900">
                    Rs. {store.monthlySales.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                      store.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {store.status === 'active' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {store.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    {store.plan !== 'free_owner' && (
                      <button
                        onClick={() => onUpdateTenantStatus(store.id, store.status === 'active' ? 'suspended' : 'active')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                          store.status === 'active' 
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {store.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Subscription Scaling Calculator */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6 border border-indigo-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Software Subscription Earnings Simulator
          </div>
          <h3 className="text-2xl font-black">ඔබේ SaaS Platform එකෙන් උපයන ආදායම් පුරෝකථනය</h3>
          <p className="text-xs text-slate-300">ලංකාවේ කඩ හිමියන්ට මාසෙකට රු. 2,500 බැගින් ලබාදුනහොත් ඔබට ලැබෙන Passive Income එක:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold">
              <span>ලියාපදිංචි වන කඩ ගණන:</span>
              <span className="text-emerald-400 text-lg">{projectedStoresCount} Stores</span>
            </div>
            <input 
              type="range" 
              min={10} 
              max={1000} 
              step={10}
              value={projectedStoresCount} 
              onChange={(e) => setProjectedStoresCount(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>10 Stores</span>
              <span>250 Stores</span>
              <span>500 Stores</span>
              <span>1,000 Stores</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 border border-white/10 space-y-2 text-center md:text-right">
            <span className="text-xs text-indigo-300 uppercase tracking-wider font-semibold block">මාසික ස්ථාවර ආදායම (Monthly Recurring Income)</span>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
              Rs. {projectedMRR.toLocaleString()} / මසකට
            </div>
            <span className="text-xs text-slate-300 block">
              (වාර්ෂිකව: Rs. {(projectedMRR * 12).toLocaleString()})
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Add Client Store */}
      {isAddStoreOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl relative text-slate-900">
            <button 
              onClick={() => setIsAddStoreOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <h3 className="text-xl font-black">අලුත් Merchant කෙනෙකුට Store එකක් සෑදීම</h3>
            <p className="text-xs text-slate-500">කඩ හිමියාගේ විස්තර ඇතුළත් කර විනාඩියෙන් store එකක් නිකුත් කරන්න.</p>

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Store Name (කඩේ නම):</label>
                <input 
                  type="text" 
                  placeholder="e.g. Kandy Silks or Colombo Gadgets" 
                  required
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Owner Name (අයිතිකරුගේ නම):</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nuwan Kumara" 
                  required
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Owner Email:</label>
                <input 
                  type="email" 
                  placeholder="nuwan@gmail.com" 
                  value={newOwnerEmail}
                  onChange={(e) => setNewOwnerEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Subscription Plan:</label>
                <select 
                  value={newPlan} 
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="starter">Starter Plan (Rs. 2,000 / month)</option>
                  <option value="pro">Pro Plan (Rs. 3,500 / month)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md"
              >
                Create Store & Generate Access
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
