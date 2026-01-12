
import React, { useState, useEffect } from 'react';
import { OrderStatus, Order, Product, CartItem, Address, UserRole, AuditLog } from '../types';
import { RebelBackend } from '../backend';
// Fixed error: Cannot find name 'Warehouse' by adding it to lucide-react imports.
import { Package, ShieldCheck, Zap, ArrowRight, Box, ShoppingCart, Plus, Minus, ImageOff, MapPin, Building, AlertCircle, Headphones, MessageSquare, AlertTriangle, Cpu, CheckCircle2, Loader2, Send, Tag, ChevronRight, Bell, Shield, LogOut, CreditCard, Info, Activity, RefreshCw, Warehouse } from 'lucide-react';
import { analyzeSupportIssue } from '../geminiService';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const ProductImage = ({ src, alt }: { src: string, alt: string }) => {
  const [error, setError] = React.useState(false);
  if (error) return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
      <ImageOff size={40} className="mb-2 opacity-50" />
    </div>
  );
  return <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={alt} onError={() => setError(true)} />;
};

const SourcingProductCard = ({ product, cartQuantity, onAdd }: { product: Product, cartQuantity: number, onAdd: (q: number) => void }) => {
  const [localQty, setLocalQty] = useState(100);
  const isInvalid = localQty <= 0 || localQty > product.stockLevel;
  const currentDiscount = product.bulkDiscounts?.filter(d => localQty >= d.minQty).sort((a, b) => b.minQty - a.minQty)[0];
  const currentUnitPrice = currentDiscount ? product.pricePerUnit * (1 - currentDiscount.discountPercent) : product.pricePerUnit;

  return (
    <div className="group bg-white rounded-[3rem] border border-slate-100 p-8 hover:border-blue-500 hover:shadow-2xl transition-all flex flex-col relative overflow-hidden">
      <div className="relative rounded-[2.5rem] overflow-hidden mb-6 aspect-[4/3] bg-slate-50 flex items-center justify-center border border-slate-100">
        <ProductImage src={product.image} alt={product.name} />
        <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
          {product.category}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-black text-slate-900 text-xl leading-tight mb-2">{product.name}</h4>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span className="text-blue-600">{product.manufacturer}</span>
          <span>|</span>
          <span className="text-slate-900 font-black">{product.packaging}</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] mb-6">
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Bulk Unit Price</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-slate-900">₹{currentUnitPrice.toFixed(2)}</p>
            {currentDiscount && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">SAVE {(currentDiscount.discountPercent * 100).toFixed(0)}%</span>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-black uppercase mb-1">In Hub</p>
          <p className="text-lg font-black text-slate-900">{product.stockLevel.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex items-center bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <button onClick={() => setLocalQty(Math.max(1, localQty - 100))} className="p-4 hover:bg-slate-50 transition-colors"><Minus size={18} /></button>
          <input type="number" value={localQty} onChange={e => setLocalQty(parseInt(e.target.value) || 0)} className="w-full bg-transparent border-none text-center font-black text-slate-900 text-lg" />
          <button onClick={() => setLocalQty(Math.min(product.stockLevel, localQty + 100))} className="p-4 hover:bg-slate-50 transition-colors"><Plus size={18} /></button>
        </div>
        <button onClick={() => onAdd(localQty)} disabled={isInvalid} className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg">Reserve Bulk Consignment</button>
      </div>
    </div>
  );
};

export const RetailerDashboard = ({ products, orders, cart, onAddToCart }: any) => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-950 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">REBEL SOURCING</h1>
          <p className="text-slate-400 font-medium tracking-wide text-lg max-w-xl">Centralized procurement directly from a verified distributor network. Quality-checked at REBEL Hub before final dispatch.</p>
        </div>
        <div className="flex gap-4 z-10 flex-wrap justify-center">
          <StatCard title="Procured Value" value={`₹${orders.reduce((a:any,b:any)=>a+b.totalAmount, 0).toLocaleString()}`} icon={Zap} color="bg-blue-600 text-white" />
          <StatCard title="Hub Shipments" value={orders.length} icon={Package} color="bg-emerald-500 text-white" />
        </div>
        <div className="absolute right-[-50px] top-[-50px] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((p: any) => (
          <SourcingProductCard key={p.id} product={p} cartQuantity={cart.find((c:any) => c.productId === p.id)?.quantity || 0} onAdd={(qty: number) => onAddToCart(p, qty)} />
        ))}
      </div>
    </div>
  );
};

