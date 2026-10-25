import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, MapPin, CalendarDays, CheckCircle2, ExternalLink, BarChart2, Layers } from 'lucide-react';

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

const significantProjects = [
  {
    client: 'BHP',
    year: '2025',
    title: 'Vegetation Offset Management, Reporting & Surveying',
    description:
      'Aerial surveying, weed-density mapping, treatment planning, GPS field reporting and compliance documentation supporting environmental offset monitoring and vegetation-condition assessment.',
    tags: ['Surveying', 'Weed Mapping', 'GPS Reporting', 'Compliance'],
    color: 'text-cyan-400 border-cyan-800/40 bg-cyan-950/30',
  },
  {
    client: 'BHP',
    year: '2025',
    title: 'Dysart Agistment Land Weed Spraying Program',
    description:
      'Site-specific treatment planning, chemical application and GPS-tracked spray records across agistment and mine-associated land.',
    tags: ['Chemical Application', 'GPS Tracking', 'Treatment Planning'],
    color: 'text-cyan-400 border-cyan-800/40 bg-cyan-950/30',
  },
  {
    client: 'Stanmore Resources',
    year: '2024–current',
    title: 'Offset Area Weed Control & Monitoring',
    description:
      'Aerial vegetation surveys, targeted weed control, GPS-mapped ground and drone application, monitoring and reporting supporting environmental compliance and rehabilitation.',
    tags: ['Weed Control', 'Aerial Survey', 'Environmental Compliance'],
    color: 'text-amber-400 border-amber-800/40 bg-amber-950/20',
  },
  {
    client: 'Stanmore Resources',
    year: '2024–current',
    title: 'South Walker Creek Mine Vegetation Management',
    description:
      'Mine-site aerial and ground weed control, weed-density surveying, treatment planning, GPS spray records, post-treatment monitoring and compliance reporting.',
    tags: ['Vegetation Management', 'Mine Site', 'Post-Treatment Monitoring'],
    color: 'text-amber-400 border-amber-800/40 bg-amber-950/20',
  },
];

