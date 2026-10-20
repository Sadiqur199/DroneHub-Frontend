import React, { useState, useMemo, useEffect } from 'react';
import { 
  DRONES, COMBOS, getAllParts, getAllAccessories, getAllProducts 
} from '../data/products';
import { ProductCard } from '../Components/product/ProductCard';
import { 
  Search, Filter, Layers, Check, X, SlidersHorizontal, 
  Plane, Wrench, Battery, Package, ChevronRight, RotateCcw, 
  ShieldCheck, Phone, CheckCircle2, ArrowRight, Sparkles 
} from 'lucide-react';

export const Products = ({ 
  selectedCategory = 'all', 
  onSelectCategory, 
  onSelectProduct, 
  onAddToCart 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDroneId, setSelectedDroneId] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState('all'); // 'all', 'under500', '500-2k', '2k-10k', '10k+'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // When selectedCategory prop changes from outside (e.g. Navbar), reset drone filter
  useEffect(() => {
    setSelectedDroneId('all');
  }, [selectedCategory]);

  // Airframes List with real counts derived directly from data (T100, T70, T50, T40, Mavic, Matrice, Inspire)
  const airframes = useMemo(() => {
    return DRONES.map((d) => ({
      id: d.id,
      series: d.series || 'drone',
      series_name: d.series_name || d.name.split(' ')[1] || 'Model',
      name: d.name,
      shortName: d.name.replace('Flagship Enterprise Airframe', '')
                       .replace('Agricultural Drone', '')
                       .replace('Survey Drone', '')
                       .replace('8K Full-Frame Cinema Airframe System', '')
                       .replace('Commercial Agricultural Spraying Drone', '')
                       .replace('Heavy-Lift Forestry & Broadacre Spraying Drone', '')
                       .replace('High-Capacity Broadacre Spraying Drone', '')
                       .replace('Broadacre Crop Spraying & Seeding Drone', '')
                       .trim(),
      brand: d.brand,
      image_url: d.image_url,
      partsCount: d.parts ? d.parts.length : 0,
      accessoriesCount: d.accessories ? d.accessories.length : 0,
      missionTag: d.series === 't100' ? '100kg Forestry & Broadacre'
                : d.series === 't70' ? '70kg High-Capacity Spray'
                : d.series === 't50' ? '50kg Precision Crop Spraying'
                : d.series === 't40' ? '40kg Agricultural Workhorse'
                : d.series === 'mavic' ? 'Compact Thermal & Survey'
                : d.series === 'matrice' ? 'Mining & Thermal Inspection'
                : '8K Aerial Cinema'
    }));
  }, []);

  // Combo mission types
  const comboBundles = useMemo(() => {
    return [
      { id: 'all', label: 'All Turnkey Combos', count: COMBOS.length },
      { id: 'combo-bowen-basin-mining', label: 'Bowen Basin Mining RTK Combo', tag: 'Open-Cut Coal Mining', count: 1 },
      { id: 'combo-mavic3-bushfire', label: 'Mavic 3 Thermal Rapid Response', tag: 'Bushfire & Solar Inspections', count: 1 },
      { id: 'combo-inspire3-cinema', label: 'Inspire 3 8K Cinema Master Pack', tag: 'Dual-Pilot Film Production', count: 1 },
    ];
  }, []);

  // Commercial Drone missions
  const droneMissions = useMemo(() => {
    return [
      { id: 'all', label: 'All Commercial Airframes', count: DRONES.length },
      { id: 'dji-agras-t50-agricultural-drone', label: 'Agricultural Spray & Spreading', model: 'DJI Agras T50', count: 1 },
      { id: 'dji-matrice-350-rtk', label: 'Mining Pit & Thermal Inspection', model: 'DJI Matrice 350 RTK', count: 1 },
      { id: 'dji-mavic-3-thermal', label: 'Compact Infrastructure Survey', model: 'DJI Mavic 3 Enterprise', count: 1 },
      { id: 'dji-inspire-3', label: '8K Full-Frame Aerial Cinematography', model: 'DJI Inspire 3', count: 1 },
    ];
  }, []);

  // Primary Categories for the 'all' view or quick jump
  const categories = [
    { id: 'all', label: 'All Catalog', icon: Layers, count: getAllProducts().length },
    { id: 'drones', label: 'Commercial Drones', icon: Plane, count: DRONES.length },
    { id: 'parts', label: 'Genuine Spare Parts', icon: Wrench, count: getAllParts().length },
    { id: 'accessories', label: 'Payloads & Batteries', icon: Battery, count: getAllAccessories().length },
    { id: 'combos', label: 'Turnkey Combos', icon: Package, count: COMBOS.length },
  ];

  // Dynamic Page Heading & Meta per Category
  const pageMeta = useMemo(() => {
    switch (selectedCategory) {
      case 'drones':
        return {
          title: 'Commercial Drone Fleet',
          subtitle: 'Heavy-lift agricultural spraying drones, radiometric thermal inspection platforms, and cinema airframes. Strictly drones only.',
          badge: 'Commercial Airframes',
          singular: 'Drone Airframe'
        };
      case 'parts':
        return {
          title: 'Genuine Drone Spare Parts',
          subtitle: 'Factory-original carbon propellers, motor arms, spray nozzles, and cables filtered by drone airframe. Strictly parts only.',
          badge: 'Genuine Spare Parts',
          singular: 'Spare Part'
        };
      case 'accessories':
        return {
          title: 'Drone Payloads, Batteries & Accessories',
          subtitle: 'Intelligent flight battery packs, multi-voltage charging hubs, RTK base stations, and high-resolution optical payloads.',
          badge: 'Payloads & Batteries',
          singular: 'Payload / Battery'
        };
      case 'combos':
        return {
          title: 'Turnkey Enterprise Combos',
          subtitle: 'Pre-configured mission flight bundles complete with multi-battery rotation, RTK receivers, and Pelican hard transport cases.',
          badge: 'Turnkey Packages',
          singular: 'Combo Bundle'
        };
      default:
        return {
          title: 'Full Commercial Aviation Catalog',
          subtitle: 'Browse all CASA-accredited airframes, genuine replacement parts, and payloads in stock in our Mackay depot.',
          badge: 'All Products',
          singular: 'Product'
        };
    }
  }, [selectedCategory]);

  // Strict Category Base Products (Strictly Separate!)
  const baseProducts = useMemo(() => {
    if (selectedCategory === 'drones') return DRONES;
    if (selectedCategory === 'combos') return COMBOS;
    if (selectedCategory === 'parts') return getAllParts();
    if (selectedCategory === 'accessories') return getAllAccessories();
    return getAllProducts();
  }, [selectedCategory]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return baseProducts
      .filter((p) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches = (
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            (p.short_description && p.short_description.toLowerCase().includes(q))
          );
          if (!matches) return false;
        }

        // Specific category filter by drone model
        if (selectedCategory === 'parts' || selectedCategory === 'accessories') {
          if (selectedDroneId !== 'all') {
            if (p.drone_id !== selectedDroneId) return false;
          }
        } else if (selectedCategory === 'drones') {
          if (selectedDroneId !== 'all') {
            if (p.id !== selectedDroneId) return false;
          }
        } else if (selectedCategory === 'combos') {
          if (selectedDroneId !== 'all') {
            if (p.id !== selectedDroneId) return false;
          }
        }

        // In stock only filter
        if (inStockOnly && p.stock_qty <= 0) {
          return false;
        }

        // Price range filter
        if (priceRange === 'under500' && p.price_cents > 50000) return false;
        if (priceRange === '500-2k' && (p.price_cents < 50000 || p.price_cents > 200000)) return false;
        if (priceRange === '2k-10k' && (p.price_cents < 200000 || p.price_cents > 1000000)) return false;
        if (priceRange === '10k+' && p.price_cents < 1000000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price_cents - b.price_cents;
        if (sortBy === 'price-high') return b.price_cents - a.price_cents;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [baseProducts, selectedCategory, selectedDroneId, searchQuery, inStockOnly, priceRange, sortBy]);

  const activeDroneObject = airframes.find(d => d.id === selectedDroneId);
  const activeComboObject = comboBundles.find(c => c.id === selectedDroneId);
  const activeMissionObject = droneMissions.find(m => m.id === selectedDroneId);

  const hasActiveFilters = searchQuery || selectedDroneId !== 'all' || inStockOnly || priceRange !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDroneId('all');
    setInStockOnly(false);
    setPriceRange('all');
    setSortBy('default');
  };

  return (
    <div className="w-full bg-[#0F172A] text-slate-100 min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium flex-wrap">
            <span>Storefront</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-semibold">{pageMeta.badge}</span>
            {selectedDroneId !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-white font-semibold">
                  {activeDroneObject?.shortName || activeComboObject?.label || activeMissionObject?.label}
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {pageMeta.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {pageMeta.subtitle}
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>{mobileFilterOpen ? 'Hide Category Filters' : 'Show Filter by Drone'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column E-Commerce Layout: Left Sidebar + Right Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================= */}
        {/* LEFT SIDEBAR: Bespoke, Page-Specific Filters */}
        {/* ========================================================= */}
        <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-5 space-y-6 sticky top-24 shadow-lg backdrop-blur-sm">
            
            {/* Sidebar Title & Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  {selectedCategory === 'parts' 
                    ? 'Genuine Parts Filter' 
                    : selectedCategory === 'accessories' 
                    ? 'Payloads Filter' 
                    : selectedCategory === 'drones' 
                    ? 'Airframe Filter' 
                    : selectedCategory === 'combos' 
                    ? 'Turnkey Filter' 
                    : 'Catalog Filter'}
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* ========================================================= */}
            {/* 1. FILTER FOR: Genuine Spare Parts (Filter by Drone Model) */}
            {/* ========================================================= */}
            {selectedCategory === 'parts' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Select Drone Airframe
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">Click to filter</span>
                </div>

                <div className="space-y-1.5">
                  {/* Option 0: All Drone Parts */}
                  <button
                    onClick={() => setSelectedDroneId('all')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                      selectedDroneId === 'all'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Wrench className={`w-4 h-4 ${selectedDroneId === 'all' ? 'text-white' : 'text-blue-600'}`} />
                      <span>All Genuine Spare Parts</span>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      selectedDroneId === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getAllParts().length}
                    </span>
                  </button>

                  {/* List of Drones with genuine parts count */}
                  {airframes.map((drone) => {
                    const isSelected = selectedDroneId === drone.id;
                    return (
                      <button
                        key={drone.id}
                        onClick={() => setSelectedDroneId(drone.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-blue-50/90 text-blue-900 font-bold border-2 border-blue-600 shadow-xs'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                        }`}
                      >
                        <img 
                          src={drone.image_url} 
                          alt={drone.name} 
                          className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-200/80 p-0.5 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-gray-900 truncate text-[11px] leading-tight">
                            {drone.shortName}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                            {drone.missionTag}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {drone.partsCount} parts
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 2. FILTER FOR: Accessories & Payloads (Filter by Drone Model) */}
            {/* ========================================================= */}
            {selectedCategory === 'accessories' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Select Drone Airframe
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">Click to filter</span>
                </div>

                <div className="space-y-1.5">
                  {/* Option 0: All Payloads & Batteries */}
                  <button
                    onClick={() => setSelectedDroneId('all')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                      selectedDroneId === 'all'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Battery className={`w-4 h-4 ${selectedDroneId === 'all' ? 'text-white' : 'text-amber-600'}`} />
                      <span>All Payloads & Batteries</span>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      selectedDroneId === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getAllAccessories().length}
                    </span>
                  </button>

                  {/* List of Drones with accessory counts */}
                  {airframes.map((drone) => {
                    const isSelected = selectedDroneId === drone.id;
                    return (
                      <button
                        key={drone.id}
                        onClick={() => setSelectedDroneId(drone.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-blue-50/90 text-blue-900 font-bold border-2 border-blue-600 shadow-xs'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                        }`}
                      >
                        <img 
                          src={drone.image_url} 
                          alt={drone.name} 
                          className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-200/80 p-0.5 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-gray-900 truncate text-[11px] leading-tight">
                            {drone.shortName}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                            {drone.missionTag}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {drone.accessoriesCount} items
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 3. FILTER FOR: Drones (Categories: T50, T40, T70, T100, Mavic...) */}
            {/* ========================================================= */}
            {selectedCategory === 'drones' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Drone Model & Series
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">{DRONES.length} Airframes</span>
                </div>

                <div className="space-y-1.5">
                  {/* Option 0: All Drones */}
                  <button
                    onClick={() => setSelectedDroneId('all')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                      selectedDroneId === 'all'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Plane className={`w-4 h-4 ${selectedDroneId === 'all' ? 'text-white' : 'text-blue-600'}`} />
                      <span>All Commercial Airframes</span>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      selectedDroneId === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {DRONES.length}
                    </span>
                  </button>

                  {/* Specific Drone Series: T100, T70, T50, T40, Mavic, Matrice, Inspire */}
                  {airframes.map((drone) => {
                    const isSelected = selectedDroneId === drone.id;
                    return (
                      <button
                        key={drone.id}
                        onClick={() => setSelectedDroneId(drone.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-blue-50/90 text-blue-900 font-bold border-2 border-blue-600 shadow-xs'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                        }`}
                      >
                        <img 
                          src={drone.image_url} 
                          alt={drone.name} 
                          className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-200/80 p-0.5 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 uppercase font-mono">
                              {drone.series_name}
                            </span>
                            <span className="font-bold text-gray-900 truncate text-[11px]">
                              {drone.shortName}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium mt-0.5 truncate">
                            {drone.missionTag}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          1
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 4. FILTER FOR: Combos (Filter by Turnkey Package) */}
            {/* ========================================================= */}
            {selectedCategory === 'combos' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Turnkey Flight Bundles
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">{COMBOS.length} Combos</span>
                </div>

                <div className="space-y-1.5">
                  {comboBundles.map((bundle) => {
                    const isSelected = selectedDroneId === bundle.id;
                    return (
                      <button
                        key={bundle.id}
                        onClick={() => setSelectedDroneId(bundle.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-600 text-white font-bold shadow-xs'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-white'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-xs leading-snug">{bundle.label}</div>
                          {bundle.tag && (
                            <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-100' : 'text-gray-400'}`}>
                              {bundle.tag}
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {bundle.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 5. FILTER FOR: 'all' Catalog view (Department Switcher) */}
            {/* ========================================================= */}
            {selectedCategory === 'all' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Aviation Departments
                </label>
                <div className="space-y-1.5">
                  {categories.filter(c => c.id !== 'all').map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.id);
                          setSelectedDroneId('all');
                        }}
                        className="w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold">{cat.label}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-gray-100 text-gray-600">
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Availability Filter */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Depot Availability
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="font-medium">In Stock Mackay HQ Only</span>
              </label>
            </div>

            {/* Price Bracket Filter */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Price Range (AUD)
              </label>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'all', label: 'All Price Ranges' },
                  { id: 'under500', label: 'Under $500 AUD (Spares & Props)' },
                  { id: '500-2k', label: '$500 – $2,000 AUD (Batteries & Hubs)' },
                  { id: '2k-10k', label: '$2,000 – $10,000 AUD (Payloads)' },
                  { id: '10k+', label: '$10,000+ AUD (Airframes & Combos)' },
                ].map((range) => (
                  <label 
                    key={range.id} 
                    className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 py-1"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === range.id}
                      onChange={() => setPriceRange(range.id)}
                      className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Australian Support Card in Sidebar */}
            <div className="pt-4 border-t border-gray-200 space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-gray-700 space-y-1.5">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Mackay Depot Assistance
                </div>
                <p className="text-[11px] text-gray-600 leading-tight">
                  Need airframe serial verification or parts compatibility check?
                </p>
                <div className="text-[11px] font-bold text-blue-700 font-mono">
                  1800 376 634 (Toll-Free)
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT MAIN CONTENT AREA: Airframe Header, Controls & Grid */}
        {/* ========================================================= */}
        <main className="lg:col-span-9 space-y-6 min-w-0">
          
          {/* Top Search, Sort & Counter Bar */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${pageMeta.singular.toLowerCase()} name, SKU...`}
                className="w-full pl-10 pr-9 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-xs focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: Sort & Counter */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
              <span className="text-gray-500 font-medium">
                Showing <strong className="text-gray-900">{filteredProducts.length}</strong> {pageMeta.badge}
              </span>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium focus:outline-none focus:border-blue-500 shadow-xs"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Airframe Context Banner (When a drone is selected in parts or accessories) */}
          {(selectedCategory === 'parts' || selectedCategory === 'accessories') && selectedDroneId !== 'all' && activeDroneObject && (
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img 
                  src={activeDroneObject.image_url} 
                  alt={activeDroneObject.name} 
                  className="w-12 h-12 rounded-xl object-contain bg-white border border-blue-200 p-1 shrink-0" 
                />
                <div>
                  <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    Showing {selectedCategory === 'parts' ? 'Genuine Replacement Parts' : 'Compatible Payloads'} for:
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {activeDroneObject.name}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    100% factory original components · Calibrated for Australian conditions
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDroneId('all')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 px-3 py-1.5 rounded-lg bg-white border border-blue-200 shadow-xs flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Show All Airframes ({selectedCategory === 'parts' ? getAllParts().length : getAllAccessories().length})</span>
              </button>
            </div>
          )}

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-gray-400 font-medium">Active Filters:</span>
              
              {selectedDroneId !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  Airframe: {activeDroneObject?.shortName || activeComboObject?.label || activeMissionObject?.label}
                  <button onClick={() => setSelectedDroneId('all')}>
                    <X className="w-3 h-3 text-blue-600 hover:text-blue-900" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  In Stock Mackay Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 text-emerald-600" />
                  </button>
                </span>
              )}

              {priceRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                  Price Filter Active
                  <button onClick={() => setPriceRange('all')}>
                    <X className="w-3 h-3 text-purple-600" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 font-semibold">
                  Query: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:underline font-semibold ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid (3 columns on desktop next to the sidebar) */}
          {filteredProducts.length === 0 ? (
            <div className="bg-gray-50 py-20 rounded-2xl text-center text-gray-500 space-y-3 border border-dashed border-gray-300">
              <Layers className="w-10 h-10 text-gray-400 mx-auto" />
              <div className="text-base font-semibold text-gray-900">
                No items found matching your airframe or filter selection
              </div>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try selecting "All Airframe Models" or clearing the active search filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