// Fixed error in App.tsx by adding the 'role' prop to ProfileSettings type definition.
export const ProfileSettings = ({ userName, role }: { userName: string, role?: UserRole }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="w-32 h-32 rounded-[2.5rem] bg-slate-950 border-4 border-slate-50 shadow-2xl overflow-hidden shrink-0">
          <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${userName}`} alt="User profile" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{userName}</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> Platinum Verified Network Entity
          </p>
          <div className="mt-4 flex gap-4 justify-center md:justify-start">
             <span className="px-4 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-100">Joined Jan 2025</span>
             <span className="px-4 py-1.5 bg-blue-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-600 border border-blue-100">Tier: Master</span>
          </div>
        </div>
        <button className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">System Preferences</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
             <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3"><Building size={20} className="text-blue-600" /> Organization Data</h3>
             <div className="grid grid-cols-2 gap-8">
               <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Entity Name</p><p className="font-bold text-slate-900 text-lg">REBEL Retail Solutions</p></div>
               <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Network ID</p><p className="font-black text-blue-600 text-lg">REB-HUB-40021</p></div>
             </div>
             <div className="pt-8 border-t border-slate-50">
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Primary Sourcing Hub</p>
               <p className="text-slate-600 text-sm font-medium leading-relaxed">Central Logistics Center B, Industrial Area Sector 2, Mumbai - 400012, India.</p>
             </div>
           </div>
        </div>
        <div className="space-y-8">
          <div className="bg-slate-950 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black uppercase tracking-tight relative z-10">Access Terminal</h3>
            <div className="space-y-4 relative z-10">
               <button className="w-full flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                  <span className="font-bold text-xs uppercase tracking-widest">Update Security Keys</span>
                  <Shield size={16} className="text-blue-400" />
               </button>
               <button onClick={() => RebelBackend.resetSystem()} className="w-full py-5 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-2xl font-black uppercase tracking-widest text-[10px] mt-4 flex items-center justify-center gap-3 hover:bg-rose-600 hover:text-white transition-all">
                 <RefreshCw size={16} /> Reset Backend Store
               </button>
            </div>
            <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SupportTerminal = () => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await analyzeSupportIssue({ type: 'Supply Chain Interruption', description });
    setAnalysis(result);
    setIsSubmitting(false);
    setDescription('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white flex justify-between items-center relative overflow-hidden shadow-2xl">
        <div className="z-10">
          <h2 className="text-4xl font-black mb-3 flex items-center gap-4 uppercase"><Headphones size={40} className="text-blue-500" /> Resolution Desk</h2>
          <p className="text-slate-400 font-medium text-lg max-w-lg">AI-driven logistics troubleshooting for end-to-end partner movement.</p>
        </div>
        <div className="absolute right-[-50px] top-[-50px] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 h-fit">
           <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3"><AlertTriangle className="text-amber-500" /> Log Sourcing Incident</h3>
           <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the supply chain blockage (e.g., Distributor delay at Hub entry)..." className="w-full h-56 bg-slate-50 border-none rounded-[2.5rem] p-8 font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all resize-none shadow-inner" />
           <button disabled={isSubmitting} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all">
             {isSubmitting ? <Loader2 className="animate-spin" /> : <>Analyze with REBEL AI <Send size={18} /></>}
           </button>
        </form>
        <div className="space-y-8">
          {analysis ? (
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8 animate-in slide-in-from-bottom-5">
                <div className="flex justify-between items-center"><h3 className="text-xl font-black uppercase text-slate-900">Triage Intelligence</h3><span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${analysis.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{analysis.severity} PRIORITY</span></div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] italic text-slate-600 text-sm leading-relaxed border border-slate-100 shadow-inner">"{analysis.technicalBrief}"</div>
                <div className="space-y-3">
                   {analysis.suggestions.map((s:string, i:number) => (
                     <div key={i} className="flex gap-4 p-5 bg-blue-50 rounded-[1.5rem] border border-blue-100 items-center">
                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-[11px] font-black shrink-0">{i+1}</span>
                        <p className="text-xs font-bold text-blue-900 uppercase leading-snug">{s}</p>
                     </div>
                   ))}
                </div>
             </div>
          ) : (
            <div className="h-[400px] bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center p-20 text-center opacity-30 shadow-sm">
               <Activity size={100} className="mb-8 text-slate-400" />
               <p className="font-black uppercase tracking-widest text-[11px]">System standby. Awaiting telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SupplierAdminDashboard = ({ products, orders, onRefresh }: any) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => setLogs(await RebelBackend.getAuditLogs());
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async (id: string, status: OrderStatus) => {
    await RebelBackend.updateOrderStatus(id, status);
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-center bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-200">
             <Warehouse size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">HUB OPERATIONS</h1>
            <p className="text-slate-500 font-medium tracking-wide">Manufacturer -> Distributor -> REBEL Hub -> Retailer Management Console</p>
          </div>
        </div>
        <div className="flex gap-8 px-10 border-l border-slate-100">
           <div className="text-right">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Network SKU</p>
             <p className="text-2xl font-black text-slate-900">{products.length}</p>
           </div>
           <div className="text-right">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">In-Hub Queue</p>
             <p className="text-2xl font-black text-slate-900">{orders.filter((o:any) => o.status !== OrderStatus.DELIVERED).length}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center shrink-0">
             <h3 className="font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3"><Box className="text-blue-600" /> Active Consignments</h3>
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[8px] font-black rounded-full uppercase">Processing</span>
             </div>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 z-10">
                <tr>
                  <th className="px-10 py-6">ID / Retailer</th>
                  <th className="px-10 py-6">Current Logistics Stage</th>
                  <th className="px-10 py-6 text-right">Value</th>
                  <th className="px-10 py-6 text-right">Hub Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.length === 0 ? (
                  <tr><td colSpan={4} className="p-20 text-center text-slate-300 uppercase font-black tracking-widest">No active flow</td></tr>
                ) : orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <p className="font-black text-slate-900">{o.id}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{o.retailerName}</p>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        o.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right font-black text-slate-900">₹{o.totalAmount.toLocaleString()}</td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {o.status !== OrderStatus.DELIVERED && (
                           <button onClick={() => handleUpdate(o.id, OrderStatus.DELIVERED)} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"><CheckCircle2 size={16} /></button>
                         )}
                         <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><Info size={16} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-950 rounded-[3.5rem] text-white flex flex-col h-[700px] shadow-2xl relative overflow-hidden">
          <div className="p-10 border-b border-white/5 bg-white/5 flex items-center justify-between shrink-0">
            <h3 className="font-black uppercase tracking-widest flex items-center gap-3 text-emerald-400"><Activity size={20} /> Network Audit Trail</h3>
            <span className="text-[8px] font-black text-slate-500 uppercase">Live Telemetry</span>
          </div>
          <div className="flex-1 overflow-auto p-10 space-y-8 custom-scrollbar">
            {logs.length === 0 ? (
               <div className="h-full flex items-center justify-center text-slate-700 italic text-sm">Initializing Hub Sensors...</div>
            ) : logs.map(log => (
              <div key={log.id} className="space-y-2 border-l border-white/10 pl-8 relative pb-2">
                 <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-blue-600 shadow-xl shadow-blue-500/50"></div>
                 <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-wider">{log.action}</p>
                    <span className="text-[8px] text-slate-600 font-bold">{new Date(log.timestamp).toLocaleTimeString()}</span>
                 </div>
                 <p className="text-xs text-slate-300 font-medium leading-relaxed">{log.details}</p>
              </div>
            ))}
          </div>
          <div className="absolute bottom-[-150px] left-[-150px] w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]"></div>
        </div>
      </div>
    </div>
  );
};
