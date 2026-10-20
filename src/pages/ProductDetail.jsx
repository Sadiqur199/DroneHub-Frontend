import React, { useState } from 'react';
import { formatAud, calculateGst, DRONES, getAllProducts } from '../data/products';
import { ProductCard } from '../Components/product/ProductCard';
import { 
  ArrowLeft, ShoppingBag, Truck, ShieldCheck, Award, CheckCircle2, 
  Plus, Minus, Check, ChevronRight, FileText, Layers, Wrench, Battery 
} from 'lucide-react';

export const ProductDetail = ({ product, onNavigate, onAddToCart, onSelectProduct }) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToast, setAddedToast] = useState(false);

  const gstCents = calculateGst(product.price_cents * quantity);

  // Find related products
  const allProducts = getAllProducts();
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  // If this product is a drone, find its specific parts and accessories
  let compatibleItems = [];
  const droneParent = DRONES.find(d => d.id === product.id || d.id === product.drone_id);
  if (droneParent) {
    compatibleItems = [...droneParent.parts, ...droneParent.accessories].filter(item => item.id !== product.id);
  }

  const handleAdd = () => {
    onAddToCart({ ...product, qty: quantity });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="w-full bg-[#0F172A] text-slate-100 min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <button onClick={() => onNavigate('products')} className="hover:text-cyan-400 transition-colors">Products</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="capitalize font-medium text-slate-300">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Top Product Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Media Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl overflow-hidden p-8 bg-slate-900/80 border border-slate-700/70 flex items-center justify-center">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full max-h-[460px] object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Logistics Trust Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">StarTrack Express</div>
                <div className="text-[11px] text-slate-400">Fast Regional Air Freight</div>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">Australian Warranty</div>
                <div className="text-[11px] text-slate-400">{product.warranty_months || 12} Months Coverage</div>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">CASA Verified</div>
                <div className="text-[11px] text-slate-400">Commercial Standard</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Details, Pricing & Add to Cart */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md font-semibold uppercase tracking-wider bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                {product.brand}
              </span>
              <span className="font-mono text-slate-500">
                SKU: {product.sku}
              </span>
              <span className="ml-auto px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                In Stock ({product.stock_qty} in Mackay)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-6 rounded-2xl space-y-2 border border-slate-700/60 bg-slate-800/60 backdrop-blur-xs">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Australian Retail Price (AUD)
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatAud(product.price_cents * quantity)}
            </div>
            <div className="text-xs text-slate-300 font-mono flex items-center justify-between border-t border-slate-700/60 pt-2">
              <span>Includes 10% Australian GST:</span>
              <span className="text-emerald-400 font-bold">{formatAud(gstCents)} (AUD)</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-0.5">
              Official GST Tax Invoice issued with registered ABN 48 612 908 124 for BAS input credits.
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Overview
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {product.short_description}
            </p>
          </div>

          {/* Highlight Specs */}
          {product.specs && product.specs.length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {product.specs.slice(0, 4).map((spec, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-slate-400 text-[11px]">{spec.label}</div>
                  <div className="text-white font-semibold mt-0.5">{spec.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity & Add to Cart Controls */}
          <div className="pt-4 border-t border-slate-700/60 space-y-3">
            <div className="flex items-center gap-4">
              {/* Qty Selector */}
              <div className="flex items-center border border-slate-700 rounded-xl bg-slate-900 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAdd}
                className="flex-1 py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({formatAud(product.price_cents * quantity)})</span>
              </button>
            </div>

            {addedToast && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{quantity}x {product.name} added to your cart!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM TABBED SECTION (Full Description, Specs, Compatible, CASA) */}
      {/* ========================================================= */}
      <div className="rounded-3xl p-6 sm:p-10 border border-slate-700/70 bg-slate-800/60 space-y-8 shadow-xl backdrop-blur-sm">
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-700/60 pb-4 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'description'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Full Description
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Technical Specifications ({product.specs ? product.specs.length : 0})
          </button>

          {compatibleItems.length > 0 && (
            <button
              onClick={() => setActiveTab('compatible')}
              className={`pb-2 px-3 border-b-2 transition-all ${
                activeTab === 'compatible'
                  ? 'border-cyan-400 text-cyan-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Compatible Parts & Accessories ({compatibleItems.length})
            </button>
          )}

          <button
            onClick={() => setActiveTab('casa')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'casa'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            CASA & Australian Warranty
          </button>
        </div>

        {/* Tab 1: Full Description */}
        {activeTab === 'description' && (
          <div className="space-y-4 max-w-4xl text-slate-300 text-sm leading-relaxed">
            <h3 className="text-lg font-bold text-white">Product In-Depth Details</h3>
            <p>{product.description}</p>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 space-y-2 mt-4 text-xs font-mono text-slate-300">
              <div className="text-cyan-400 font-bold">Mackay Engineering Team Notes:</div>
              <div>• Inspected, serial-logged, and firmware updated prior to dispatch.</div>
              <div>• Dangerous Goods Class 9 compliant packaging for high-capacity LiPo flight batteries.</div>
              <div>• Covered by Australian Consumer Law statutory warranties.</div>
            </div>
          </div>
        )}

        {/* Tab 2: Technical Specifications */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Full Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {product.specs && product.specs.map((spec, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 flex justify-between items-center">
                  <span className="text-slate-400 font-medium">{spec.label}</span>
                  <span className="text-white font-semibold text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Compatible Parts & Accessories */}
        {activeTab === 'compatible' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">
                Genuine Certified Spares for {droneParent ? droneParent.name : product.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                The parts and payloads below are 100% genuine OEM items guaranteed to mate seamlessly with this airframe.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {compatibleItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl border border-slate-700/70 bg-slate-900/60 flex items-center justify-between gap-3 hover:border-cyan-500/50 hover:shadow-md transition-all group"
                >
                  <div 
                    onClick={() => onSelectProduct(item)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-lg object-contain bg-slate-950 p-1 shrink-0 border border-slate-800" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">{item.name}</div>
                      <div className="text-[11px] font-semibold text-cyan-400">{formatAud(item.price_cents)}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(item)}
                    className="py-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-sm"
                    title="Add to Cart"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: CASA & Warranty */}
        {activeTab === 'casa' && (
          <div className="space-y-4 max-w-4xl text-xs text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              Civil Aviation Safety Authority (CASA) Operational Advisory
            </h3>
            <p>{product.casa_note || 'Standard CASA visual line-of-sight daylight drone operating conditions apply.'}</p>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 space-y-2 font-mono text-[11px] text-slate-300">
              <div>• Maximum legal ceiling height: 120 metres (400 ft) above ground level.</div>
              <div>• Maintain at least 30 metres clearance from people not directly assisting operation.</div>
              <div>• Airframe serial pre-registered for immediate logging into the myCASA drone management portal.</div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <h3 className="text-xl font-bold text-white">
            Related Equipment & Alternates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
