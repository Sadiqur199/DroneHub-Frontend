import React from 'react';
import { COMPANY_INFO } from '../../data/products';
import { 
  Phone, Mail, MapPin, Shield, Truck, Award, Layers, ArrowUpRight 
} from 'lucide-react';

export const Footer = ({ onNavigate, onSelectCategory }) => {
  return (
    <footer className="w-full bg-[#0F172A] border-t border-slate-800 text-slate-400 text-sm mt-auto">
      {/* Australian Assurance Bar */}
      <div className="w-full border-b border-slate-800/80 bg-slate-900/60 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Mackay Central HQ</div>
              <div className="text-xs text-slate-400">{COMPANY_INFO.base}</div>
              <div className="text-[11px] text-cyan-400 font-medium">Bowen Basin Fleet Support</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">CASA Certified RPAS</div>
              <div className="text-xs text-slate-400">{COMPANY_INFO.casaCertification}</div>
              <div className="text-[11px] text-emerald-400 font-medium">ReOC Commercial Operator</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">StarTrack Express Freight</div>
              <div className="text-xs text-slate-400">Next Business Day Metro</div>
              <div className="text-[11px] text-indigo-400 font-medium">Signature on Delivery Required</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Australian Serial Warranty</div>
              <div className="text-xs text-slate-400">100% Genuine OEM Equipment</div>
              <div className="text-[11px] text-amber-400 font-medium">48h Mackay Workshop Turnaround</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full px-4 sm:px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer select-none group" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm">
                DH
              </div>
              <span className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                DroneHub <span className="text-cyan-400 text-xs font-semibold ml-1 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">AUSTRALIA</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Leading commercial drone dealer and certified repair workshop based in Mackay, Queensland. Providing enterprise drone platforms for mining, agriculture, surveying, and thermal industrial inspection.
            </p>

            <div className="text-xs font-mono text-slate-400 space-y-1">
              <div>ABN: {COMPANY_INFO.abn}</div>
              <div>CASA ReOC Commercial Operator</div>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Fleet & Equipment Catalog
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                >
                  Commercial Drone Services <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('drones'); onNavigate('products'); }}
                  className="hover:text-cyan-300 text-slate-300 transition-colors"
                >
                  Commercial Drones (T50, M350, M3T)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('parts'); onNavigate('products'); }}
                  className="hover:text-cyan-300 text-slate-300 transition-colors"
                >
                  Genuine Spare Parts (By Drone Model)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('accessories'); onNavigate('products'); }}
                  className="hover:text-cyan-300 text-slate-300 transition-colors"
                >
                  Accessories & Intelligent Batteries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tutorials')}
                  className="hover:text-cyan-300 text-slate-300 transition-colors"
                >
                  Flight Academy Tutorials
                </button>
              </li>
            </ul>
          </div>

          {/* Flight Hubs */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Regional Flight Hubs
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><strong className="text-slate-200">Mackay HQ:</strong> Workshop, Warehouse & RMA</li>
              <li><strong className="text-slate-200">Brisbane Crew:</strong> Demonstration & Survey Support</li>
              <li><strong className="text-slate-200">Gold Coast Crew:</strong> Coastal & Infrastructure Audits</li>
              <li><strong className="text-slate-200">Sydney Crew:</strong> Enterprise Client Deployments</li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Customer & Commercial Support
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block">Toll-Free Phone:</span>
                <a 
                  href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                  className="text-white font-bold text-base hover:text-cyan-400 transition-colors"
                >
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block">Dispatch Email:</span>
                <a 
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="text-cyan-400 hover:underline"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
                >
                  Contact Technical Desk →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved. ABN {COMPANY_INFO.abn}.
          </div>
          <div className="flex items-center gap-4">
            <span>Australian Consumer Law (ACL) Compliant</span>
            <span>•</span>
            <span className="text-cyan-400 font-medium">10% GST Included on all items</span>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-400 hover:text-cyan-400 transition-colors font-medium"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
