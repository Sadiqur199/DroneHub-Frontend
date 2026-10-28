import React from 'react';
import { COMPANY_INFO } from '../../data/products';
import { Phone, Mail, MapPin, Award, Truck, Shield } from 'lucide-react';

export const Footer = ({ onNavigate, onSelectCategory }) => {
  return (
    <footer className="w-full bg-[#050607] border-t border-[rgba(255,255,255,0.1)] text-[#f2f4f3] text-sm mt-auto relative z-10">
      {/* Top CTA & Workshop Section from index1.html */}
      <div className="pad max py-20 border-b border-[rgba(255,255,255,0.1)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-6 space-y-4">
            <p className="disp h-m">
              Talk to the<br /><b>Mackay workshop.</b>
            </p>
            <p className="lede">
              Speak directly with our aviation engineers regarding heavy-lift agricultural spraying, sensor payloads, or OEM spare parts.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-wrap gap-4 lg:justify-end">
            <button
              onClick={() => onNavigate('contact')}
              className="b solid"
            >
              <span className="roll"><i>Start a conversation</i><i>Start a conversation</i></span>
              <span className="cell">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </button>

            <a
              href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
              className="b noarrow"
            >
              <span className="roll"><i>{COMPANY_INFO.phone}</i><i>{COMPANY_INFO.phone}</i></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main 4-Column Directory */}
      <div className="pad max py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Shop */}
          <div className="space-y-4">
            <h4 className="lbl text-[#f2f4f3] font-bold">Shop Fleet & Parts</h4>
            <ul className="space-y-2.5 text-xs text-[rgba(242,244,243,0.68)]">
              <li>
                <button
                  onClick={() => { onSelectCategory && onSelectCategory('drones'); onNavigate('shop'); }}
                  className="hover:text-[#00c5c1] transition-colors"
                >
                  Commercial Drones (T50, T100, M350)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory && onSelectCategory('parts'); onNavigate('shop'); }}
                  className="hover:text-[#00c5c1] transition-colors"
                >
                  Genuine Spare Parts
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory && onSelectCategory('accessories'); onNavigate('shop'); }}
                  className="hover:text-[#00c5c1] transition-colors"
                >
                  Accessories & Intelligent Batteries
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory && onSelectCategory('combos'); onNavigate('shop'); }}
                  className="hover:text-[#00c5c1] transition-colors"
                >
                  Turnkey Mining & Cinema Combos
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="lbl text-[#f2f4f3] font-bold">Company & Services</h4>
            <ul className="space-y-2.5 text-xs text-[rgba(242,244,243,0.68)]">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#00c5c1] transition-colors text-left"
                >
                  Commercial Drone Services & LiDAR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('industries')}
                  className="hover:text-[#00c5c1] transition-colors"
                >
                  Industries We Serve
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-[#00c5c1] transition-colors"
                >
                  Field Projects & Case Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#00c5c1] transition-colors"
                >
                  About DroneHab Australia
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Workshop */}
          <div className="space-y-4">
            <h4 className="lbl text-[#f2f4f3] font-bold">Mackay Central Base</h4>
            <ul className="space-y-2 text-xs text-[rgba(242,244,243,0.68)] font-mono">
              <li>{COMPANY_INFO.phone}</li>
              <li>{COMPANY_INFO.email}</li>
              <li>Cnr Gordon & Gregory Streets, Mackay QLD 4740</li>
              <li className="text-[#00c5c1]">Mon to Fri, 7:00 am to 5:30 pm AEST</li>
            </ul>
          </div>

          {/* Flight Hubs */}
          <div className="space-y-4">
            <h4 className="lbl text-[#f2f4f3] font-bold">Regional Flight Hubs</h4>
            <ul className="space-y-2 text-xs text-[rgba(242,244,243,0.68)]">
              <li><strong className="text-white">Mackay:</strong> Workshop, Warehouse & RMA</li>
              <li><strong className="text-white">Brisbane:</strong> Demonstration & Survey Support</li>
              <li><strong className="text-white">Gold Coast:</strong> Thermal & Infrastructure Audits</li>
              <li><strong className="text-white">Sydney:</strong> Enterprise Client Support</li>
            </ul>
          </div>
        </div>

        {/* Massive Animated Wordmark from index1.html */}
        <div className="wm select-none" aria-hidden="true">
          {"DRONEHAB".split("").map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </div>

        {/* Bottom Legal & Rights */}
        <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[rgba(242,244,243,0.48)]">
          <div>
            © 2026 DroneHab Australia Pty Ltd · ABN {COMPANY_INFO.abn}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[#00c5c1]">Authorised DJI Dealer</span>
            <span>·</span>
            <span>All prices AUD incl. 10% GST</span>
            <span>·</span>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-white transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
