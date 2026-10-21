import React, { useRef, useState, useEffect } from 'react';
import { HardHat, Wheat, Building2, Briefcase, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const industries = [
  {
    id: 'mining',
    icon: HardHat,
    label: 'Mining',
    accent: 'from-amber-500/20 to-orange-600/10',
    border: 'border-amber-700/30 hover:border-amber-500/60',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    tag: 'RESOURCE SECTOR',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-700/40',
    headline: 'Mine site operations, from extraction to rehabilitation',
    description:
      'Aerial rehabilitation, dust suppression, stockpile volumetrics, infrastructure inspection, and progressive closure documentation. We work to mine-site PPE, induction, and stakeholder reporting standards.',
    services: [
      'Aerial Rehabilitation',
      'Dust Suppression',
      'Stockpile Volumetrics',
      'Infrastructure Inspection',
      'Progressive Closure Documentation',
      'Stakeholder Reporting',
    ],
  },
  {
    id: 'agriculture',
    icon: Wheat,
    label: 'Agriculture',
    accent: 'from-emerald-500/20 to-green-600/10',
    border: 'border-emerald-700/30 hover:border-emerald-500/60',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    tag: 'AGRITECH',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-700/40',
    headline: 'Broadacre and horticulture precision aerial operations',
    description:
      'Precision spraying, prescription mapping, crop scouting, and pasture analysis for broadacre, horticulture, and grazing operations across Queensland and northern Australia.',
    services: [
      'Precision Spraying',
      'Prescription Mapping',
      'Crop Scouting',
      'Pasture Analysis',
      'Horticulture Operations',
      'Broadacre Coverage',
    ],
  },
  {
    id: 'government',
    icon: Building2,
    label: 'Government',
    accent: 'from-blue-500/20 to-cyan-600/10',
    border: 'border-blue-700/30 hover:border-blue-500/60',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    tag: 'PUBLIC SECTOR',
    tagColor: 'text-blue-400 bg-blue-500/10 border-blue-700/40',
    headline: 'Audit-ready documentation for council and agency work',
    description:
      'Council and agency work: weed management, riparian and catchment monitoring, asset inspection, and emergency-services support. All flights logged to CASA standard and delivered with audit-ready documentation.',
    services: [
      'Weed Management',
      'Riparian Monitoring',
      'Catchment Mapping',
      'Asset Inspection',
      'Emergency-Services Support',
      'CASA-Logged Documentation',
    ],
  },
  {
    id: 'consulting',
    icon: Briefcase,
    label: 'Consulting',
    accent: 'from-violet-500/20 to-purple-600/10',
    border: 'border-violet-700/30 hover:border-violet-500/60',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    tag: 'ADVISORY',
    tagColor: 'text-violet-400 bg-violet-500/10 border-violet-700/40',
    headline: 'Build an internal drone capability with the right foundation',
    description:
      'Specification and procurement support for organisations standing up internal drone capability — platform selection, finance, training pathway, and post-purchase support.',
    services: [
      'Platform Selection',
      'Procurement Specification',
      'Finance Pathways',
      'Training Programme',
      'Post-Purchase Support',
      'Fleet Strategy',
    ],
  },
];

export const Industries = ({ onNavigate }) => {
  const [active, setActive] = useState(null);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/industries_hero.jpg"
            alt="Drone operations across mining, agriculture, government and consulting industries"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/85 to-[#0F172A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-[#0F172A]/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-28">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan-400">Industries</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            INDUSTRY
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6 max-w-2xl animate-fadeInUp">
            Industries{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              We Serve
            </span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl animate-fadeInUp">
            Dronehab works across four industry verticals. Each one drives different platform choices,
            different deliverables, and different compliance overlays — but the same underlying capability:
            <span className="text-cyan-300 font-semibold"> precision aerial operations done by people who know the terrain.</span>
          </p>

          {/* Industry quick-nav pills */}
          <div className="flex flex-wrap gap-2.5 mt-8 animate-fadeInUp">
            {industries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => {
                  document.getElementById(ind.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${ind.tagColor} hover:scale-105`}
              >
                <ind.icon className="w-3.5 h-3.5" />
                {ind.label}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0F172A] to-transparent" />
      </section>

      {/* INDUSTRY CARDS */}
      <section className="py-16 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {industries.map((ind, i) => (
            <Reveal key={ind.id} delay={i * 80}>
              <div
                id={ind.id}
                className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm transition-all duration-300 ${ind.border}`}
              >
                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${ind.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-0">
                  {/* Left: main info */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className={`inline-flex items-center gap-2 self-start px-3 py-1 rounded-full border text-xs font-bold tracking-widest mb-5 ${ind.tagColor}`}>
                      <ind.icon className="w-3 h-3" />
                      {ind.tag}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${ind.iconBg}`}>
                        <ind.icon className={`w-7 h-7 ${ind.iconColor}`} />
                      </div>
                      <h2 className="text-3xl font-black text-white">{ind.label}</h2>
                    </div>

                    <h3 className="text-base font-semibold text-slate-300 mb-4 leading-snug">{ind.headline}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm mb-6">{ind.description}</p>

                    <button
                      onClick={() => onNavigate('contact')}
                      className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 hover:scale-105"
                    >
                      Talk to Us <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Right: services list */}
                  <div className="border-t lg:border-t-0 lg:border-l border-slate-700/50 p-8 lg:p-10 flex flex-col justify-center bg-slate-900/30">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">Services Include</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ind.services.map((svc) => (
                        <div key={svc} className="flex items-center gap-2.5 text-sm text-slate-300">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${ind.iconColor}`} />
                          {svc}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950/60 via-slate-800/80 to-slate-900/80 border border-cyan-800/30 p-10 sm:p-14 text-center">
              {/* decorative orbs */}
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6">
                  <MessageSquare className="w-3 h-3" />
                  Same-Day Response
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  Talk to us about your operation
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                  Tell us where the site is and what you need to achieve. We respond within the same business day.
                </p>

                <button
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base transition-all shadow-xl shadow-cyan-500/25 hover:scale-105"
                >
                  Start a Conversation <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};
