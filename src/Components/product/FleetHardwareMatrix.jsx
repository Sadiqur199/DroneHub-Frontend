import React, { useState } from 'react';
import { DRONES, getAllParts, getAllAccessories, formatAud, calculateGst } from '../../data/products';
import { 
  Wrench, Battery, ShoppingBag, ArrowRight, CheckCircle2, Shield, 
  ExternalLink, Layers, ChevronRight, Zap, Check 
} from 'lucide-react';

export const FleetHardwareMatrix = ({ 
  onSelectProduct, 
  onAddToCart, 
  onSelectCategory, 
  onNavigate 
}) => {
  const [activeDroneId, setActiveDroneId] = useState(DRONES[0].id);
  const [activeTab, setActiveTab] = useState('parts'); // 'parts' or 'accessories'

  const selectedDrone = DRONES.find(d => d.id === activeDroneId) || DRONES[0];

  const handleOpenStorefront = () => {
    if (onSelectCategory) {
      onSelectCategory(activeTab === 'parts' ? 'parts' : 'accessories');
    }
    if (onNavigate) {
      onNavigate('products');
    }
  };

  return (
    <div className="w-full space-y-8 text-slate-100">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            CASA-ACCREDITED FLEET HARDWARE MATRIX
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Enterprise Aircraft Hardware & Compatibility Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Select any commercial airframe to inspect certified factory-original spare parts, intelligent battery systems, and optical payloads calibrated in our Mackay depot.
          </p>
        </div>

        {/* View All Storefront Link */}
        <button
          onClick={handleOpenStorefront}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <span>Browse All {activeTab === 'parts' ? 'Spare Parts' : 'Payloads'} ({activeTab === 'parts' ? getAllParts().length : getAllAccessories().length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. Aircraft Selector Bar: All 7 Drone Models */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {DRONES.map((drone) => {
          const isActive = drone.id === selectedDrone.id;
          return (
            <button
              key={drone.id}
              onClick={() => setActiveDroneId(drone.id)}
              className={`group text-left p-3 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/70 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md shadow-cyan-950/50'
                  : 'bg-[#0C1424] border-slate-800/80 hover:border-slate-700 hover:bg-[#101A2E] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                  isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700/70 text-slate-300'
                }`}>
                  {drone.series_name || 'Series'}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                )}
              </div>

              {/* Drone Thumbnail */}
              <div className="w-full h-16 rounded-xl bg-slate-900/80 border border-slate-700/60 p-1 mb-2 flex items-center justify-center overflow-hidden">
                <img 
                  src={drone.image_url} 
                  alt={drone.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                />
              </div>

              {/* Drone Meta */}
              <div className="min-w-0 w-full">
                <div className="text-[11px] font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {drone.name.split(' ').slice(0, 3).join(' ')}
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {drone.parts.length} parts · {drone.accessories.length} acc
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Interactive Fleet Hardware Showcase Container */}
        <div className="bg-[#0A111F] rounded-3xl border border-slate-800/80 shadow-xl overflow-hidden backdrop-blur-sm">
        
        {/* Showcase Top Control Bar */}
        <div className="bg-slate-900/80 border-b border-slate-700/60 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Active Airframe Identifier */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Selected Airframe:
            </span>
            <span className="text-sm font-bold text-white flex items-center gap-2">
              {selectedDrone.name}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-semibold font-mono">
                {selectedDrone.sku}
              </span>
            </span>
          </div>

          {/* Segmented Hardware Tab Control */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700">
            <button
              onClick={() => setActiveTab('parts')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'parts'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Genuine Spare Parts</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'parts' ? 'bg-cyan-950 text-cyan-200' : 'bg-slate-800 text-slate-300'
              }`}>
                {selectedDrone.parts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('accessories')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'accessories'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Battery className="w-3.5 h-3.5" />
              <span>Payloads & Batteries</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'accessories' ? 'bg-cyan-950 text-cyan-200' : 'bg-slate-800 text-slate-300'
              }`}>
                {selectedDrone.accessories.length}
              </span>
            </button>
          </div>
        </div>

        {/* Showcase Body: Split Layout */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Airframe Spotlight Card (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Airframe Specifications
              </div>
              <h3 className="text-lg font-bold text-white mt-1 leading-snug">
                {selectedDrone.name}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {selectedDrone.short_description}
              </p>
            </div>

            {/* Drone Hero Image */}
            <div 
              onClick={() => onSelectProduct(selectedDrone)}
              className="h-44 rounded-xl bg-slate-950/70 border border-slate-800 p-3 flex items-center justify-center cursor-pointer group"
            >
              <img 
                src={selectedDrone.image_url} 
                alt={selectedDrone.name} 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
              />
            </div>

            {/* Performance Badges Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Flight Time</div>
                <div className="font-bold text-white mt-0.5">{selectedDrone.flight_time || '55 Min'}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Ingress Rating</div>
                <div className="font-bold text-white mt-0.5">{selectedDrone.ip_rating || 'IP55'}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Accreditation</div>
                <div className="font-bold text-cyan-300 mt-0.5">CASA Ready</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Stock Level</div>
                <div className="font-bold text-emerald-400 mt-0.5">{selectedDrone.stock_qty} In Mackay</div>
              </div>
            </div>

            {/* View Drone Details Action */}
            <button
              onClick={() => onSelectProduct(selectedDrone)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Inspect Full Drone Airframe</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Right Column: Hardware Items Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                {activeTab === 'parts' ? (
                  <>
                    <Wrench className="w-4 h-4 text-cyan-400" />
                    Certified Replacement Components ({selectedDrone.parts.length} items)
                  </>
                ) : (
                  <>
                    <Battery className="w-4 h-4 text-amber-400" />
                    Intelligent Batteries & Optical Payloads ({selectedDrone.accessories.length} items)
                  </>
                )}
              </span>
              <span className="text-slate-400 font-medium text-[11px]">
                Factory Original · 100% Genuine
              </span>
            </div>

            {/* Hardware Items List/Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(activeTab === 'parts' ? selectedDrone.parts : selectedDrone.accessories).map((item) => {
                const gstCents = calculateGst(item.price_cents);
                return (
                  <div
                    key={item.id}
                    className="bg-[#0C1424] border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-200 rounded-2xl p-4 flex flex-col justify-between group backdrop-blur-xs"
                  >
                    {/* Item Image */}
                    <div 
                      onClick={() => onSelectProduct(item)}
                      className="h-32 w-full rounded-xl bg-slate-950/70 border border-slate-800 p-2 flex items-center justify-center cursor-pointer mb-3 group-hover:border-slate-700 transition-colors"
                    >
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                      />
                    </div>

                    {/* Item Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="text-[10px] font-mono text-slate-500">
                        SKU: {item.sku}
                      </div>

                      <h4 
                        onClick={() => onSelectProduct(item)}
                        className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
                      >
                        {item.name}
                      </h4>

                      <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {item.stock_qty} in Mackay Depot
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-white">
                          {formatAud(item.price_cents)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          incl. GST
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(item)}
                        className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Context Banner inside Right Area */}
            <div className="mt-6 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-medium">
                  Looking for full component breakdown for <strong className="text-white">{selectedDrone.name}</strong>?
                </span>
              </div>

              <button
                onClick={handleOpenStorefront}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-2 shrink-0 transition-colors"
              >
                <span>Filter all {activeTab} in Storefront</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
