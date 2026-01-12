
import React, { useState } from 'react';
import { PaymentMethod, Address } from '../types';
import { CreditCard, Smartphone, CheckCircle2, Loader2, X, MapPin, Truck, ShieldCheck, ArrowRight, Banknote, Calendar, Lock, Info, Edit3, Bookmark, AlertCircle, Tag } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  initialAddress: Address;
  appliedDiscount?: number;
  couponCode?: string;
  onConfirm: (method: PaymentMethod, address: Address) => void;
  onClose: () => void;
}

type CheckoutStep = 'ADDRESS' | 'SELECT_METHOD' | 'DETAILS' | 'REVIEW';

const GST_RATE = 0.12;
const HANDLING_FEE = 150;

const PaymentLogo = ({ method }: { method: PaymentMethod }) => {
  switch (method) {
    case PaymentMethod.GPAY:
      return <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-4" alt="GPay" />;
    case PaymentMethod.PHONEPE:
      return <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/PhonePe_Logo.svg" className="h-6" alt="PhonePe" />;
    case PaymentMethod.PAYTM:
      return <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" className="h-4" alt="Paytm" />;
    case PaymentMethod.CREDIT_CARD:
      return <CreditCard size={20} />;
    case PaymentMethod.COD:
      return <Banknote size={20} />;
    default:
      return null;
  }
};

const PaymentOption = ({ id, label, selected, onSelect, color }: any) => (
  <button
    onClick={() => onSelect(id)}
    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
      selected ? `border-${color}-500 bg-${color}-50 shadow-md` : 'border-slate-100 hover:border-slate-200 bg-white'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected ? `bg-${color}-500 text-white shadow-lg` : 'bg-slate-50 text-slate-400'}`}>
        <PaymentLogo method={id} />
      </div>
      <div className="text-left">
        <span className={`font-black text-sm uppercase tracking-tight ${selected ? `text-${color}-900` : 'text-slate-600'}`}>{label}</span>
      </div>
    </div>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? `border-${color}-500 bg-${color}-500` : 'border-slate-100'}`}>
      {selected && <CheckCircle2 size={14} className="text-white" />}
    </div>
  </button>
);