export const Projects = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#05080F] text-slate-100">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/projects_hero.jpg"
            alt="Aerial view of Bowen Basin environmental offset and mining rehabilitation country"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05080F] via-[#05080F]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080F] via-transparent to-[#05080F]/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-28">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-mono">
            <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">Home</button>
            <span>/</span>
            <span className="text-cyan-400">Projects</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Field Work
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6 max-w-2xl animate-fadeInUp">
            Our{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl animate-fadeInUp">
            More than <span className="text-cyan-300 font-bold">10,000 ha</span> of environmental offsets under active management —
            case studies and significant programs across Bowen Basin mining and rehabilitation country.
          </p>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#05080F] to-transparent" />
      </section>

      {/* STATS BAND */}
      <section className="py-8 border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: '10,000+', label: 'Hectares Under Management' },
              { val: '97.62%', label: 'On-Target Application' },
              { val: '4', label: 'Campaigns (Cactus Control)' },
              { val: 'BHP + Stanmore', label: 'Registered Supplier' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400 mb-1">{s.val}</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CASE STUDY */}
      <section className="py-20 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-3">Featured Case Study</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-10">Headline Program</h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="relative overflow-hidden rounded-3xl border border-cyan-800/30 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
              <div className="grid lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  <img
                    src="/projects_cactus.jpg"
                    alt="Harrisia cactus control across environmental offset riparian corridor"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-l from-transparent to-slate-900/80 lg:to-slate-800/30" />
                  {/* Stat chips on image */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-slate-900/90 text-xs font-bold text-cyan-400 border border-cyan-800/60">560 ha</span>
                    <span className="px-3 py-1.5 rounded-full bg-slate-900/90 text-xs font-bold text-emerald-400 border border-emerald-800/60">97.62% on-target</span>
                    <span className="px-3 py-1.5 rounded-full bg-slate-900/90 text-xs font-bold text-amber-400 border border-amber-800/60">4 campaigns</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-400">Bowen Basin, QLD — Riparian Corridor</span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-4 leading-snug">
                    Harrisia Cactus Control Across a 560 ha Environmental Offset
                  </h3>

                  <p className="text-slate-400 leading-relaxed text-sm mb-6">
                    Harrisia cactus controlled across a 560 ha environmental offset along a riparian corridor
                    in the Bowen Basin — four campaigns, <span className="text-emerald-400 font-semibold">97.62% on-target application</span>,
                    every figure from the as-applied records.
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-7 py-5 border-y border-slate-700/50">
                    <div className="text-center">
                      <div className="text-xl font-black text-cyan-400">560</div>
                      <div className="text-xs text-slate-500 font-semibold mt-0.5">Hectares</div>
                    </div>
                    <div className="text-center border-x border-slate-700/50">
                      <div className="text-xl font-black text-emerald-400">97.62%</div>
                      <div className="text-xs text-slate-500 font-semibold mt-0.5">On-Target</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-black text-amber-400">4</div>
                      <div className="text-xs text-slate-500 font-semibold mt-0.5">Campaigns</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('contact')}
                    className="self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 hover:scale-105"
                  >
                    Request Full Records <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* OPERATIONS OVERVIEW */}
      <section className="py-10 px-6 sm:px-10 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <Reveal>
              <div>
                <p className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-3">Active Management</p>
                <h2 className="text-3xl font-black text-white mb-5 leading-tight">
                  Ongoing programs,<br />
                  <span className="text-slate-400">not one-off visits</span>
                </h2>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Dronehab actively manages more than <span className="text-cyan-300 font-semibold">10,000 hectares</span> of
                  environmental offset country for resource-sector clients — surveyed, treated and reported as ongoing
                  programs, not one-off visits.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    { icon: BarChart2, text: 'Variable-rate application along mine services corridors — live coverage and volume on the operator display' },
                    { icon: Layers, text: 'Self-contained mobilisation with aerial spray unit and field rig' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-slate-400">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
                <img
                  src="/about_two_aircraft.jpg"
                  alt="Variable-rate application along a mine services corridor"
                  className="w-full object-cover"
                  style={{ maxHeight: '320px' }}
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 to-transparent px-5 py-4">
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Dual Aircraft Operations</p>
                  <p className="text-sm text-slate-300 font-semibold">Variable-rate application — live coverage on operator display</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SIGNIFICANT PROJECTS */}
      <section className="py-20 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-3">Portfolio</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Significant Projects</h2>
            </div>
          </Reveal>

          <div className="space-y-5">
            {significantProjects.map((proj, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 transition-all duration-300 hover:scale-[1.01] ${proj.color}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Client + year */}
                    <div className="shrink-0 sm:w-40">
                      <div className={`text-sm font-black mb-1 ${proj.color.split(' ')[0]}`}>{proj.client}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays className="w-3 h-3" />
                        {proj.year}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-2">{proj.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4">{proj.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {proj.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-xs text-slate-300 font-semibold border border-slate-700/60">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Registered supplier note */}
          <Reveal delay={160}>
            <div className="mt-8 flex items-start gap-3 px-6 py-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                <span className="font-bold text-emerald-400">Registered / approved supplier</span> to BHP and Stanmore Resources.
                Full project records and references available on request.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 sm:px-10 bg-slate-900/40 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950/60 via-slate-800/80 to-slate-900/80 border border-cyan-800/30 p-10 sm:p-14 text-center">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  Have a site that needs managing?
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                  Tell us where the site is and what you need to achieve. We respond within the same business day.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => onNavigate('contact')}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base transition-all shadow-xl shadow-cyan-500/25 hover:scale-105"
                  >
                    Start a Conversation <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onNavigate('industries')}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/40 text-slate-200 font-bold text-base transition-all"
                  >
                    View Industries
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};
