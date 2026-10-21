import React, { useState, useEffect, useMemo } from 'react';
import { productStore } from '../services/productStore';
import { session } from '../services/api';
import { ShopProductCard } from '../Components/product/ShopProductCard';
import { CategoryExcelManager } from '../Components/admin/CategoryExcelManager';
import {
  Layers, Plane, Battery, Wrench, Package, Search,
  SlidersHorizontal, ChevronLeft, ChevronRight, X,
  FileSpreadsheet, ShieldAlert, Sparkles, Filter, Check,
  RotateCcw, ArrowUpDown, Tag, Info, ShoppingBag
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export const Shop = ({
  onNavigate,
  onSelectProduct,
  onAddToCart,
  initialCategory = 'all'
}) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'name-asc'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState('all'); // 'all', 'under500', '500-2k', '2k-10k', '10k+'
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Admin Excel Modal & Delete Mode
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [deleteToast, setDeleteToast] = useState(null);

  // Load products & subscribe to changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const loaded = await productStore.getAll();
        if (!cancelled) setProducts(loaded);
      } catch (err) {
        console.error('Failed to load catalogue:', err);
      }
    };

    load();

    const unsub = productStore.subscribe((updated) => {
      setProducts(updated || []);
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  // Admin tools & the signed-in customer's tier come from the session.
  useEffect(() => {
    setIsAdminMode(session.isAdmin());
    setActiveUserRole(session.getRole());
  }, []);

  // When category changes, reset subcategory and page to 1
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('all');
    setCurrentPage(1);
  };

  const handleSubcategorySelect = (subId) => {
    setSelectedSubcategory(subId);
    setCurrentPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, inStockOnly, priceRange]);

  // Handle single product delete (admin only)
  const handleDeleteProduct = async (id) => {
    const target = products.find(p => p.id === id);
    if (!window.confirm(`Delete "${target?.name || 'Product'}"?`)) return;
    try {
      await productStore.delete(id);
      setDeleteToast(`Deleted "${target?.name || 'Product'}"`);
    } catch (err) {
      setDeleteToast(`Delete failed: ${err.message}`);
    }
    setTimeout(() => setDeleteToast(null), 3000);
  };

  // Main Categories List with real live counts
  const categoriesList = useMemo(() => {
    return [
      { id: 'all', label: 'All Products', icon: Layers, count: products.length },
      { id: 'drones', label: 'Commercial Drones', icon: Plane, count: products.filter(p => p.category === 'drones').length },
      { id: 'accessories', label: 'Accessories & Payloads', icon: Battery, count: products.filter(p => p.category === 'accessories').length },
      { id: 'parts', label: 'Genuine Spare Parts', icon: Wrench, count: products.filter(p => p.category === 'parts').length },
      { id: 'combos', label: 'Turnkey Combos', icon: Package, count: products.filter(p => p.category === 'combos').length },
    ];
  }, [products]);

  // Derived subcategories for current category (or all)
  const availableSubcategories = useMemo(() => {
    const scoped = selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    const subMap = {};
    scoped.forEach((p) => {
      const sub = p.subcategory || 'General';
      subMap[sub] = (subMap[sub] || 0) + 1;
    });

    const list = Object.entries(subMap).map(([sub, count]) => ({
      id: sub,
      label: sub,
      count
    }));

    // Sort by count descending
    list.sort((a, b) => b.count - a.count);

    return [{ id: 'all', label: 'All Subcategories', count: scoped.length }, ...list];
  }, [products, selectedCategory]);

  const [activeUserRole, setActiveUserRole] = useState('all'); // 'all', 'normal', 'wholesale', 'agent'

  // The price a customer actually pays for a product.
  const effectivePriceFor = (p) => {
    if (activeUserRole === 'wholesale' && p.role_prices?.wholesale) return p.role_prices.wholesale;
    if (activeUserRole === 'agent' && p.role_prices?.agent) return p.role_prices.agent;
    if (activeUserRole === 'normal' && p.role_prices?.normal != null) return p.role_prices.normal;
    return p.price_cents || 0;
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 0. Role-based visibility filter
      if (activeUserRole !== 'all') {
        const roles = p.visibility_roles || ['normal', 'wholesale', 'agent'];
        if (!roles.includes(activeUserRole)) {
          return false;
        }
      }

      // 1. Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // 2. Subcategory filter
      if (selectedSubcategory !== 'all' && (p.subcategory || p.part_section || 'General') !== selectedSubcategory) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesSku = (p.sku || p.model_number || '').toLowerCase().includes(q);
        const matchesBrand = (p.brand || '').toLowerCase().includes(q);
        const matchesSub = (p.subcategory || p.part_section || '').toLowerCase().includes(q);
        const matchesDrone = (p.drone_name || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesBrand && !matchesSub && !matchesDrone) {
          return false;
        }
      }

      // 4. In-stock filter
      if (inStockOnly && (p.stock_qty || 0) <= 0) {
        return false;
      }

      // 5. Price range filter (uses the price this customer actually pays)
      const priceAud = effectivePriceFor(p) / 100;
      if (priceRange === 'under500' && priceAud >= 500) return false;
      if (priceRange === '500-2k' && (priceAud < 500 || priceAud > 2000)) return false;
      if (priceRange === '2k-10k' && (priceAud < 2000 || priceAud > 10000)) return false;
      if (priceRange === '10k+' && priceAud <= 10000) return false;

      return true;
    }).sort((a, b) => {
      const getPrice = (item) => effectivePriceFor(item);

      if (sortBy === 'price-low') {
        return getPrice(a) - getPrice(b);
      }
      if (sortBy === 'price-high') {
        return getPrice(b) - getPrice(a);
      }
      if (sortBy === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0; // default order
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, inStockOnly, priceRange, sortBy, activeUserRole]);

  // Pagination calculation (10 products per page as requested)
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setSortBy('default');
    setInStockOnly(false);
    setPriceRange('all');
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#0F172A] min-h-screen text-slate-100 pb-24">
      {/* Delete Feedback Toast */}
      {deleteToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-rose-950 border border-rose-700 text-rose-200 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="text-sm font-semibold">{deleteToast}</span>
        </div>
      )}

      {/* Admin Excel Upload & Management Modal */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl my-auto max-h-[90vh] overflow-y-auto rounded-3xl">
            <CategoryExcelManager
              onClose={() => setShowExcelModal(false)}
              onProductsChanged={(updated) => setProducts(updated)}
            />
          </div>
        </div>
      )}

      {/* Top Hero / Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#0F172A] border-b border-slate-800/80 pt-10 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Australia's Official Enterprise Drone Store</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                DroneHub Hardware & Spares Shop
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-3xl mt-1">
                Explore commercial spray airframes, mining RTK inspection platforms, authentic replacement parts, and high-energy batteries with Australia-wide dispatch.
              </p>
            </div>

            {/* Admin Excel & Control Bar */}
            {isAdminMode && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowExcelModal(true)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 border border-cyan-400/40"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Admin Excel Upload & Demo Export</span>
                </button>

                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isAdminMode
                      ? 'bg-rose-950/60 border-rose-600 text-rose-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Toggle delete action on product cards"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin Quick Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Search and Mobile Filter Toggle */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by model, SKU, brand, or component..."
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-cyan-500 transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 text-cyan-400"
            >
              <Filter className="w-4 h-4" />
              <span>Filter Categories ({filteredProducts.length})</span>
            </button>
          </div>

          {/* User Tier & Pricing Mode Selector */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            {isAdminMode ? (
              <>
                <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                  Admin Preview:
                </span>
                {[
                  { id: 'all', label: 'Full Catalog (All Tiers)' },
                  { id: 'normal', label: 'Retail Customer' },
                  { id: 'wholesale', label: 'Wholesale Dealer (ABN)' },
                  { id: 'agent', label: 'Service Partner Agent' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setActiveUserRole(tier.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs transition-all font-semibold ${
                      activeUserRole === tier.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 font-semibold">
                {activeUserRole === 'wholesale'
                  ? 'Wholesale (ABN) pricing applied'
                  : activeUserRole === 'agent'
                  ? 'Service Agent pricing applied'
                  : 'Retail pricing applied'}
                {!session.isLoggedIn() && ' — sign in for your account pricing'}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Shop Body: Sidebar on the side + 10-Item Paginated Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* ======================================================== */}
          {/* LEFT SIDEBAR: Categories & Subcategories Filter Panel     */}
          {/* ======================================================== */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-80 bg-slate-950 p-6 overflow-y-auto transform transition-transform duration-300 border-r border-slate-800
            lg:relative lg:translate-x-0 lg:w-72 lg:bg-slate-900/40 lg:p-6 lg:rounded-3xl lg:border lg:border-slate-800/80 lg:backdrop-blur-sm lg:shrink-0
            ${mobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 lg:hidden mb-6">
              <span className="font-bold text-sm text-white">Filter Catalog</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-7">
              {/* Reset Filters Quick Button */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Filter Catalog
                </span>
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>

              {/* 1. Main Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Category</span>
                </label>
                <div className="space-y-1">
                  {categoriesList.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                            : 'bg-slate-950/60 hover:bg-slate-800/60 text-slate-300 border border-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                          <span>{cat.label}</span>
                        </div>
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Sub-Category Selector ("category golo sub category select er option tkabe") */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sub-Category</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {availableSubcategories.length - 1} types
                  </span>
                </div>

                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {availableSubcategories.map((sub) => {
                    const isSelected = selectedSubcategory === sub.id;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubcategorySelect(sub.id)}
                        className={`w-full py-2 px-3 rounded-lg text-xs flex items-center justify-between text-left transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="truncate pr-2">{sub.label}</span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {sub.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Price Range (AUD)</span>
                </label>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under500', label: 'Under $500' },
                    { id: '500-2k', label: '$500 – $2,000' },
                    { id: '2k-10k', label: '$2,000 – $10,000' },
                    { id: '10k+', label: '$10,000+' },
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => setPriceRange(pr.id)}
                      className={`py-1.5 px-3 rounded-lg text-left transition-colors ${
                        priceRange === pr.id
                          ? 'bg-slate-800 text-cyan-400 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. In Stock Filter Toggle */}
              <div className="pt-2 border-t border-slate-800/80">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-xs font-semibold text-slate-300">In-Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded-sm bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                </label>
              </div>

              {/* 5. Sort By Option */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-xs font-semibold text-slate-300">Sort Products</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                >
                  <option value="default">Default Catalog Order</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Product Name: A to Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* MAIN COLUMN: Results Header + 10 Products Grid + Pagination */}
          {/* ======================================================== */}
          <main className="flex-1 w-full space-y-6">
            
            {/* Results Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-white">
                  {filteredProducts.length} Products Found
                </span>
                <span>•</span>
                <span>Showing 10 items per page</span>
                {selectedCategory !== 'all' && (
                  <>
                    <span>•</span>
                    <span className="text-cyan-400 capitalize font-medium">{selectedCategory}</span>
                  </>
                )}
                {selectedSubcategory !== 'all' && (
                  <>
                    <span>•</span>
                    <span className="text-cyan-300 font-medium">{selectedSubcategory}</span>
                  </>
                )}
              </div>

              {/* Pagination Mini Indicator */}
              <div className="text-xs font-mono text-slate-400">
                Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center space-y-4 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 p-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No products found</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No items match your active filters or search terms. Try adjusting the category or clearing the search.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Product Grid (10 items on this page) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                    onAddToCart={onAddToCart}
                    onDelete={handleDeleteProduct}
                    isAdmin={isAdminMode}
                    activeRole={activeUserRole === 'all' ? 'normal' : activeUserRole}
                  />
                ))}
              </div>
            )}

            {/* ======================================================== */}
            {/* PAGINATION CONTROLS (Exactly 10 products per page)       */}
            {/* ======================================================== */}
            {totalPages > 1 && (
              <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 font-mono">
                  Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Previous Page */}
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.max(p - 1, 1));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isCurrent = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-xl font-mono text-xs font-semibold transition-all ${
                          isCurrent
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Page */}
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.min(p + 1, totalPages));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
