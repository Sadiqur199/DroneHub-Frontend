import React from 'react';
import { formatAud, calculateGst } from '../../data/products';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const ProductCard = ({ product, onSelect, onAddToCart }) => {
  const gstCents = calculateGst(product.price_cents);

  return (
    <div className="bg-[#0C1424] border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between group backdrop-blur-sm">
      {/* Product Image Area */}
      <div 
        onClick={() => onSelect(product)}
        className="relative h-60 w-full overflow-hidden bg-[#070D19] flex items-center justify-center cursor-pointer p-4 border-b border-slate-800/60"
      >
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-slate-800/95 text-slate-300 border border-slate-700 shadow-xs">
            {product.brand}
          </span>
          {product.category === 'combos' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300">
              Combo Kit
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            In Stock ({product.stock_qty})
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[11px] font-mono text-slate-500 mb-1">
            SKU: {product.sku}
          </div>

          <h3 
            onClick={() => onSelect(product)}
            className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
            {product.short_description}
          </p>

          {/* Key Quick Highlight */}
          {product.flight_time && (
            <div className="mt-3 inline-block px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-700/60 text-[11px] font-medium text-slate-300">
              ⏱ Flight: {product.flight_time}
            </div>
          )}
        </div>

        {/* Price & Actions Area */}
        <div className="pt-4 border-t border-slate-700/60 space-y-3">
          <div>
            <div className="text-xl font-bold text-white tracking-tight">
              {formatAud(product.price_cents)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Includes 10% Australian GST ({formatAud(gstCents)})
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onSelect(product)}
              className="py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onAddToCart(product)}
              className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
