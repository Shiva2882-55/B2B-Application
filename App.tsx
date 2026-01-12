
import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import { RetailerDashboard, SupplierAdminDashboard, SupportTerminal, ProfileSettings } from './components/Dashboards';
import { PaymentModal } from './components/PaymentModal';
import { UserRole, Order, OrderStatus, Product, CartItem, PaymentMethod, Address } from './types';
import { RebelBackend } from './backend';
import { ShoppingCart, X, Trash2, ShieldCheck, Package, CheckCircle2, Plus, Minus, Box, BrainCircuit, Factory, Warehouse, Truck, Home, Clock, Ticket, Tag, Info, ChevronRight, Activity } from 'lucide-react';
import { getSupplyChainInsights } from './geminiService';

const GST_RATE = 0.12;
const HANDLING_FEE = 150;

const MOCK_COUPONS: Record<string, { type: 'percent' | 'fixed', value: number, minOrder?: number, label: string }> = {
  'SAVE10': { type: 'percent', value: 0.1, label: '10% OFF Bulk Orders' },
  'WELCOME500': { type: 'fixed', value: 500, minOrder: 5000, label: '₹500 OFF on ₹5k+' },
  'REBEL': { type: 'fixed', value: 1000, minOrder: 15000, label: '₹1000 OFF on ₹15k+' }
};

