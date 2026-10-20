import React, { useState, useEffect } from 'react';
import { settingsApi, productsApi } from '../services/api';
import { COMPANY_INFO } from '../data/products';
import { ProductCard } from '../Components/product/ProductCard';
import { FleetHardwareMatrix } from '../Components/product/FleetHardwareMatrix';
import { 
  ArrowRight, Phone, ShieldCheck, MapPin, Award, Truck, CheckCircle2, Wrench, Layers, Clock, FileText, Play 
} from 'lucide-react';

export const Home = ({ onNavigate, onSelectProduct, onAddToCart, onSelectCategory }) => {
  const [banner, setBanner] = useState({
    media_type: 'video',
    media_url: 'https://www.youtube.com/embed/6oPtcmr50Ls?autoplay=1&mute=1&loop=1&playlist=6oPtcmr50Ls&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&fs=0',
    badge_text: 'DJI Agras T50 & Commercial Fleet | Central QLD Hub · Mackay',
    title: 'Australia’s Premier Commercial Drone Fleet & Genuine Aviation Spares',
    subtitle: 'Supplying heavy-lift agricultural spraying drones (DJI Agras T50), radiometric thermal survey platforms, and certified factory replacement parts. Serviced in our Mackay workshop with rapid deployment support across Brisbane, Sydney, and Gold Coast.',
  });

  const [drones, setDrones] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // 1. Fetch Dynamic Banner
      const bannerRes = await settingsApi.getBanner();
      if (bannerRes.success && bannerRes.data) {
        setBanner(bannerRes.data);
      }

      // 2. Fetch Dynamic Products
      const prodRes = await productsApi.getAll();
      if (prodRes.success && prodRes.data) {
        const droneList = prodRes.data.filter(p => p.type === 'drone' || p.category === 'Agricultural Drone');
        const otherList = prodRes.data.filter(p => p.type !== 'drone');
        setDrones(droneList.length > 0 ? droneList : prodRes.data.slice(0, 4));
        setCombos(otherList.slice(0, 3));
      }
    } catch (err) {
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const isDirectVideo = (url) => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('/storage/banners/videos');
  };

  return (
    <div className="w-full bg-[#0F172A] space-y-16 pb-20 text-slate-100">
      {/* ========================================================= */}
      {/* DYNAMIC HERO SECTION: Admin Video / Image Background */}
      {/* ========================================================= */}
      <section className="relative w-full overflow-hidden bg-black min-h-[580px] lg:min-h-[660px] flex items-center border-b border-slate-800">
        {/* Dynamic Background Media */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {banner.media_type === 'video' ? (
            isDirectVideo(banner.media_url) ? (
              <video
                key={banner.media_url}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover opacity-85"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={banner.media_url} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <iframe
                key={banner.media_url}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] min-w-[177.77vh] min-h-[56.25vw] object-cover opacity-85"
                src={banner.media_url}
                title="DroneHub Australia Fleet Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                tabIndex="-1"
              />
            )
          ) : (
            <img
              key={banner.media_url}
              src={banner.media_url}
              alt="DroneHub Hero Banner"
              className="absolute inset-0 w-full h-full object-cover opacity-75 scale-105 transition-all duration-1000"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/drone.png';
              }}
            />
          )}
        </div>

        {/* Soft Focused Scrim — High Video Visibility Across Right & Center */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-[#0F172A]/30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-[#0F172A]/40 pointer-events-none"></div>

        {/* Content Layer Over the Video */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline & Content */}
            <div className="lg:col-span-8 space-y-6 text-left">
              {/* Australian Aviation Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md text-xs text-cyan-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold">{banner.badge_text || 'DJI Agras T50 & Commercial Fleet'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-sans tracking-tight leading-[1.1]">
                {banner.title || 'Australia’s Premier Commercial Drone Fleet & Genuine Aviation Spares'}
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                {banner.subtitle || 'Supplying heavy-lift agricultural spraying drones (DJI Agras T50), radiometric thermal survey platforms, and certified factory replacement parts.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    onSelectCategory('drones');
                    onNavigate('products');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.02]"
                >
                  <span>Explore Drone Fleet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    onNavigate('services');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md text-white border border-slate-700 text-sm font-semibold flex items-center gap-2 transition-all"
                >
                  <span>Commercial Services</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </button>

                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                  className="px-5 py-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-sm font-semibold flex items-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{COMPANY_INFO.phone}</span>
                </a>
              </div>

              {/* Quick Trust Points Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">Mackay QLD Stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">10% GST Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">StarTrack Express</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">CASA Accredited</span>
                </div>
              </div>
            </div>

            {/* Right Hero Drone Feature Glassmorphic Badge */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="rounded-3xl overflow-hidden bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 p-5 shadow-2xl text-left space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold text-[11px] uppercase tracking-wider">
                    Featured Airframe
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Dispatch Hub
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white tracking-tight">DJI Agras T50</h3>
                  <p className="text-xs text-slate-400">Heavy-Payload Agricultural Spraying & Spreading</p>
                </div>

                {/* Specs Pill Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 uppercase">Spray Payload</div>
                    <div className="text-white font-bold text-sm mt-0.5">40 kg / 16 L/min</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 uppercase">Spread Capacity</div>
                    <div className="text-white font-bold text-sm mt-0.5">50 kg (75 Liters)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 uppercase">Field Rate</div>
                    <div className="text-white font-bold text-sm mt-0.5">50 Acres / Hour</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 uppercase">Availability</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">In Stock Mackay</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectCategory('drones');
                    onNavigate('products');
                  }}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                  <span>Explore Drone Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CATEGORY EXPLORER TILES (Drones, Parts, Accessories, Combos) */}
      {/* ========================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div 
            onClick={() => { onSelectCategory('drones'); onNavigate('products'); }}
            className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 p-6 rounded-2xl cursor-pointer transition-all group backdrop-blur-xs"
          >
            <div className="text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">01 / Fleet</div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Commercial Drones
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Heavy-lift agriculture, thermal inspection, and survey airframes.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-cyan-400 font-semibold">
              View Drones <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => { onSelectCategory('parts'); onNavigate('products'); }}
            className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 p-6 rounded-2xl cursor-pointer transition-all group backdrop-blur-xs"
          >
            <div className="text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">02 / Replacement</div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Parts by Drone Model
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Select your drone (T50, M350, M3T) to see its exact spare parts.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-cyan-400 font-semibold">
              Explore Parts <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => { onSelectCategory('accessories'); onNavigate('products'); }}
            className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 p-6 rounded-2xl cursor-pointer transition-all group backdrop-blur-xs"
          >
            <div className="text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">03 / Payloads</div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Accessories & Payloads
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Intelligent batteries, thermal cameras, controllers & RTK bases.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-cyan-400 font-semibold">
              View Accessories <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => { onNavigate('services'); }}
            className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 p-6 rounded-2xl cursor-pointer transition-all group backdrop-blur-xs"
          >
            <div className="text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">04 / Services</div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Drone Services & Survey
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Survey, LiDAR canopy, weed spraying & compliance reporting.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-cyan-400 font-semibold">
              View Services <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FEATURED COMMERCIAL DRONES GRID (DATABASE DRIVEN) */}
      {/* ========================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              Enterprise Ready Airframes
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Commercial Heavy-Lift & Survey Fleet
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live database catalog with real-time Mackay workshop stock allocation.
            </p>
          </div>

          <button
            onClick={() => { onSelectCategory('drones'); onNavigate('products'); }}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            View Full Fleet ({drones.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading catalog from database...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {drones.map((drone) => (
              <ProductCard
                key={drone.id}
                product={drone}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* ENTERPRISE AIRCRAFT HARDWARE & PAYLOAD COMPATIBILITY MATRIX */}
      {/* ========================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto">
        <FleetHardwareMatrix
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
          onSelectCategory={onSelectCategory}
          onNavigate={onNavigate}
        />
      </section>

      {/* ========================================================= */}
      {/* WHY CHOOSE DRONEHUB AUSTRALIA (Trust & Compliance) */}
      {/* ========================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
              Australian Aviation Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why Australian Enterprises Rely on DroneHub
            </h2>
            <p className="text-sm text-slate-400">
              Comprehensive support for mining, agriculture, infrastructure inspection, and emergency services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Direct Australian Stock</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Warehoused in Mackay QLD. Fast StarTrack Express air freight to regional Queensland, NSW, and across Australia without international customs delays.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">CASA Certified RMA Repair</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full factory warranty servicing and crash repairs handled by accredited technicians in our Mackay workshop with quick turnaround.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Compliant GST Tax Invoices</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instant ATO-compliant Tax Invoices including our ABN {COMPANY_INFO.abn}. B2B wholesale pricing and credit accounts available for approved operations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
