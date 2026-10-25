import React, { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck, Target, Eye, Leaf, Wrench, Phone, Mail,
  Award, CheckCircle2, ArrowRight, MapPin
} from 'lucide-react';

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.12 }
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
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const CredBadge = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-800/60 border border-cyan-800/40 hover:border-cyan-500/60 transition-all group">
    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center group-hover:bg-cyan-500/25 transition-colors">
      <Icon className="w-4 h-4 text-cyan-400" />
    </div>
    <span className="text-sm font-semibold text-slate-200">{label}</span>
  </div>
);

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-7 hover:border-cyan-600/40 transition-all duration-300 group">
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl bg-cyan-500" />
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(6,182,212,0.12)' }}>
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">{children}</p>
      </div>
    </div>
  </div>
);

export const About = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#05080F] text-slate-100 overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[72vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/about_hero.jpg"
            alt="DJI Agras T100 spraying lychee orchard at dawn"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05080F] via-[#05080F]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080F] via-transparent to-[#05080F]/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-24 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-mono">
              <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">Home</button>
              <span>/</span>
              <span className="text-cyan-400">About</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-5 animate-fadeInUp">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Mackay, Queensland — Est. 2019
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6 animate-fadeInUp">
              About{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                DroneHab
              </span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl animate-fadeInUp">
              Authorised DJI dealer and aerial operations specialist. We supply, support, and operate
              professional drone systems for mining, agriculture, government, and consulting clients across Australia.
            </p>
            <div className="flex flex-wrap gap-3 animate-fadeInUp">
              <button
                onClick={() => onNavigate('contact')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:scale-105"
              >
                Get in Touch <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/40 text-slate-200 font-semibold text-sm transition-all"
              >
                Our Services
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#05080F] to-transparent" />
      </section>

      {/* STATS STRIP */}
      <section className="py-8 border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: '10,000+', label: 'Hectares Under Management' },
              { val: '4', label: 'Industry Verticals' },
              { val: 'CASA', label: 'Registered Operator' },
              { val: 'DJI', label: 'Authorised Dealer' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="text-center">
                  <div className="text-3xl font-black text-cyan-400 mb-1">{s.val}</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-20 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <p className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-3">What We Do</p>
                <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                  Precision aerial work<br />
                  <span className="text-slate-400">where it matters most</span>
                </h2>
                <div className="space-y-5 text-slate-400 leading-relaxed">
                  <p>
                    We focus on industrial aerial work where <span className="text-cyan-300 font-semibold">precision, safety, and accountability</span> matter.
                    Aerial rehabilitation on mine sites, broadacre precision spraying, mapping and survey, and pilot
                    training built around CASA-compliant operations.
                  </p>
                  <p>
                    We sell the same DJI agricultural and enterprise hardware our customers see overseas — but we back
                    it with <span className="text-cyan-300 font-semibold">local support, finance pathways</span>, and a post-purchase platform that takes the
                    guesswork out of running a fleet.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    'Mine Site Rehabilitation',
                    'Precision Spraying',
                    'Mapping & Survey',
                    'Pilot Training',
                    'Fleet Management',
                    'CASA Compliance',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/10 to-blue-500/5 rounded-3xl blur-xl" />
                <img
                  src="/about_pilot.jpg"
                  alt="DroneHab pilot in command during field operations"
                  className="relative rounded-2xl w-full object-cover shadow-2xl shadow-black/50 border border-slate-700/50"
                  style={{ maxHeight: '460px' }}
                />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur rounded-xl px-4 py-3 border border-slate-700/60">
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Pilot in Command</p>
                  <p className="text-sm text-slate-200 font-semibold">Field Operations — Bowen Basin</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="py-20 px-6 sm:px-10 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-3">Purpose</p>
              <h2 className="text-4xl font-black text-white">Mission &amp; Vision</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal delay={80}>
              <SectionCard icon={Target} title="Our Mission">
                To lead industrial aerial work that holds itself to a higher standard — precision, safety, and
                accountability on every job, across every site. We supply the right hardware for the conditions
                and back it with operations expertise that proves it works.
              </SectionCard>
            </Reveal>
            <Reveal delay={160}>
              <SectionCard icon={Eye} title="Our Vision">
                A future where Australian mining, agriculture, and government operations are routinely supported
                by aerial systems that reduce risk, accelerate outcomes, and improve the land they touch.
              </SectionCard>
            </Reveal>
            <Reveal delay={240}>
              <SectionCard icon={Leaf} title="Commitment to Country & Environment">
                We operate where the work matters — on minesites under rehabilitation, on broadacre crops, on
                conservation projects, on Country. Sustainability is a constraint we design around. Lower chemical
                loads through precision application, less ground disturbance through aerial access, better data
                through high-resolution mapping. Every flight is built to leave the site better than we found it.
              </SectionCard>
            </Reveal>
            <Reveal delay={320}>
              <SectionCard icon={Wrench} title="Why We Built It This Way">
                Most drone shops either ship boxes or fly missions. We do both, because the customers we work
                with do not want a hardware vendor and a service provider — they want one team that understands
                the kit, the airspace, and the job.
              </SectionCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TWO AIRCRAFT */}
      <section className="py-20 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
              <img
                src="/about_two_aircraft.jpg"
                alt="Two aircraft working the same task"
                className="w-full object-cover"
                style={{ maxHeight: '420px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05080F] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-1">Dual-Aircraft Operations</p>
                  <h3 className="text-2xl font-black text-white">Two Aircraft on the Same Task</h3>
                  <p className="text-slate-400 text-sm mt-1">Maximum coverage, minimum downtime — across broadacre and mining country.</p>
                </div>
                <button
                  onClick={() => onNavigate('projects')}
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all"
                >
                  See Projects <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="py-20 px-6 sm:px-10 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <p className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-3">Credentials</p>
                <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                  Qualified, registered,<br />
                  <span className="text-slate-400">and accountable</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Every flight we conduct is backed by the appropriate qualifications, certifications, and
                  insurance. When we're on your site, you're covered.
                </p>
                <div className="space-y-3">
                  <CredBadge icon={Award} label="Authorised DJI Dealer" />
                  <CredBadge icon={ShieldCheck} label="CASA-Registered Operator" />
                  <CredBadge icon={CheckCircle2} label="ChemCert Accredited — Precision Spraying" />
                  <CredBadge icon={ShieldCheck} label="Public Liability Insured" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-800/60 border border-cyan-800/40 p-6">
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">Get In Touch</p>
                  <div className="space-y-4">
                    <a href="tel:1300544968" className="flex items-center gap-3 text-slate-200 hover:text-cyan-400 transition-colors group">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center group-hover:bg-cyan-500/25 transition-colors">
                        <Phone className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">PHONE</p>
                        <p className="text-sm font-bold">1300 544 968</p>
                      </div>
                    </a>
                    <a href="mailto:enquiries@dronehab.com.au" className="flex items-center gap-3 text-slate-200 hover:text-cyan-400 transition-colors group">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center group-hover:bg-cyan-500/25 transition-colors">
                        <Mail className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">EMAIL</p>
                        <p className="text-sm font-bold">enquiries@dronehab.com.au</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">BASED IN</p>
                        <p className="text-sm font-semibold">Mackay, QLD — Service area: QLD · NSW · VIC</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-800/40 border border-emerald-800/30 px-5 py-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-emerald-400">Registered / approved supplier</span> to BHP and Stanmore Resources.
                    Full project records and references available on request.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.02]"
                >
                  Start a Conversation <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  );
};