export const PaymentModal: React.FC<PaymentModalProps> = ({ amount, initialAddress, appliedDiscount = 0, couponCode, onConfirm, onClose }) => {
  const [step, setStep] = useState<CheckoutStep>('ADDRESS');
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.GPAY);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<Address>(initialAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(!initialAddress.shopName);
  const [error, setError] = useState<string | null>(null);

  // Detail Fields
  const [upiPhone, setUpiPhone] = useState(initialAddress.phone || '');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

  // Reverse pricing for summary display
  const taxableAmountRaw = (amount - HANDLING_FEE) / (1 + GST_RATE);
  const gstRaw = taxableAmountRaw * GST_RATE;
  const subtotalRaw = taxableAmountRaw + appliedDiscount;

  const validateName = (name: string) => /^[a-zA-Z\s.-]{2,}$/.test(name);
  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateName(address.shopName)) { setError("Invalid Shop Name. Letters only."); return; }
    if (!validatePhone(address.phone)) { setError("Invalid mobile number. 10 digits required."); return; }
    if (!validateName(address.city)) { setError("Invalid City name."); return; }
    setIsEditingAddress(false);
    setStep('SELECT_METHOD');
  };

  const handleDetailsProceed = () => {
    setError(null);
    if ([PaymentMethod.GPAY, PaymentMethod.PHONEPE, PaymentMethod.PAYTM].includes(method)) {
      if (!validatePhone(upiPhone)) { setError("Valid 10-digit mobile number required."); return; }
    } else if (method === PaymentMethod.CREDIT_CARD) {
      if (!validateName(cardDetails.name)) { setError("Valid Name required on card."); return; }
      if (cardDetails.number.replace(/\s/g, '').length < 16) { setError("Valid 16-digit card number required."); return; }
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) { setError("MM/YY format required."); return; }
      if (cardDetails.cvv.length < 3) { setError("Valid CVV required."); return; }
    }
    setStep('REVIEW');
  };

  const getMethodColor = (m: PaymentMethod) => {
    switch (m) {
      case PaymentMethod.GPAY: return 'blue';
      case PaymentMethod.PHONEPE: return 'purple';
      case PaymentMethod.PAYTM: return 'sky';
      case PaymentMethod.CREDIT_CARD: return 'slate';
      case PaymentMethod.COD: return 'emerald';
      default: return 'slate';
    }
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => onConfirm(method, address), 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 'ADDRESS':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-3xl flex items-center gap-4 border border-blue-100">
              <Truck size={24} className="text-blue-600" />
              <div>
                <p className="text-sm font-black text-blue-900 uppercase">Dispatch Destination</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase">End-to-end Hub Delivery</p>
              </div>
            </div>
            {error && <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 animate-in fade-in"><AlertCircle size={18} /><p className="text-xs font-black uppercase">{error}</p></div>}
            
            {!isEditingAddress && address.shopName ? (
              <div className="space-y-6 animate-in fade-in">
                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl border border-white/5">
                  <div className="relative z-10">
                    <p className="text-xl font-black mb-1">{address.shopName}</p>
                    <p className="text-sm text-slate-400 font-medium">{address.street}, {address.city}, {address.pincode}</p>
                    <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                       <p className="text-sm font-bold text-slate-300">{address.phone}</p>
                       <button onClick={() => { setIsEditingAddress(true); setError(null); }} className="text-[10px] font-black uppercase text-blue-400 hover:underline"><Edit3 size={14} className="inline mr-1" /> Change</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep('SELECT_METHOD')} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-all">Deliver to this Shop <ArrowRight size={18} className="inline ml-2" /></button>
              </div>
            ) : (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <input required value={address.shopName} onChange={e => setAddress({...address, shopName: e.target.value.replace(/[0-9]/g, '')})} placeholder="Shop Name (Letters only)" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-900" />
                <input required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="Street Address" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-900" />
                <div className="grid grid-cols-2 gap-4">
                  <input required value={address.city} onChange={e => setAddress({...address, city: e.target.value.replace(/[0-9]/g, '')})} placeholder="City" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-900" />
                  <input required maxLength={6} value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value.replace(/\D/g, '')})} placeholder="Pincode" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-900" />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">+91</span>
                  <input required type="tel" maxLength={10} value={address.phone} onChange={e => setAddress({...address, phone: e.target.value.replace(/\D/g, '')})} placeholder="Mobile Number" className="w-full bg-slate-50 pl-12 p-4 rounded-xl font-bold text-slate-900" />
                </div>
                <div className="pt-2">
                   <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Save & Continue</button>
                </div>
              </form>
            )}
          </div>
        );

      case 'SELECT_METHOD':
        return (
          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Payable Amount</p>
              <p className="text-3xl font-black text-slate-900">₹{amount.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[PaymentMethod.GPAY, PaymentMethod.PHONEPE, PaymentMethod.CREDIT_CARD, PaymentMethod.COD].map(m => (
                <PaymentOption key={m} id={m} label={m.replace('_', ' ')} selected={method === m} onSelect={setMethod} color={getMethodColor(m)} />
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep('ADDRESS')} className="px-8 py-4 bg-slate-100 rounded-xl font-black text-[10px] text-slate-900">Back</button>
              <button onClick={() => setStep('DETAILS')} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase">Continue</button>
            </div>
          </div>
        );

      case 'DETAILS':
        const isUPI = [PaymentMethod.GPAY, PaymentMethod.PHONEPE].includes(method);
        const isCard = method === PaymentMethod.CREDIT_CARD;
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${getMethodColor(method)}-500 text-white`}><PaymentLogo method={method} /></div>
              <p className="text-sm font-black text-slate-900 uppercase">{method.replace('_', ' ')} Details</p>
            </div>
            {error && <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 animate-in fade-in"><AlertCircle size={18} /><p className="text-xs font-black uppercase">{error}</p></div>}
            {isUPI && (
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">+91</span>
                  <input type="tel" maxLength={10} value={upiPhone} onChange={e => setUpiPhone(e.target.value.replace(/\D/g, ''))} className="w-full bg-slate-50 border-none pl-12 p-4 rounded-xl font-black text-lg text-slate-900" placeholder="Mobile Number" />
                </div>
              </div>
            )}
            {isCard && (
              <div className="space-y-4">
                <input value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value.replace(/[0-9]/g, '').toUpperCase()})} className="w-full bg-slate-50 p-4 rounded-xl font-bold uppercase text-slate-900" placeholder="NAME ON CARD" />
                <input value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim()})} className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-900" placeholder="CARD NUMBER" />
                <div className="grid grid-cols-2 gap-4">
                  <input value={cardDetails.expiry} onChange={e => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                    setCardDetails({...cardDetails, expiry: val.slice(0, 5)});
                  }} className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-900" placeholder="MM/YY" />
                  <input type="password" value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})} className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-900" placeholder="CVV" />
                </div>
              </div>
            )}
            {method === PaymentMethod.COD && <div className="p-8 bg-emerald-50 rounded-2xl text-center border border-emerald-100"><Banknote size={40} className="mx-auto text-emerald-600 mb-2" /><p className="font-black text-emerald-900 uppercase">Cash on Delivery Enabled</p></div>}
            <div className="flex gap-3">
              <button onClick={() => setStep('SELECT_METHOD')} className="px-8 py-4 bg-slate-100 rounded-xl font-black text-[10px] text-slate-900">Back</button>
              <button onClick={handleDetailsProceed} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase">Final Summary</button>
            </div>
          </div>
        );

      case 'REVIEW':
        return (
          <div className="space-y-6">
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
              <div className="flex justify-between items-center"><h3 className="font-black text-slate-900 uppercase">Order Summary</h3><ShieldCheck className="text-emerald-600" size={24} /></div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-inner space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400"><span>Subtotal</span><span>₹{subtotalRaw.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-emerald-600">
                      <span className="flex items-center gap-1"><Tag size={10}/> Discount ({couponCode})</span>
                      <span>- ₹{appliedDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400"><span>GST (12%)</span><span>₹{gstRaw.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 pb-2 border-b border-slate-50"><span>Hub Handling</span><span>₹{HANDLING_FEE}</span></div>
                  <div className="flex justify-between items-center pt-2 font-black"><p className="text-xs uppercase text-slate-900">Final Payable</p><p className="text-xl text-blue-600">₹{amount.toLocaleString()}</p></div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100">
                  <MapPin size={16} className="text-slate-400 mt-1" />
                  <div><p className="font-black text-xs text-slate-900">{address.shopName}</p><p className="text-[10px] text-slate-500">{address.city} - {address.pincode}</p></div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setStep('DETAILS')} className="px-8 py-5 bg-slate-100 rounded-2xl font-black uppercase text-[10px] text-slate-900">Back</button>
               <button onClick={handlePay} disabled={isProcessing} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-xl disabled:opacity-50">
                 {isProcessing ? <Loader2 size={20} className="animate-spin inline mr-2" /> : "Place Bulk Order"}
               </button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center shrink-0">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">REBEL Checkout</h3>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors"><X size={28} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">{renderStep()}</div>
      </div>
    </div>
  );
};