import React, { useState } from 'react';
import { 
  Compass, Layers, Activity, Eye, Sun, Building2, 
  Leaf, Crosshair, Award, ArrowRight, Download, FileText, 
  CheckCircle2, ShieldCheck, MapPin, Phone, ExternalLink, 
  ChevronRight, Wrench, Sparkles, AlertCircle, FileCheck
} from 'lucide-react';

export const Services = ({ onNavigate }) => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 'mapping-survey',
      title: 'Survey & Spatial',
      icon: Compass,
      color: 'from-blue-500 to-cyan-400',
      description: 'Surveying, UAV mapping, LiDAR and spatial data for mining, civil, infrastructure, renewable energy and rehabilitation projects — field acquisition through to engineering and GIS-ready deliverables.',
      features: ['RTK/PPK Georeferenced', '0.2 cm/pixel GSD', 'RPEQ Certified']
    },
    {
      id: 'lidar-canopy-structure',
      title: 'Drone LiDAR Survey & Canopy Analysis',
      icon: Layers,
      color: 'from-cyan-500 to-teal-400',
      description: 'Zenmuse L3 laser scanning on the DJI Matrice 400 — terrain recovered beneath the canopy, and the vegetation above it classified and segmented to the individual tree.',
      features: ['Under-Canopy Terrain Recovery', 'Tree Individual Segmentation', 'Digital Elevation Models']
    },
    {
      id: 'multispectral-vegetation-analytics',
      title: 'Multispectral & Vegetation Analytics',
      icon: Activity,
      color: 'from-emerald-500 to-green-400',
      description: 'A dedicated DJI Mavic 3 Multispectral sensor — NIR, red-edge, red and green bands — computed into NDVI and related indices to map vegetation vigour, density and stress.',
      features: ['NDVI & NDRE Vegetation Indices', 'Plant Vigour Mapping', 'Broadacre Stress Analysis']
    },
    {
      id: 'thermal-survey-fauna-detection',
      title: 'Drone Thermal Survey & Fauna Detection',
      icon: Eye,
      color: 'from-amber-500 to-orange-400',
      description: 'Radiometric thermal on the Matrice 400 and Matrice 4T, flown day or night — hot-spot and asset inspection, and heat-signature detection of koalas, gliders and other cryptic fauna with nest-box screening.',
      features: ['Day & Night Flights', 'Koala & Glider Signatures', 'Nest-Box Thermal Screening']
    },
    {
      id: 'solar-pv-thermography',
      title: 'Solar PV Thermography',
      icon: Sun,
      color: 'from-yellow-400 to-amber-500',
      description: 'Aerial radiometric thermal and RGB inspection of photovoltaic plants — every module, referenced to block, row and string, delivered as an anomaly register your O&M team can act on.',
      features: ['IEC TS 62446-3 Compliant', 'Block, Row & String Geotagged', 'Actionable Anomaly Register']
    },
    {
      id: 'asset-inspection',
      title: 'UAV Asset Inspection',
      icon: Building2,
      color: 'from-blue-400 to-indigo-500',
      description: 'Close-visual, radiometric thermal and LiDAR inspection of structures and plant — no one at height, no shutdown for access, every finding located and rated in a defect register.',
      features: ['Zero Work-at-Height Risk', 'No Shutdown Required', 'Rated Structural Defect Register']
    },
    {
      id: 'aerial-rehabilitation',
      title: 'Mine Rehabilitation Seeding, Offsets & Environmental',
      icon: Leaf,
      color: 'from-emerald-400 to-teal-500',
      description: 'Offset and rehabilitation country managed end-to-end — baseline and repeat condition survey, declared-weed mapping and control, and reporting aligned to OAMP and EPBC obligations.',
      features: ['OAMP & EPBC Reporting', 'Baseline & Repeat Surveys', 'Declared Weed Eradication']
    },
    {
      id: 'precision-spraying',
      title: 'Drone Weed Spraying & Weed Control',
      icon: Crosshair,
      color: 'from-sky-400 to-blue-600',
      description: 'Detection, chemistry, application, verification and reporting inside one CASA-certified operation — aerial, ground, handheld and mechanical, matched to species, density and terrain.',
      features: ['DJI Agras T100 & Ground Fleet', 'Variable-Rate GPS Injection', 'Chemical Drift Control']
    },
    {
      id: 'training',
      title: 'Commercial Flight & Platform Training',
      icon: Award,
      color: 'from-purple-400 to-indigo-500',
      description: 'Onsite drone training for commercial operators stepping up to DJI Agras and enterprise platforms — including CASA and ChemCert pathway support.',
      features: ['Agras Heavy-Lift Endorsements', 'ChemCert & RePL Mentoring', 'Mackay Training Flight Strip']
    }
  ];

  const documents = [
    {
      title: 'Capability Statement 2026',
      desc: 'Services, fleet, credentials, prequalification and track record — the full procurement document.',
      meta: 'PDF · 1.5 MB',
      url: 'https://dronehab.com.au/wp-content/uploads/2026/08/Dronehab-Capability-Statement-2026.pdf'
    },
    {
      title: 'Thermal Fauna Detection Capability 2026',
      desc: 'Koala thermal detection and nest-box monitoring — method, evidence standard and field results.',
      meta: 'PDF · 1.1 MB',
      url: 'https://dronehab.com.au/wp-content/uploads/2026/08/Dronehab-Thermal-Fauna-Detection-Capability-2026-1.pdf'
    },
    {
      title: 'Survey & Spatial Capability 2026',
      desc: 'Mine and earthworks survey, UAV LiDAR, volumes, as-builts and GIS delivery — method, case example, systems and credentials.',
      meta: 'PDF · 4.7 MB',
      url: 'https://dronehab.com.au/wp-content/uploads/2026/09/Dronehab-Survey-Spatial-Capability-2026.pdf'
    },
    {
      title: 'Solar PV Thermography Capability 2026',
      desc: 'Aerial radiometric thermal inspection of PV plants to IEC TS 62446-3 — findings, classification, method and deliverables.',
      meta: 'PDF · 809.5 KB',
      url: 'https://dronehab.com.au/wp-content/uploads/2026/09/Dronehab-Solar-PV-Thermography-Capability-2026.pdf'
    },
    {
      title: 'UAV Asset Inspection Capability 2026',
      desc: 'Close-visual, radiometric thermal and LiDAR inspection of structures and plant — scope, sensors, method, deliverables and credentials.',
      meta: 'PDF · 3.4 MB',
      url: 'https://dronehab.com.au/wp-content/uploads/2026/10/Dronehab-UAV-Asset-Inspection-Capability-2026.pdf'
    }
  ];

  return (
    <div className="w-full min-h-screen text-slate-100 selection:bg-cyan-500 selection:text-white" style={{ backgroundColor: '#05080F' }}>
      
      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden border-b border-slate-800 pt-10 pb-16 px-4 sm:px-8">
        {/* Glow ambient backdrops */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-semibold">Services</span>
          </div>

          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full-Spectrum Commercial UAV & Land Operations</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Enterprise Drone Services & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                Spatial Land Management
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-3xl">
              Surveying, UAV LiDAR mapping, multispectral analytics, environmental offset management, and closed-loop weed control — executed end-to-end under one CASA-certified Australian operation.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9 SERVICE TILES GRID */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/70 hover:border-cyan-500/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} p-0.5 shadow-md shadow-cyan-900/20`}>
                      <div className="w-full h-full bg-slate-900/80 backdrop-blur-xs rounded-[10px] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-slate-700/50 text-slate-300 border border-slate-600/50">
                      Tier 1 Fleet
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {item.features.map((feat, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-slate-900/60 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-700/60 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('contact')}
                    className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Enquire or Quote</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <span className="text-[11px] text-slate-500 font-mono">CASA ReOC</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* CAPABILITY & METRICS BANNER */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-8 border-y border-slate-800 bg-slate-900/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Capability Statement</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              One crew, from first flight to final report.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Drone and ground-based weed control, aerial survey and mapping, multispectral and thermal analytics and compliance reporting — together under one CASA-certified operation. From a single mobilisation we can survey a site, map an infestation, treat it and report it: safe, accurate and auditable land-management outcomes for mining, government, environmental and agricultural clients, without handing work down a chain of subcontractors.
            </p>
          </div>

          {/* 4 Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-left space-y-1 hover:border-cyan-500/40 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono tracking-tight">22,000+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hectares Managed</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-left space-y-1 hover:border-cyan-500/40 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">10,000+ ha</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Offsets Under Management</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-left space-y-1 hover:border-cyan-500/40 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">8</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full-Time Specialists</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-left space-y-1 hover:border-cyan-500/40 transition-colors">
              <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono tracking-tight">QLD · NSW · VIC</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Operating Footprint</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CLOSED-LOOP WEED CONTROL (3 STEPS) */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Operational Methodology</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Closed-Loop Weed Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Most providers do one end of this. We do all three: map the weeds wall-to-wall, treat them with rate-controlled application, and hand back the audited record.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <span className="text-3xl font-black text-cyan-500/30 font-mono block">01</span>
            <h3 className="text-lg font-bold text-white">Detect</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Wall-to-wall aerial weed mapping over a survey-grade orthomosaic. Every infestation indexed with GPS coordinates.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <span className="text-3xl font-black text-cyan-500/30 font-mono block">02</span>
            <h3 className="text-lg font-bold text-white">Treat</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Variable-rate application — DJI Agras T100 aerial and GPS-guided ground units — held strictly on-target with droplet drift control.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <span className="text-3xl font-black text-cyan-500/30 font-mono block">03</span>
            <h3 className="text-lg font-bold text-white">Record</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              GPS spray records, product rates and treatment maps for every job. Full as-applied audit documentation delivered to clients.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-cyan-400">Run as a program, not a visit: </span>
          Baseline detection sets the treatment plan, every application is verified against it from GPS as-applied records, regrowth is monitored round-on-round against the baseline, and follow-up treatment is scheduled until control is achieved.
        </div>
      </section>

      {/* ========================================================= */}
      {/* GIS ENVIRONMENT & FLEET SPECIFICATION (2 COLUMNS) */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-8 border-y border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Built for your GIS */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-7 space-y-5">
            <div className="border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white">Built for your GIS and survey environment</h3>
              <p className="text-xs text-slate-400 mt-0.5">Seamless integration with client engineering & spatial data pipelines.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-cyan-300 block mb-0.5">Coordinate system</span>
                <p className="text-slate-300 leading-relaxed">
                  Delivered in your nominated datum and projection — e.g. GDA2020, MGA Zone 55 / 56. We work to your coordinate system, not ours.
                </p>
              </div>

              <div>
                <span className="font-bold text-cyan-300 block mb-0.5">Accuracy & control</span>
                <p className="text-slate-300 leading-relaxed">
                  RTK / PPK georeferencing with surveyed ground control and independent checkpoints; orthomosaics down to 0.2 cm/pixel GSD (typically 1.5–2.5 cm for broadacre survey), accuracy verified and reported per project.
                </p>
              </div>

              <div>
                <span className="font-bold text-cyan-300 block mb-0.5">Formats</span>
                <p className="text-slate-300 leading-relaxed">
                  Raster (GeoTIFF / ECW), vector / GIS (SHP, GeoPackage, KML / KMZ) with attribution and areas, CAD (DWG / DXF), point cloud (LAS / LAZ), plus CSV and PDF map products.
                </p>
              </div>

              <div>
                <span className="font-bold text-cyan-300 block mb-0.5">Certification</span>
                <p className="text-slate-300 leading-relaxed">
                  Survey-grade outputs certified by our RPEQ surveyor; environmental deliverables reviewed by our ecologist / Suitably Qualified Person.
                </p>
              </div>

              <div>
                <span className="font-bold text-cyan-300 block mb-0.5">Data handling</span>
                <p className="text-slate-300 leading-relaxed">
                  All project data held commercial-in-confidence; deliverable ownership and access arrangements set per engagement.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Owned & Field-Ready */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-7 space-y-5">
            <div className="border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white">Owned and field-ready fleet</h3>
              <p className="text-xs text-slate-400 mt-0.5">In-house hardware deployed directly from our Mackay depot.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                <span className="font-bold text-cyan-300 block uppercase tracking-wider text-[11px]">Aerial Platforms</span>
                <ul className="space-y-1 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span><strong>DJI Matrice 400</strong> — heavy-lift survey & inspection (Phase One iXM, Zenmuse H30T, Zenmuse L3 LiDAR)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span><strong>DJI Matrice 4T</strong> — radiometric thermal & rapid inspection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span><strong>DJI Mavic 3 Multispectral</strong> — NDVI & crop stress analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span><strong>DJI Agras T100</strong> — aerial spray & precision broadacre spreading</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1.5">
                <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[11px]">Ground Operations</span>
                <p className="text-slate-300 leading-relaxed">
                  GPS-enabled UTV spray units; boom and spot-spray equipment. Handheld and knapsack units; chainsaw / cut-stump treatment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1.5">
                <span className="font-bold text-indigo-400 block uppercase tracking-wider text-[11px]">Data, Field & Logistics Support</span>
                <p className="text-slate-300 leading-relaxed">
                  GPS tracking, mapping & GIS software; spray-diary and application recording. Field tablets and digital reporting; mine-compliant vehicles; DG storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FIELD-PROVEN CASE STUDY (BOWEN BASIN OFFSET) */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/60 to-slate-900 border border-cyan-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider inline-block">
                Field-Proven · Bowen Basin
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Harrisia cactus control across a 560 ha environmental offset
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                A 560 ha riparian offset in the Bowen Basin, evidenced to compliance standard: high-resolution aerial survey to find every infestation, variable-rate application to treat it, and as-applied records to prove it — over four campaigns.
              </p>
              <p className="text-[11px] text-slate-400 italic">
                Every figure drawn directly from the survey and as-applied application records. Site and client details withheld; full records available on request.
              </p>
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-600/30"
              >
                <span>Read Full Case Study Records</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-center space-y-0.5">
                <div className="text-2xl font-black text-cyan-400 font-mono">560 ha</div>
                <div className="text-[11px] text-slate-400">Environmental Offset</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-center space-y-0.5">
                <div className="text-2xl font-black text-white font-mono">4</div>
                <div className="text-[11px] text-slate-400">Treatment Campaigns</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-center space-y-0.5">
                <div className="text-2xl font-black text-emerald-400 font-mono">97.62%</div>
                <div className="text-[11px] text-slate-400">On-Target Application</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-center space-y-0.5">
                <div className="text-2xl font-black text-white font-mono">4 / 4</div>
                <div className="text-[11px] text-slate-400">Rate Quality "Good"</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CERTIFICATIONS & SITE-READY ACCREDITATIONS */}
      {/* ========================================================= */}
      <section className="py-14 px-4 sm:px-8 border-y border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
            Accreditations, Compliance & Tier-1 Prequalification
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <span className="font-bold text-cyan-300 block uppercase tracking-wider text-[11px]">Certified</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• CASA ReOC Accreditation</li>
                <li>• Chief Remote Pilot (RePL)</li>
                <li>• CASA approval above 400 ft</li>
                <li>• ChemCert / AHCCHM307</li>
                <li>• RPEQ surveyor, in-house</li>
                <li>• Ecologist / SQP, in-house</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[11px]">Site-Ready</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• Mine-inducted crews</li>
                <li>• Job-specific SWMS</li>
                <li>• Zero recordable injuries</li>
                <li>• $20M Public liability insured</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <span className="font-bold text-amber-400 block uppercase tracking-wider text-[11px]">Prequalified</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• Avetta Certified</li>
                <li>• Pegasus / Onsite Track Easy</li>
                <li>• ICN Gateway Verified</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <span className="font-bold text-purple-400 block uppercase tracking-wider text-[11px]">Approved Supplier</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• BHP Approved Vendor</li>
                <li>• Stanmore Resources</li>
                <li>• Regional QLD Infrastructure</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CAPABILITY DOCUMENTS (DOWNLOADABLE PDF STATEMENTS) */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Procurement Assets</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Capability Documents & Technical Statements
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Download formal capability packs for procurement review, engineering specifications, and client onboarding.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{documents.length} PDF Statements</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/50 rounded-2xl p-5 space-y-3 flex flex-col justify-between transition-all group shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/50">
                    {doc.meta}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {doc.title}
                </h4>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {doc.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* CTA BOTTOM BAR */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-8 border-t border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto bg-slate-800/60 border border-slate-700 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to mobilse our crew to your site?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Direct deployment across the Bowen Basin, regional Queensland, NSW, and Victoria. Certified CASA ReOC flight crew ready for surveying, LiDAR or weed control.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/25 hover:scale-105"
            >
              <span>Request a Project Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:1300544968"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all border border-slate-700"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Call 1300 544 968</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
