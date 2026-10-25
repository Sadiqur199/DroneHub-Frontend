import React, { useState } from 'react';
import { formatAud, calculateGst } from '../../data/products';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Box, Tag, Plane, Percent } from 'lucide-react';

export const ShopProductCard = ({
  product,
  onSelect,
  onAddToCart,
  onDelete,
  isAdmin = false,
  activeRole = 'normal', // 'normal', 'wholesale', 'agent'
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Determine effective price based on active role
  let basePriceCents = product.price_cents || 0;
  let roleLabel = 'Retail Price';

  if (activeRole === 'wholesale') {
    if (product.role_prices?.wholesale) {
      basePriceCents = product.role_prices.wholesale;
    } else if (product.price_cents) {
      basePriceCents = Math.round(product.price_cents * 0.88);
    }
    roleLabel = 'Wholesale (ABN) Price';
  } else if (activeRole === 'agent') {
    if (product.role_prices?.agent) {
      basePriceCents = product.role_prices.agent;
    } else if (product.price_cents) {
      basePriceCents = Math.round(product.price_cents * 0.80);
    }
    roleLabel = 'Service Agent Price';
  } else if (activeRole === 'normal') {
    if (product.role_prices?.normal != null) {
      basePriceCents = product.role_prices.normal;
    }
  }

  // The server already resolved this customer's price (including any active
  // promotion), so the strike-through price comes straight from the API.
  const originalPriceCents = product.original_price_cents || 0;
  const hasDiscount = !!(
    product.is_sale ||
    (product.discount_type && product.discount_type !== 'none' && product.discount_value > 0)
  );

  const finalPriceCents = basePriceCents;
  const showStrikeThrough = hasDiscount && originalPriceCents > finalPriceCents;

  const gstCents = calculateGst(finalPriceCents);

  // Check if image is valid or should be black placeholder
  const hasValidImage = product.image_url && String(product.image_url).trim() !== '' && !imageFailed;

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'drones':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'accessories':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'parts':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'combos':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between group backdrop-blur-md relative">
      {/* Admin Quick Delete Action */}
      {isAdmin && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Delete "${product.name}"?`)) {
              onDelete(product.id);
            }
          }}
          className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-rose-950/80 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-800/80 transition-all shadow-lg backdrop-blur-sm"
          title="Delete Product"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Product Image Area — If no image, renders pure black placeholder ("kali") as requested */}
      <div
        onClick={() => onSelect && onSelect(product)}
        className="relative h-56 sm:h-60 w-full overflow-hidden flex items-center justify-center cursor-pointer p-4 bg-black select-none border-b border-slate-800/80"
      >
        {hasValidImage ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          /* Pure Black / Clean Placeholder ("kono image na pele oida kali tkabe") */
          <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-2 shadow-inner">
              <Box className="w-5 h-5 text-slate-600" />
            </div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-slate-500">
              No Image Provided
            </span>
            <span className="text-[10px] text-slate-700 font-mono mt-0.5">
              {product.model_number || product.sku || 'Official DroneHab Item'}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/90 text-slate-300 border border-slate-800 shadow-sm backdrop-blur-md">
            {product.brand || 'DroneHab'}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border backdrop-blur-md ${getCategoryColor(product.category)}`}>
            {product.category}
          </span>
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 backdrop-blur-md flex items-center gap-0.5">
              <Percent className="w-2.5 h-2.5" />
              <span>
                {product.discount_type === 'percentage'
                  ? `${product.discount_value}% OFF`
                  : 'DISCOUNT'}
              </span>
            </span>
          )}
        </div>

        {/* Stock Status Badge (Bottom of Image) */}
        <div className="absolute bottom-2.5 right-3 z-10">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border flex items-center gap-1.5 backdrop-blur-md ${
            (product.stock_qty || 0) > 0
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/70'
              : 'bg-rose-950/80 text-rose-400 border-rose-800/70'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              (product.stock_qty || 0) > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
            }`}></span>
            {(product.stock_qty || 0) > 0 ? `In Stock (${product.stock_qty})` : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Subcategory & Drone Association */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-cyan-400/90 truncate max-w-[65%]">
              <Tag className="w-3 h-3 shrink-0" />
              <span className="truncate">{product.subcategory || product.part_section || 'General'}</span>
            </span>
            <span className="text-slate-500 shrink-0">{product.model_number || product.sku}</span>
          </div>

          {/* Linked Drone Name badge (for parts and accessories) */}
          {product.drone_name && product.drone_name !== 'Universal / All Airframes' && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-[10px] font-semibold text-cyan-300">
                <Plane className="w-2.5 h-2.5" />
                <span className="truncate max-w-[200px]">For: {product.drone_name}</span>
              </span>
            </div>
          )}

          {/* Product Title */}
          <h3
            onClick={() => onSelect && onSelect(product)}
            className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {product.short_description || product.full_description || product.description || 'Enterprise grade commercial drone hardware backed by DroneHab Australia priority workshop support.'}
          </p>

          {/* Spec or Flight Time highlight */}
          {product.flight_time && (
            <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/70 border border-slate-800 text-[11px] font-medium text-slate-300">
              <span>⏱</span>
              <span>{product.flight_time}</span>
            </div>
          )}
        </div>

        {/* Price & Actions Area */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div>
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-white tracking-tight font-mono">
                {formatAud(finalPriceCents)}
              </div>
              {showStrikeThrough && (
                <div className="text-xs line-through text-slate-500 font-mono">
                  {formatAud(originalPriceCents)}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
              <span>Includes 10% GST ({formatAud(gstCents)})</span>
              {activeRole !== 'normal' && (
                <span className="font-semibold text-cyan-400 font-mono text-[10px] bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60">
                  {roleLabel}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onSelect && onSelect({ ...product, price_cents: finalPriceCents })}
              className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/80"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onAddToCart && onAddToCart({ ...product, price_cents: finalPriceCents })}
              disabled={(product.stock_qty || 0) <= 0}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                (product.stock_qty || 0) > 0
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
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