const OrderTracker = ({ order }: { order: Order }) => {
  const stages = [
    { key: OrderStatus.PENDING, label: 'Placed', icon: CheckCircle2 },
    { key: OrderStatus.MANUFACTURER_DISPATCHED, label: 'Distributor -> REBEL', icon: Factory },
    { key: OrderStatus.HUB_RECEIVED, label: 'Arrived at Hub', icon: Warehouse },
    { key: OrderStatus.HUB_QUALITY_CHECK, label: 'Verified', icon: ShieldCheck },
    { key: OrderStatus.OUT_FOR_DELIVERY, label: 'In Transit', icon: Truck },
    { key: OrderStatus.DELIVERED, label: 'Received', icon: Home },
  ];

  const currentIndex = stages.findIndex(s => s.key === order.status);

  return (
    <div className="mt-8 space-y-10">
      <div className="flex items-center justify-between relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-1000"
          style={{ width: `${Math.max(0, (currentIndex / (stages.length - 1))) * 100}%` }}
        ></div>

        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                isActive ? 'bg-blue-600 text-white border-blue-100 scale-125 shadow-xl' :
                isCompleted ? 'bg-white text-blue-600 border-blue-50 shadow-md' :
                'bg-white text-slate-200 border-slate-50'
              }`}>
                <Icon size={18} />
              </div>
              <p className={`absolute top-12 text-[8px] font-black uppercase tracking-widest text-center w-24 ${isCompleted ? 'text-slate-900' : 'text-slate-300'}`}>
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Activity size={12} /> REBEL Logistics Log
        </p>
        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
           {order.logs.map(log => (
             <div key={log.id} className="flex justify-between items-start text-[11px] gap-4">
               <span className="text-slate-600 font-bold leading-relaxed">{log.details}</span>
               <span className="text-slate-300 font-medium shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.RETAILER);
  const [currentSection, setCurrentSection] = useState('Sourcing Terminal');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'info' | 'error', id: number} | null>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, amount: number } | null>(null);

  const [savedAddress, setSavedAddress] = useState<Address>({
    shopName: 'Local Retailer',
    street: 'Station Road, Shop #4',
    city: 'Mumbai',
    pincode: '400001',
    phone: '9820012345'
  });

  // Load backend data
  const refreshData = async () => {
    const p = await RebelBackend.getProducts();
    const o = await RebelBackend.getOrders();
    setProducts(p);
    setOrders(o);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Supply Chain Simulation Loop
  useEffect(() => {
    const timer = setInterval(async () => {
      const currentOrders = await RebelBackend.getOrders();
      let hasChange = false;

      for (const order of currentOrders) {
        if (order.status === OrderStatus.PENDING) {
          await RebelBackend.updateOrderStatus(order.id, OrderStatus.MANUFACTURER_DISPATCHED, "Distributor has dispatched to REBEL Hub.");
          hasChange = true;
        } else if (order.status === OrderStatus.MANUFACTURER_DISPATCHED) {
          await RebelBackend.updateOrderStatus(order.id, OrderStatus.HUB_RECEIVED, "Consignment received at REBEL Central Hub.");
          hasChange = true;
        } else if (order.status === OrderStatus.HUB_RECEIVED) {
          await RebelBackend.updateOrderStatus(order.id, OrderStatus.HUB_QUALITY_CHECK, "REBEL QC Team verified batch integrity.");
          hasChange = true;
        } else if (order.status === OrderStatus.HUB_QUALITY_CHECK) {
          await RebelBackend.updateOrderStatus(order.id, OrderStatus.OUT_FOR_DELIVERY, "Hub sorting complete. Last-mile carrier assigned.");
          hasChange = true;
        } else if (order.status === OrderStatus.OUT_FOR_DELIVERY && Math.random() > 0.7) {
          await RebelBackend.updateOrderStatus(order.id, OrderStatus.DELIVERED, "Package received and signed by Local Retailer.");
          hasChange = true;
        }
      }

      if (hasChange) {
        refreshData();
      }
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (currentSection === 'Analytics' && products.length > 0) {
      const fetchInsights = async () => {
        const data = await getSupplyChainInsights(products.slice(0, 5), activeRole);
        setInsights(data.recommendations);
      };
      fetchInsights();
    }
  }, [currentSection, products, activeRole]);

  const handleAddToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    const existing = cart.find(item => item.productId === product.id);
    const newQty = (existing?.quantity || 0) + quantity;
    
    if (newQty > product.stockLevel) {
      setNotification({ msg: "Insufficient Stock in Hub", type: 'error', id: Date.now() });
      return;
    }

    const discount = product.bulkDiscounts
      ?.filter(d => newQty >= d.minQty)
      .sort((a, b) => b.minQty - a.minQty)[0];
    
    const price = discount ? product.pricePerUnit * (1 - discount.discountPercent) : product.pricePerUnit;

    setCart(prev => {
      const exists = prev.find(i => i.productId === product.id);
      if (exists) return prev.map(i => i.productId === product.id ? { ...i, quantity: newQty, price } : i);
      return [...prev, { productId: product.id, productName: product.name, quantity, price, originalPrice: product.pricePerUnit, image: product.image }];
    });
    setNotification({ msg: `${product.name} added to Bag`, type: 'success', id: Date.now() });
  };

  const handleCompletePayment = async (method: PaymentMethod, address: Address) => {
    const newOrder: Order = {
      id: `REBEL-${Math.floor(100000 + Math.random() * 900000)}`,
      retailerName: address.shopName,
      items: [...cart],
      totalAmount: grandTotal,
      status: OrderStatus.PENDING,
      paymentMethod: method,
      address: address,
      createdAt: new Date().toISOString(),
      logs: [{
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        action: 'ORDER_PLACED',
        details: 'Retailer payment confirmed. Notifying Manufacturer/Distributor for hub dispatch.',
        type: 'SUCCESS'
      }]
    };

    await RebelBackend.saveOrder(newOrder);
    for (const item of cart) {
      await RebelBackend.updateProductStock(item.productId, item.quantity);
    }

    refreshData();
    setCart([]);
    setAppliedCoupon(null);
    setIsPaymentOpen(false);
    setIsCartOpen(false);
    setNotification({ msg: "Order Finalized. Hub process started.", type: 'success', id: Date.now() });
    setCurrentSection('Live Orders');
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalBaseValue = cart.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const bulkSavings = totalBaseValue - subtotal;
  const discountAmount = appliedCoupon ? appliedCoupon.amount : 0;
  const gstAmount = (subtotal - discountAmount) * GST_RATE;
  const grandTotal = Math.max(0, subtotal - discountAmount + gstAmount + (cart.length > 0 ? HANDLING_FEE : 0));

  return (
    <Router>
      <Layout 
        activeRole={activeRole} 
        onRoleChange={setActiveRole} 
        userName={activeRole === UserRole.RETAILER ? "Local Retailer" : "REBEL Logistics Hub"}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      >
        {activeRole === UserRole.SUPPLIER ? (
          <SupplierAdminDashboard products={products} orders={orders} onRefresh={refreshData} />
        ) : (
          (() => {
            switch (currentSection) {
              case 'Sourcing Terminal':
                return <RetailerDashboard products={products} orders={orders} cart={cart} onAddToCart={handleAddToCart} onOpenCheckout={() => setIsPaymentOpen(true)} />;
              case 'Live Orders':
                return (
                  <div className="space-y-8 max-w-7xl mx-auto pb-24">
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter">
                       <div className="w-2 h-10 bg-blue-600 rounded-full"></div> Supply Chain Tracking
                    </h2>
                    <div className="space-y-6">
                      {orders.length === 0 ? (
                        <div className="p-32 text-center text-slate-300 flex flex-col items-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                          <Package size={80} className="mb-6 opacity-20" />
                          <p className="font-black uppercase tracking-widest text-sm mb-6">No active hub consignments</p>
                          <button onClick={() => setCurrentSection('Sourcing Terminal')} className="px-10 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Start Sourcing</button>
                        </div>
                      ) : orders.map(order => (
                        <div key={order.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500">
                          <div onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center"><Box className="text-blue-500" /></div>
                              <div>
                                <p className="text-xl font-black text-slate-900">{order.id}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> Ordered {new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                               <div className="text-right">
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Grand Total</p>
                                  <p className="text-2xl font-black text-slate-900">₹{order.totalAmount.toLocaleString()}</p>
                               </div>
                               <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                                 order.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                               }`}>{order.status.replace(/_/g, ' ')}</span>
                            </div>
                          </div>
                          {expandedOrderId === order.id && (
                            <div className="px-10 pb-10 pt-4 border-t border-slate-50">
                               <OrderTracker order={order} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case 'Analytics':
                return (
                  <div className="space-y-12 max-w-7xl mx-auto">
                    <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white flex justify-between items-center relative overflow-hidden shadow-2xl">
                      <div className="z-10">
                        <h2 className="text-4xl font-black mb-3 flex items-center gap-4 tracking-tighter"><BrainCircuit size={44} /> REBEL Insights</h2>
                        <p className="text-slate-400 font-medium text-lg">Predictive inventory movement across our 3-tier network.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {insights.length > 0 ? insights.map((insight, idx) => (
                         <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col hover:border-blue-500 transition-all group">
                           <span className="self-start px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">{insight.urgency}</span>
                           <h3 className="text-2xl font-black text-slate-900 mt-8 mb-4">{insight.title}</h3>
                           <p className="text-slate-500 font-medium leading-relaxed flex-1 text-sm">{insight.description}</p>
                           <button className="mt-10 w-full py-5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">Optimize Flow</button>
                         </div>
                       )) : <div className="col-span-3 text-center py-20 text-slate-300 font-black uppercase tracking-widest">Aggregating Global Supply Chain Signals...</div>}
                    </div>
                  </div>
                );
              case 'Profile':
                return <ProfileSettings role={activeRole} userName={activeRole === UserRole.RETAILER ? "Local Retailer" : "REBEL Hub Master"} />;
              case 'Support':
                return <SupportTerminal />;
              default:
                return null;
            }
          })()
        )}

        {notification && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top fade-in duration-300">
            <div className={`px-10 py-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-3xl ${
              notification.type === 'success' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-white'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 size={24} /> : <Info size={24} />}
              <p className="text-xs font-black uppercase tracking-widest">{notification.msg}</p>
            </div>
          </div>
        )}

        {/* Global Bag (Retailer) */}
        <div className={`fixed inset-y-0 right-0 w-full max-md:max-w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-700 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4"><Activity className="text-blue-600" /> Sourcing Manifest</h3>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X size={28} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-white custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-20">
                  <Package size={120} className="mb-8" />
                  <p className="font-black uppercase tracking-widest text-[11px]">No items selected for procurement</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.productId} className="flex gap-6 p-6 rounded-[2.5rem] border border-slate-100 hover:border-blue-500 transition-all">
                      <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-slate-900 text-sm">{item.productName}</h4>
                          <button onClick={() => setCart(c => c.filter(i => i.productId !== item.productId))} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="px-4 py-2 bg-slate-100 rounded-xl text-[11px] font-black text-slate-900 uppercase">{item.quantity.toLocaleString()} units</span>
                           <p className="font-black text-slate-900 text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-10 bg-slate-50 border-t border-slate-100 space-y-8">
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-400 tracking-widest"><span>Net Bulk Value</span><span>₹{totalBaseValue.toLocaleString()}</span></div>
                   {bulkSavings > 0 && (
                     <div className="flex justify-between items-center text-[11px] font-black uppercase text-emerald-600 tracking-widest"><span>REBEL Saving Advantage</span><span>- ₹{bulkSavings.toLocaleString()}</span></div>
                   )}
                   <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-400 tracking-widest pb-4 border-b border-slate-200/50"><span>Network Logistics</span><span>₹{HANDLING_FEE}</span></div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[11px] text-slate-400 font-black uppercase mb-1">Estimated Invoice</p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">₹{grandTotal.toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => setIsPaymentOpen(true)} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-slate-300 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-4">Proceed to Checkout <ChevronRight size={24} /></button>
              </div>
            )}
          </div>
        </div>

        {isPaymentOpen && (
          <PaymentModal 
            amount={grandTotal} 
            initialAddress={savedAddress}
            appliedDiscount={discountAmount + bulkSavings}
            couponCode={appliedCoupon ? appliedCoupon.code : 'BULK'}
            onClose={() => setIsPaymentOpen(false)}
            onConfirm={handleCompletePayment}
          />
        )}
      </Layout>
    </Router>
  );
};

export default App;
