import React, { useState } from 'react';
import { DRONES, formatAud, calculateGst } from '../../data/products';
import { 
  Wrench, Battery, ShoppingBag, ArrowRight, CheckCircle2, Shield 
} from 'lucide-react';

export const DronePartsSection = ({ onSelectProduct, onAddToCart, viewMode = 'parts' }) => {
  const [selectedDroneId, setSelectedDroneId] = useState(DRONES[0].id);

  const selectedDrone = DRONES.find(d => d.id === selectedDroneId) || DRONES[0];

  const isPartsOnly = viewMode === 'parts';
  const isAccessoriesOnly = viewMode === 'accessories';

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="text-left space-y-1.5 border-b border-gray-200 pb-4">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
          {isPartsOnly ? 'Genuine Drone Replacement Parts' : isAccessoriesOnly ? 'Compatible Payloads & Batteries' : 'Model-Specific Hardware'}
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          {isPartsOnly 
            ? 'Select Drone Model to View Genuine Spare Parts' 
            : isAccessoriesOnly 
            ? 'Select Drone Model to View Compatible Accessories & Payloads' 
            : 'Select Drone Model for Compatible Hardware'}
        </h3>
        <p className="text-xs text-gray-500">
          {isPartsOnly 
            ? 'Factory-original carbon propellers, motors, spray nozzles, and cables for each specific airframe.' 
            : 'Intelligent flight batteries, fast charging stations, RTK base receivers, and specialized payloads.'}
        </p>
      </div>

      {/* Drone Airframe Selector Tabs - Clean pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DRONES.map((drone) => {
          const isSelected = drone.id === selectedDrone.id;
          return (
            <button
              key={drone.id}
              onClick={() => setSelectedDroneId(drone.id)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 text-gray-900 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/60'
              }`}
            >
              <img 
                src={drone.image_url} 
                alt={drone.name} 
                className="w-11 h-11 rounded-lg object-contain bg-gray-50 shrink-0 p-1" 
              />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate text-gray-900">{drone.name}</div>
                <div className="text-[11px] font-medium text-blue-600 mt-0.5">{drone.brand}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Model Indicator Banner */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <img 
            src={selectedDrone.image_url} 
            alt={selectedDrone.name} 
            className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1 shrink-0" 
          />
          <div>
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block">
              Showing hardware for:
            </span>
            <div className="text-sm font-bold text-gray-900">{selectedDrone.name}</div>
          </div>
        </div>

        <button
          onClick={() => onSelectProduct(selectedDrone)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
        >
          <span>View {selectedDrone.name.split(' ')[1]} Specifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Strict Conditional Rendering: PARTS ONLY vs ACCESSORIES ONLY */}
      {isPartsOnly && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 border-b border-gray-100 pb-2">
            <span className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              Genuine Spare Parts ({selectedDrone.parts.length} items)
            </span>
            <span className="text-gray-400 font-normal">Strictly Replacement Components</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDrone.parts.map((part) => (
              <div 
                key={part.id}
                className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between gap-3 hover:border-blue-400 hover:shadow-xs transition-all group"
              >
                <div 
                  onClick={() => onSelectProduct(part)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <img 
                    src={part.image_url} 
                    alt={part.name} 
                    className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-100 p-1 shrink-0" 
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {part.name}
                    </h5>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                      SKU: {part.sku} · Stock: {part.stock_qty}
                    </div>
                    <div className="text-xs font-bold text-gray-900 mt-1">
                      {formatAud(part.price_cents)} <span className="text-[10px] text-gray-400 font-normal">incl. GST</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(part)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-800 font-semibold text-xs transition-colors shrink-0"
                  title="Add Part to Cart"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAccessoriesOnly && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 border-b border-gray-100 pb-2">
            <span className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-amber-600" />
              Compatible Accessories & Payloads ({selectedDrone.accessories.length} items)
            </span>
            <span className="text-gray-400 font-normal">Strictly Payloads & Batteries</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDrone.accessories.map((acc) => (
              <div 
                key={acc.id}
                className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between gap-3 hover:border-amber-400 hover:shadow-xs transition-all group"
              >
                <div 
                  onClick={() => onSelectProduct(acc)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <img 
                    src={acc.image_url} 
                    alt={acc.name} 
                    className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-100 p-1 shrink-0" 
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-gray-900 truncate group-hover:text-amber-600 transition-colors">
                      {acc.name}
                    </h5>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                      SKU: {acc.sku} · Stock: {acc.stock_qty}
                    </div>
                    <div className="text-xs font-bold text-gray-900 mt-1">
                      {formatAud(acc.price_cents)} <span className="text-[10px] text-gray-400 font-normal">incl. GST</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(acc)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-amber-600 hover:text-white text-gray-800 font-semibold text-xs transition-colors shrink-0"
                  title="Add Accessory to Cart"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
