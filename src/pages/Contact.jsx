import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/products';
import { 
  Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle2, 
  Send, Award, Truck 
} from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Commercial Fleet Inquiry',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/70 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition-colors';

  return (
    <div
      className="w-full min-h-screen py-10 px-4 sm:px-8 text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-hidden"
      style={{ backgroundColor: '#0F172A' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[250px] bg-cyan-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase block mb-2">
            Australian Technical Support &amp; Dispatch
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Contact DroneHab Australia
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Based in Mackay, Queensland with commercial rapid-response crews in Mackay, Brisbane, Gold Coast, and Sydney. Serving Bowen Basin mining operations and national industrial clients.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Central Headquarters Card */}
            <div className="p-6 sm:p-8 rounded-3xl space-y-5 border border-slate-700/80 bg-slate-800/50 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Central Engineering Base</h3>
                  <span className="text-xs text-slate-400 font-medium">Mackay, Queensland (HQ)</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="text-slate-400 font-semibold w-20 shrink-0">Address:</span>
                  <span>{COMPANY_INFO.address}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-slate-400 font-semibold w-20 shrink-0">ABN:</span>
                  <span>{COMPANY_INFO.abn} (Registered for GST)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-slate-400 font-semibold w-20 shrink-0">Hours:</span>
                  <span>Monday – Friday: 7:00 AM – 5:30 PM AEST</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700 space-y-3">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Toll-Free Phone:</span>
                  <a 
                    href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`} 
                    className="text-xl font-bold text-white hover:text-cyan-300 transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-cyan-400" />
                    <span>{COMPANY_INFO.phone}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Direct Email:</span>
                  <a 
                    href={`mailto:${COMPANY_INFO.email}`} 
                    className="text-sm font-semibold text-slate-200 hover:text-cyan-300 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>{COMPANY_INFO.email}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Regional Response Hubs */}
            <div className="p-6 rounded-2xl border border-slate-700/80 bg-slate-800/40 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Regional Commercial Flight Hubs
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
                  <span className="font-semibold text-slate-200">Mackay &amp; Bowen Basin:</span>
                  <span className="text-emerald-400 font-medium">Full Workshop &amp; Fleet Storage</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
                  <span className="font-semibold text-slate-200">Brisbane Crew:</span>
                  <span className="text-slate-400">Rapid Response &amp; Survey Support</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
                  <span className="font-semibold text-slate-200">Gold Coast Crew:</span>
                  <span className="text-slate-400">Infrastructure &amp; Thermal Audits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">Sydney Crew:</span>
                  <span className="text-slate-400">Commercial Pilot Demonstrations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl border border-slate-700/80 bg-slate-800/50 backdrop-blur-sm shadow-2xl shadow-black/20 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Send Us a Technical or Commercial Inquiry
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Our aviation team will review your payload requirements and provide quotation within 4 business hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Inquiry Dispatched Successfully</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Thank you, {formData.name || 'valued client'}. Our Mackay commercial flight specialist has received your message and will respond shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Lachlan Miller"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Corporate Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. lachlan@minecorp.com.au"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 0412 345 678"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Company / Trading Entity</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Bowen Basin Mining Operations Pty Ltd"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Subject of Inquiry</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/70 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="Commercial Fleet Inquiry">Commercial Fleet Airframe Procurement</option>
                      <option value="Agras Agricultural Spraying">Agras T50 Agricultural Spraying Solutions</option>
                      <option value="Thermal / Survey Payloads">Radiometric Thermal &amp; Surveying Payloads</option>
                      <option value="Genuine Spare Parts & Repairs">OEM Spare Parts &amp; RMA Workshop Repairs</option>
                      <option value="B2B Wholesale / Dealership">B2B Wholesale Account Application</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Operational Requirements / Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify target flight application, required flight time, payload type, or part numbers..."
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20 hover:shadow-cyan-500/30"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Inquiry to Mackay Engineering Team</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
