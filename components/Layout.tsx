
import React, { useState } from 'react';
import { UserRole } from '../types';
import { LayoutDashboard, Package, TrendingUp, Headphones, UserCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userName: string;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRole, onRoleChange, userName, currentSection, onSectionChange }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Sourcing Terminal', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Orders', icon: <Package size={20} /> },
    { name: 'Analytics', icon: <TrendingUp size={20} /> },
    { name: 'Profile', icon: <UserCircle size={20} /> },
    { name: 'Support', icon: <Headphones size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-slate-950 text-white transition-all duration-500 flex flex-col z-20`}>
        <div className="p-10 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">R</div>
          {isSidebarOpen && <span className="font-black text-2xl tracking-tighter uppercase">REBEL</span>}
        </div>

        <nav className="flex-1 mt-6 px-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => onSectionChange(item.name)}
              className={`w-full flex items-center gap-5 px-4 py-4 rounded-2xl transition-all group ${
                currentSection === item.name 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`transition-transform ${currentSection === item.name ? 'scale-110' : 'group-hover:scale-125'}`}>
                {item.icon}
              </div>
              {isSidebarOpen && <span className="font-bold text-sm tracking-wide">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-6 border border-white/5">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Environment</div>
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="w-full bg-slate-900 text-xs font-black p-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition-all uppercase tracking-widest cursor-pointer"
            >
              <option value={UserRole.RETAILER}>Retailer Interface</option>
              <option value={UserRole.SUPPLIER}>Supplier Admin</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col bg-slate-50/50">
        {/* Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-24 flex items-center justify-between px-10 sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-slate-900 transition-colors p-2"
          >
            <div className="w-6 h-0.5 bg-current mb-1.5"></div>
            <div className="w-4 h-0.5 bg-current mb-1.5"></div>
            <div className="w-6 h-0.5 bg-current"></div>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="px-6 py-2 bg-slate-100 rounded-full">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{currentSection}</span>
            </div>
            <div className="flex items-center gap-6 ml-4">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">{userName}</p>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Verified {activeRole}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform" onClick={() => onSectionChange('Profile')}>
                <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${userName}`} alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;