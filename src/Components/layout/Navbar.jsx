import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../../data/products';
import { 
  Phone, Mail, ShoppingBag, Menu, X, User, Search, ChevronDown, 
  ShieldCheck, LogOut, Video, LayoutDashboard 
} from 'lucide-react';

export const Navbar = ({ 
  currentPage, onNavigate, cartCount, selectedCategory, onSelectCategory 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem('dh_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkUser();
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.removeItem('dh_token');
    localStorage.removeItem('dh_user');
    setUser(null);
    onNavigate('home');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'industries', label: 'Industries' },
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'products-drones', label: 'Drones', category: 'drones' },
    { id: 'tutorials', label: 'Flight Academy' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (link) => {
    if (link.category) {
      onSelectCategory(link.category);
      onNavigate('shop');
    } else {
      onNavigate(link.id);
    }
    setMobileMenuOpen(false);
  };

  const isActive = (link) => {
    if (link.id === 'home') return currentPage === 'home';
    if (link.id === 'shop') return currentPage === 'shop' && selectedCategory === 'all';
    if (link.id === 'services') return currentPage === 'services';
    if (link.id === 'contact') return currentPage === 'contact';
    if (link.id === 'tutorials') return currentPage === 'tutorials';
    if (link.id === 'about') return currentPage === 'about';
    if (link.id === 'industries') return currentPage === 'industries';
    if (link.id === 'projects') return currentPage === 'projects';
    if (link.category) {
      return (currentPage === 'shop' || currentPage === 'products') && selectedCategory === link.category;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Utility Bar */}
      <div className="border-b border-slate-800/80 text-xs text-slate-400 py-2 px-4 sm:px-8 bg-slate-950/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Mackay, QLD — Central Logistics Hub
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              Crews: Mackay · Brisbane · Gold Coast · Sydney
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-slate-300 font-semibold hover:text-cyan-400 transition-colors">
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-[11px] font-mono text-slate-400">
              ABN {COMPANY_INFO.abn}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-slate-800/60 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <div onClick={() => onNavigate('home')} className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <span className="text-slate-950 font-black text-sm">DH</span>
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                DroneHub
              </span>
              <span className="text-[10px] font-bold text-cyan-400 ml-1.5 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                AUSTRALIA
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive(link)
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* User Login / Admin Button */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.is_admin && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Admin Panel</span>
                  </button>
                )}

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold">{user.name.split(' ')[0]}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentPage === 'auth'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className={`relative p-2.5 rounded-xl transition-all ${
                currentPage === 'cart'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F172A] border-b border-slate-800 px-4 py-3 space-y-1 shadow-2xl backdrop-blur-xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive(link) ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 font-bold' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          {user?.is_admin && (
            <button
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-cyan-300 bg-slate-800/90 border border-cyan-500/30 flex items-center gap-2 mt-2"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Go to Admin Dashboard</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
