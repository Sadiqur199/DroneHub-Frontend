import React, { useState, useEffect } from 'react';
import { DRONES, COMBOS } from '../data/products';

// Data from index1.html
const SCANS = [
  {
    k: "LiDAR",
    title: "Drone LiDAR Survey & Canopy Analysis",
    d: "Zenmuse L3 laser scanning on the DJI Matrice 400. Terrain recovered beneath the canopy, and the vegetation above it classified and segmented to the individual tree.",
    f: ["Under-Canopy Terrain Recovery", "Tree Individual Segmentation", "Digital Elevation Models"],
    img: "/img/scan-corridor.webp",
    grad: "linear-gradient(90deg,#0b3b44,#00a7a3,#7fd6b0,#e0c27a,#f08a3c)",
    lo: "Low (0 m)",
    hi: "High elevation (+240 m)"
  },
  {
    k: "Multispectral",
    title: "Multispectral & Vegetation Analytics",
    d: "A dedicated DJI Mavic 3 Multispectral sensor (NIR, red-edge, red and green bands) computed into NDVI and related indices to map vegetation vigour, density and stress.",
    f: ["NDVI & NDRE Vegetation Indices", "Plant Vigour Mapping", "Broadacre Stress Analysis"],
    img: "/img/field-ndvi.webp",
    grad: "linear-gradient(90deg,#9b2c1f,#e0a33a,#d7d36a,#63b04a,#1f7a3a)",
    lo: "Low vigour (0.0)",
    hi: "High vigour (NDVI 0.95)"
  },
  {
    k: "Thermal",
    title: "Drone Thermal Survey & Fauna Detection",
    d: "Radiometric thermal on the Matrice 400 and Matrice 4T, flown day or night. Hot-spot and asset inspection, and heat-signature detection of koalas, gliders and cryptic fauna.",
    f: ["Day & Night Flights", "Koala & Glider Signatures", "Nest-Box Thermal Screening"],
    img: "/img/scan-pit.webp",
    grad: "linear-gradient(90deg,#05000f,#5a0773,#d9263f,#ff990d,#ffffd9)",
    lo: "Cool (14°C)",
    hi: "Hot · fauna signatures (38°C)"
  }
];

const AGRAS_VARIANTS = {
  t40: {
    name: "DJI Agras T40",
    id: "dji-agras-t40",
    price: 2650000,
    img: "/img/t40.webp",
    payload: "40 kg Spray / 50 kg Spread",
    swath: "Up to 11 Meters",
    flight: "26 Min Loaded Flight",
    radar: "Active Phased Array",
    stock: 5,
    items: [
      { id: "part-t40-nozzles", name: "Agras T40 Centrifugal Dual Atomizing Nozzle Kit", price: 38000 },
      { id: "part-t40-props", name: "Agras T40 54-inch Heavy-Duty Carbon Propeller Pair", price: 26000 },
      { id: "acc-t40-battery", name: "DJI DB1560 Flight Battery for T40 (30,000 mAh)", price: 285000 },
      { id: "acc-t40-spreader", name: "Agras T40 70L Spreading System 3.0", price: 220000 },
      { id: "acc-t40-generator", name: "Agras T40 7200W Multifunction EFI Generator", price: 360000 },
    ]
  },
  t50: {
    name: "DJI Agras T50",
    id: "dji-agras-t50",
    price: 3250000,
    img: "/img/t50.webp",
    payload: "40 kg Spray / 50 kg Spread (75 L)",
    swath: "Up to 11 Meters",
    flight: "25 Min Loaded Flight",
    radar: "Active Phased Array 360° Radar",
    stock: 3,
    items: [
      { id: "part-t50-nozzles", name: "Agras T50 Centrifugal Atomized Spray Nozzle Kit (Pair)", price: 42000 },
      { id: "part-t50-rotors", name: "Agras T50 Heavy-Lift Carbon Fiber Propeller Pair (54-inch)", price: 28000 },
      { id: "acc-t50-battery", name: "DJI DB1560 Intelligent Flight Battery (30,000 mAh)", price: 285000 },
      { id: "acc-t50-spreader", name: "Agras T50 75L High-Capacity Granule Spreading System", price: 240000 },
      { id: "acc-t50-charger", name: "Agras T50 9000W Intelligent Fast Inverter Generator & Charger", price: 395000 },
    ]
  },
  t70: {
    name: "DJI Agras T70",
    id: "dji-agras-t70",
    price: 3850000,
    img: "/img/t70.webp",
    payload: "55 kg Spray / 70 kg Spread (90 L)",
    swath: "Up to 14 Meters",
    flight: "24 Min Loaded Flight",
    radar: "360° Omnidirectional Radar",
    stock: 3,
    items: [
      { id: "part-t70-nozzles", name: "Agras T70 Quad Centrifugal Atomizing Nozzles Kit", price: 58000 },
      { id: "part-t70-props", name: "Agras T70 56-inch Carbon Folding Propeller Pair", price: 32000 },
      { id: "acc-t70-battery", name: "DJI DB1800 Intelligent Flight Battery (35,000 mAh)", price: 325000 },
      { id: "acc-t70-spreader", name: "Agras T70 90L Dry Granule Spreading Hopper System", price: 275000 },
      { id: "acc-t70-charger", name: "Agras T70 10000W Inverter Fast Field Charger", price: 440000 },
    ]
  },
  t100: {
    name: "DJI Agras T100",
    id: "dji-agras-t100",
    price: 4890000,
    img: "/img/t100.webp",
    payload: "75 kg Spray / 100 kg Spread (120 L)",
    swath: "Up to 16 Meters",
    flight: "22 Min Loaded Flight",
    radar: "Dual Active Phased Array",
    stock: 2,
    items: [
      { id: "part-t100-props", name: "Agras T100 60-inch Carbon Coaxial Propeller Set (4 Blades)", price: 38000 },
      { id: "part-t100-pump", name: "Agras T100 Dual High-Flow Brushless Impeller Pump (32 L/min)", price: 115000 },
      { id: "acc-t100-battery", name: "DJI DB2000 Ultra-High Energy Flight Battery (40,000 mAh)", price: 365000 },
      { id: "acc-t100-spreader", name: "Agras T100 120L Forestry & Broadacre Granule Spreader", price: 320000 },
      { id: "acc-t100-gen", name: "Agras T100 12000W Intelligent EFI Fast Generator & Charger", price: 520000 },
    ]
  }
};

const FLEET_ITEMS = [
  { id: "dji-matrice-350-rtk", sku: "DH-M350-RTK", name: "DJI Matrice 350 RTK", brand: "DJI Enterprise", price: 1499900, flight: "55 Min Max Flight Time", img: "/img/m350.webp" },
  { id: "dji-agras-t100", sku: "DH-AG-T100", name: "DJI Agras T100 Heavy-Lift", brand: "DJI Agriculture", price: 4890000, flight: "22 Min Loaded Flight Time", img: "/img/t100.webp" },
  { id: "dji-agras-t70", sku: "DH-AG-T70", name: "DJI Agras T70 Broadacre", brand: "DJI Agriculture", price: 3850000, flight: "24 Min Loaded Flight Time", img: "/img/t70.webp" },
  { id: "dji-agras-t50", sku: "DH-AG-T50", name: "DJI Agras T50 Broadacre", brand: "DJI Agriculture", price: 3250000, flight: "25 Min Loaded Flight Time", img: "/img/t50.webp" },
  { id: "dji-agras-t40", sku: "DH-AG-T40", name: "DJI Agras T40 Commercial", brand: "DJI Agriculture", price: 2650000, flight: "26 Min Loaded Flight Time", img: "/img/t40.webp" },
  { id: "dji-mavic-3-thermal", sku: "DH-M3T-EXP", name: "DJI Mavic 3 Thermal", brand: "DJI Enterprise", price: 849900, flight: "45 Min Max Flight Time", img: "/img/m3t.webp" },
  { id: "dji-inspire-3", sku: "DH-INS3-CINE", name: "DJI Inspire 3 8K Cinema", brand: "DJI Pro", price: 2399000, flight: "28 Min Max Flight Time", img: "/img/ins3.webp" },
  { id: "combo-bowen-basin-mining", sku: "DH-BBN-RTK-BNDL", name: "Bowen Basin Coal Mine Combo", brand: "DroneHab Engineered", price: 3499000, flight: "Continuous Hot-Swappable 8x Batteries", img: "/img/combo-mine.webp" },
  { id: "combo-inspire3-cinema", sku: "DH-INS3-BUNDLE", name: "Inspire 3 Cinema Master Combo", brand: "DJI Pro", price: 2999000, flight: "28 Min per battery set", img: "/img/combo-cine.webp" },
  { id: "combo-mavic3-bushfire", sku: "DH-M3T-COMBO", name: "Mavic 3T Rapid Response Combo", brand: "DJI Enterprise", price: 1089000, flight: "Up to 180 Min Combined Rotation", img: "/img/combo-m3t.webp" },
];

const INDUSTRIES = [
  {
    id: "mining",
    label: "Mining",
    tag: "Resource sector",
    img: "/img/scan-pit.webp",
    head: "Mine site operations, from extraction to rehabilitation",
    d: "Aerial rehabilitation, dust suppression, stockpile volumetrics, infrastructure inspection, and progressive closure documentation. We work to mine-site PPE, induction, and stakeholder reporting standards."
  },
  {
    id: "agriculture",
    label: "Agriculture",
    tag: "Agritech",
    img: "/img/photo-sky.webp",
    head: "Broadacre and horticulture precision aerial operations",
    d: "Precision spraying, prescription mapping, crop scouting, and pasture analysis for broadacre, horticulture, and grazing operations across Queensland and northern Australia."
  },
  {
    id: "government",
    label: "Government",
    tag: "Public sector",
    img: "/img/scan-corridor.webp",
    head: "Audit-ready documentation for council and agency work",
    d: "Council and agency work: weed management, riparian and catchment monitoring, asset inspection, and emergency-services support. All flights logged to CASA standard with audit-ready documentation."
  },
  {
    id: "consulting",
    label: "Consulting",
    tag: "Advisory",
    img: "/img/scan-canopy.webp",
    head: "Build an internal drone capability with the right foundation",
    d: "Specification and procurement support for organisations standing up internal drone capability: platform selection, finance, training pathway, and post-purchase support."
  }
];

const CREDENTIALS = [
  "BHP approved vendor",
  "Stanmore Resources",
  "CASA ReOC Accreditation",
  "ChemCert AHCCHM307",
  "RPEQ surveyor in-house",
  "Avetta certified",
  "ICN Gateway verified",
  "$20M public liability insured"
];

const money = (c) => "$" + (c / 100).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const gst = (c) => Math.round(c / 11);

export const Home = ({ onNavigate, onSelectProduct, onAddToCart, onSelectCategory }) => {
  // Anatomy section state
  const [anatStep, setAnatStep] = useState(0);
  const [explodeFactor, setExplodeFactor] = useState(0.2);

  // Sensor section state
  const [scanMode, setScanMode] = useState(0);

  // Configurator state
  const [cfgVariant, setCfgVariant] = useState('t50');
  const [cfgQuantities, setCfgQuantities] = useState({});
  const [toastMsg, setToastMsg] = useState("");

  // Live Mackay clock
  const [mackayTime, setMackayTime] = useState("");
  const [isWorkshopOpen, setIsWorkshopOpen] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      try {
        const parts = Object.fromEntries(
          new Intl.DateTimeFormat("en-AU", {
            timeZone: "Australia/Brisbane",
            weekday: "short",
            hour: "numeric",
            minute: "numeric",
            hour12: false
          }).formatToParts(new Date()).map(x => [x.type, x.value])
        );
        const h = (+parts.hour) % 24;
        const m = +parts.minute;
        const open = !["Sat", "Sun"].includes(parts.weekday) && h * 60 + m >= 420 && h * 60 + m < 1050;
        setMackayTime(`${String(h).padStart(2, "0")}:${parts.minute}`);
        setIsWorkshopOpen(open);
      } catch (e) {
        setMackayTime("10:00");
        setIsWorkshopOpen(true);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleQtyChange = (variantKey, itemId, delta) => {
    const key = `${variantKey}:${itemId}`;
    setCfgQuantities(prev => {
      const current = prev[key] || 0;
      const next = Math.max(0, Math.min(20, current + delta));
      return { ...prev, [key]: next };
    });
  };

  const currentAgras = AGRAS_VARIANTS[cfgVariant];
  const cfgSum = currentAgras.price + currentAgras.items.reduce((acc, it) => {
    const q = cfgQuantities[`${cfgVariant}:${it.id}`] || 0;
    return acc + it.price * q;
  }, 0);

  const handleAddKitToCart = () => {
    onAddToCart({
      id: currentAgras.id,
      name: currentAgras.name,
      price: currentAgras.price / 100,
      image: currentAgras.img,
      qty: 1
    });

    currentAgras.items.forEach(it => {
      const q = cfgQuantities[`${cfgVariant}:${it.id}`] || 0;
      if (q > 0) {
        onAddToCart({
          id: it.id,
          name: it.name,
          price: it.price / 100,
          image: currentAgras.img,
          qty: q
        });
      }
    });

    showToast(`Added ${currentAgras.name} Kit to cart`);
  };

  const handleSelectFleetItem = (item) => {
    // Look up in products data or craft item
    const matched = [...DRONES, ...COMBOS].find(p => p.id === item.id) || {
      id: item.id,
      name: item.name,
      short: item.name,
      price: item.price / 100,
      image: item.img,
      description: item.flight,
      brand: item.brand,
      sku: item.sku,
      specs: []
    };
    onSelectProduct(matched);
  };

  return (
    <div className="w-full text-[#f2f4f3] relative" style={{ background: "var(--bg)" }}>
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#f2f4f3] text-[#050607] px-6 py-3 rounded-full font-mono text-sm shadow-2xl flex items-center gap-4 transition-all">
          <span className="dot" style={{ background: "#00c5c1" }}></span>
          <span>{toastMsg}</span>
          <button 
            onClick={() => onNavigate('cart')}
            className="font-bold underline ml-2 cursor-pointer hover:opacity-80"
          >
            View Cart
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. HERO SECTION (index1.html #s-hero) */}
      {/* ========================================================= */}
      <section className="relative min-h-[92vh] flex items-end pad phero overflow-hidden pb-24 pt-32">
        {/* Background photo with high-tech radial & directional scrims */}
        <div 
          className="bgph" 
          style={{ 
            backgroundImage: "url('/img/photo-spray.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center 35%"
          }}
          aria-hidden="true"
        />

        <div className="max w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-9 space-y-6">
              <p className="lbl" style={{ fontSize: "15px", color: "var(--fg-2)" }}>
                Authorised DJI dealer in Mackay, Queensland, since 2019
              </p>
              
              <h1 className="disp h-xl tracking-tight">
                <b>COMMERCIAL DRONES.</b><br />
                GENUINE SPARES.<br />
                AERIAL OPERATIONS.
              </h1>

              <p className="lede">
                Heavy-lift agricultural spraying drones, radiometric thermal survey platforms and certified factory replacement parts. Serviced in our Mackay workshop, with rapid deployment support across Brisbane, Sydney and the Gold Coast.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => {
                    onSelectCategory && onSelectCategory('drones');
                    onNavigate('shop');
                  }}
                  className="b solid"
                >
                  <span className="roll"><i>Explore the fleet</i><i>Explore the fleet</i></span>
                  <span className="cell">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="b noarrow"
                >
                  <span className="roll"><i>Commercial services</i><i>Commercial services</i></span>
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  className="b noarrow text-[#00c5c1] border-[#00c5c1]/30 hover:border-[#00c5c1]"
                >
                  <span className="roll"><i>Contact Workshop</i><i>Contact Workshop</i></span>
                </button>
              </div>
            </div>

            {/* Rotating Circle Action Button */}
            <div className="lg:col-span-3 hidden lg:flex justify-end">
              <a
                href="#s-anat"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('s-anat')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="circ cursor-pointer"
                aria-label="Scroll to explore airframe"
              >
                <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
                  <defs>
                    <path id="circlePathHero" d="M50 50m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" />
                  </defs>
                  <text>
                    <textPath href="#circlePathHero">Scroll to explore · Scroll to explore · </textPath>
                  </text>
                </svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 4v16M6 14l6 6 6-6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. AIRFRAME ANATOMY SECTION (index1.html #s-anat) */}
      {/* ========================================================= */}
      <section className="relative min-h-[90vh] flex items-center pad py-28 border-t border-[rgba(255,255,255,0.1)]" id="s-anat">
        <div className="max w-full">
          <div className="anat-g">
            {/* Left Description & Step Controls */}
            <div className="space-y-6">
              <p className="lbl">Featured airframe · DH-AG-T50</p>
              <h2 className="disp h-l">Agras <b>T50</b></h2>
              
              <div className="flex gap-2">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAnatStep(idx);
                      setExplodeFactor(idx === 0 ? 0.15 : idx === 1 ? 0.6 : 1.0);
                    }}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      idx <= anatStep ? "w-10 bg-[#f2f4f3]" : "w-6 bg-[rgba(255,255,255,0.22)]"
                    }`}
                    aria-label={`Step ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Step Content */}
              <div className="min-h-[180px] space-y-4">
                {anatStep === 0 && (
                  <div className="space-y-4 animate-fadeIn">
                    <p className="lede">
                      Engineered specifically for heavy-duty Australian agricultural contractors. 50 kg spreading and 40 kg spraying capacity, designed for broadacre sugarcane in Mackay and pastoral grazing stations.
                    </p>
                    <p className="lbl text-[#00c5c1]">Interactive: drag slider below to take it apart</p>
                    <div className="chips pt-2">
                      <span className="chip">Spray 40 kg · 16 L/min</span>
                      <span className="chip">Spread 50 kg · 75 L</span>
                      <span className="chip">Radar 360°</span>
                      <span className="chip">54-inch props</span>
                      <span className="chip">IPX6K</span>
                    </div>
                  </div>
                )}

                {anatStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <p className="lede">
                      Dual atomized centrifugal spray nozzles provide uniform droplet penetration through dense crop canopies. Swap from spraying to spreading in under 3 minutes.
                    </p>
                    <div className="chips pt-2">
                      <span className="chip">Atomizer 50–500 μm</span>
                      <span className="chip">Magnetic Impeller</span>
                      <span className="chip">Anti-drift Vortex</span>
                    </div>
                  </div>
                )}

                {anatStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <p className="lede">
                      Active Phased Array Radar and dual binocular vision systems maintain terrain following even on undulating hillsides and steep slopes.
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <button
                        onClick={() => {
                          const t50Obj = DRONES.find(d => d.id === 'dji-agras-t50') || { id: 'dji-agras-t50', name: 'DJI Agras T50', price: 32500 };
                          onSelectProduct(t50Obj);
                        }}
                        className="b sm"
                      >
                        <span className="roll"><i>T50 details</i><i>T50 details</i></span>
                        <span className="cell">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                        </span>
                      </button>
                      <span className="disp text-2xl font-bold font-mono text-[#00c5c1]">$32,500.00</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Explode manual slider */}
              <div className="pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-2">
                <div className="flex justify-between text-xs font-mono text-[rgba(242,244,243,0.68)]">
                  <span>Assembled</span>
                  <span className="text-[#00c5c1] uppercase font-bold">Exploded Sub-Assemblies</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={explodeFactor} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setExplodeFactor(val);
                    if (val < 0.33) setAnatStep(0);
                    else if (val < 0.66) setAnatStep(1);
                    else setAnatStep(2);
                  }}
                  className="w-full accent-[#00c5c1] cursor-pointer h-1.5 bg-[rgba(255,255,255,0.15)] rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Right: Exploded Airframe Stage */}
            <div className="relative">
              <div className="xstage" role="img" aria-label="DJI Agras T50 separating into its main assemblies">
                {/* Ghost base outline */}
                <img 
                  className="xghost transition-opacity duration-500" 
                  src="/img/t50x-ghost.webp" 
                  alt="" 
                  style={{ opacity: 0.12 + explodeFactor * 0.25 }}
                />

                {/* Core */}
                <div 
                  className="xl" 
                  style={{
                    left: "34.698%",
                    top: "13.375%",
                    width: "33.922%",
                    transform: `translate(0px, ${explodeFactor * 18}px)`
                  }}
                >
                  <img src="/img/t50x-core.webp" alt="T50 Core Avionics" />
                  <span className="xc l" style={{ left: "7.6%", top: "90.5%", opacity: Math.min(1, explodeFactor * 2) }}>
                    <i></i>
                    <span><b>Washdown rating</b>IPX6K Sealed</span>
                  </span>
                </div>

                {/* Left Arm & Prop */}
                <div 
                  className="xl" 
                  style={{
                    left: "3.362%",
                    top: "6.0%",
                    width: "37.241%",
                    transform: `translate(${-explodeFactor * 42}px, ${-explodeFactor * 26}px)`
                  }}
                >
                  <img src="/img/t50x-armL.webp" alt="T50 Coaxial Arm Left" />
                  <span className="xc up" style={{ left: "7.8%", top: "24%", opacity: Math.min(1, explodeFactor * 2) }}>
                    <i></i>
                    <span><b>Coaxial rotors</b>54-inch carbon props</span>
                  </span>
                </div>

                {/* Right Arm & Prop */}
                <div 
                  className="xl" 
                  style={{
                    left: "45.948%",
                    top: "3.25%",
                    width: "53.276%",
                    transform: `translate(${explodeFactor * 42}px, ${-explodeFactor * 26}px)`
                  }}
                >
                  <img src="/img/t50x-armR.webp" alt="T50 Coaxial Arm Right" />
                  <span className="xc l" style={{ left: "79.6%", top: "93%", opacity: Math.min(1, explodeFactor * 2) }}>
                    <i></i>
                    <span><b>Centrifugal atomisers</b>50–500 μm · 16 L/min</span>
                  </span>
                </div>

                {/* Spray Tank */}
                <div 
                  className="xl" 
                  style={{
                    left: "40.603%",
                    top: "2.625%",
                    width: "18.793%",
                    transform: `translate(0px, ${-explodeFactor * 46}px) scale(${1 + explodeFactor * 0.08})`
                  }}
                >
                  <img src="/img/t50x-tank.webp" alt="T50 Spray Tank" />
                  <span className="xc" style={{ left: "84%", top: "52%", opacity: Math.min(1, explodeFactor * 2) }}>
                    <i></i>
                    <span><b>Spray / spread payload</b>40 kg · 50 kg (75 L)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. CLOSED-LOOP WEED CONTROL OPERATIONS (index1.html #s-flight) */}
      {/* ========================================================= */}
      <section className="relative min-h-[85vh] flex items-center pad phero py-28 border-t border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div 
          className="bgph" 
          style={{ 
            backgroundImage: "url('/img/photo-aerial.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
          aria-hidden="true"
        />

        <div className="max w-full relative z-10 space-y-6">
          <p className="lbl">Closed-loop weed control · Bowen Basin</p>
          <h2 className="disp h-l">
            <b>Detect.</b> Treat.<br />Record.
          </h2>
          <p className="lede">
            Map the weeds wall-to-wall, treat them with rate-controlled application, and hand back the audited record. One crew, from first flight to final report, under one CASA-certified operation.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('services')}
              className="b sm"
            >
              <span className="roll"><i>Commercial services</i><i>Commercial services</i></span>
              <span className="cell">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </button>
          </div>

          <div className="statline">
            <div>
              <div className="stat text-[#00c5c1]">22,000+</div>
              <p className="lbl">Hectares managed</p>
            </div>
            <div>
              <div className="stat">10,000+ ha</div>
              <p className="lbl">Offsets under management</p>
            </div>
            <div>
              <div className="stat">97.62%</div>
              <p className="lbl">On-target application</p>
            </div>
            <div>
              <div className="stat">8</div>
              <p className="lbl">Full-time specialists</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. LIVE SENSING SECTION (index1.html #s-scan) */}
      {/* ========================================================= */}
      <section className="relative pad py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-6 space-y-6">
              <p className="lbl">Same site, three sensors</p>
              <h2 className="disp h-l">
                See what<br /><b>the eye can't.</b>
              </h2>
              <p className="lede">
                Switch between elevation LiDAR modeling, multispectral NDVI crop vigour, and thermal radiometric imaging to diagnose field anomalies in real time.
              </p>

              {/* Sensor Switcher Segment */}
              <div className="seg max-w-md">
                {SCANS.map((s, idx) => (
                  <button
                    key={s.k}
                    type="button"
                    onClick={() => setScanMode(idx)}
                    aria-selected={scanMode === idx}
                  >
                    {s.k}
                  </button>
                ))}
              </div>

              {/* Sensor Image Preview Box */}
              <div className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.15)] aspect-[16/9] shadow-2xl">
                <img 
                  src={SCANS[scanMode].img} 
                  alt={SCANS[scanMode].title} 
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-[#050607]/80 backdrop-blur-md px-3 py-1 rounded text-xs font-mono text-[#00c5c1] border border-[rgba(255,255,255,0.1)]">
                  LIVE SENSOR · {SCANS[scanMode].k.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Right Telemetry Panel */}
            <div className="lg:col-span-6">
              <div className="panel space-y-5 rounded-xl">
                <h3 className="disp h-s">{SCANS[scanMode].title}</h3>
                <p className="small">{SCANS[scanMode].d}</p>

                <div className="chips">
                  {SCANS[scanMode].f.map(feat => (
                    <span key={feat} className="chip">{feat}</span>
                  ))}
                </div>

                {/* Telemetry Gradient Bar */}
                <div className="space-y-2 pt-2">
                  <div className="h-2 rounded-full" style={{ background: SCANS[scanMode].grad }} />
                  <div className="flex justify-between text-xs font-mono text-[rgba(242,244,243,0.48)]">
                    <span>{SCANS[scanMode].lo}</span>
                    <span>{SCANS[scanMode].hi}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(255,255,255,0.1)] flex items-center gap-4">
                  <button
                    onClick={() => onNavigate('contact')}
                    className="b sm solid"
                  >
                    <span className="roll"><i>Enquire about survey</i><i>Enquire about survey</i></span>
                    <span className="cell">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </span>
                  </button>

                  <button
                    onClick={() => onNavigate('services')}
                    className="b sm noarrow"
                  >
                    <span className="roll"><i>All services</i><i>All services</i></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. AGRAS CONFIGURATOR SECTION (index1.html #s-config) */}
      {/* ========================================================= */}
      <section className="relative pad py-28 border-t border-[rgba(255,255,255,0.1)]" id="s-config">
        <div className="max w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Dynamic Drone Visual */}
            <div className="lg:col-span-6 sticky top-28 text-center space-y-4">
              <div className="relative aspect-[4/3] flex items-center justify-center p-8 bg-[radial-gradient(60%_60%_at_50%_55%,#151a1b,#0a0c0d)] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
                <img 
                  src={currentAgras.img} 
                  alt={currentAgras.name} 
                  className="max-h-full max-w-full object-contain transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute top-4 left-4 lbl text-[#00c5c1] font-mono">
                  {currentAgras.id.toUpperCase()} · 100% FACTORY OEM
                </span>
                <span className="absolute bottom-4 right-4 text-xs font-mono text-[rgba(242,244,243,0.68)]">
                  Direct Mackay Stock
                </span>
              </div>
              <p className="lbl">Rotate between T40, T50, T70 and T100 airframes to configure your complete turnkey kit.</p>
            </div>

            {/* Right: Configurator Table */}
            <div className="lg:col-span-6">
              <div className="panel space-y-6 rounded-xl">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <div>
                    <p className="lbl">Configurator</p>
                    <h2 className="disp h-m">Build your <b>Agras</b></h2>
                  </div>
                  <span className="stock">
                    <span className="dot"></span>
                    {currentAgras.stock} in stock, Mackay
                  </span>
                </div>

                {/* Airframe Switcher Segment */}
                <div className="seg">
                  {Object.keys(AGRAS_VARIANTS).map((vKey) => (
                    <button
                      key={vKey}
                      type="button"
                      onClick={() => setCfgVariant(vKey)}
                      aria-pressed={cfgVariant === vKey}
                    >
                      {vKey.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Technical Specifications Grid */}
                <div className="specs4">
                  <div>
                    <span className="lbl">Payload</span>
                    <div className="v">{currentAgras.payload}</div>
                  </div>
                  <div>
                    <span className="lbl">Swath</span>
                    <div className="v">{currentAgras.swath}</div>
                  </div>
                  <div>
                    <span className="lbl">Flight</span>
                    <div className="v">{currentAgras.flight}</div>
                  </div>
                  <div>
                    <span className="lbl">Radar</span>
                    <div className="v">{currentAgras.radar}</div>
                  </div>
                </div>

                {/* Airframe Base Line */}
                <div>
                  <div className="krow" style={{ paddingTop: 0 }}>
                    <span className="lbl on">{currentAgras.name} Base Airframe</span>
                    <span></span>
                    <span className="p font-mono text-base font-bold text-[#f2f4f3]">{money(currentAgras.price)}</span>
                  </div>

                  {/* Addon Accessories & Parts */}
                  {currentAgras.items.map((item) => {
                    const q = cfgQuantities[`${cfgVariant}:${item.id}`] || 0;
                    return (
                      <div key={item.id} className="krow">
                        <span className="small text-[#f2f4f3] font-medium leading-tight">{item.name}</span>
                        <span className="step">
                          <button 
                            type="button" 
                            onClick={() => handleQtyChange(cfgVariant, item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <output>{q}</output>
                          <button 
                            type="button" 
                            onClick={() => handleQtyChange(cfgVariant, item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </span>
                        <span className="p">{money(item.price)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Kit Total */}
                <div className="tot pt-4 border-t border-[rgba(255,255,255,0.1)]">
                  <div>
                    <p className="lbl">Kit total incl. GST</p>
                    <p className="text-xs font-mono text-[rgba(242,244,243,0.48)]">Includes 10% GST ({money(gst(cfgSum))})</p>
                  </div>
                  <span className="stat num text-[#00c5c1]">{money(cfgSum)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={handleAddKitToCart}
                    className="b solid"
                  >
                    <span className="roll"><i>Add kit to cart</i><i>Add kit to cart</i></span>
                    <span className="cell">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      const matched = DRONES.find(d => d.id === currentAgras.id) || { id: currentAgras.id, name: currentAgras.name, price: currentAgras.price / 100 };
                      onSelectProduct(matched);
                    }}
                    className="b noarrow"
                  >
                    <span className="roll"><i>Airframe specs</i><i>Airframe specs</i></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. THE FLEET HORIZONTAL SCROLLER (index1.html #s-fleet) */}
      {/* ========================================================= */}
      <section className="relative fleet pad py-28 border-t border-[rgba(255,255,255,0.1)]" id="s-fleet">
        <div className="max w-full">
          <div className="fleet-hd">
            <div className="space-y-3">
              <p className="lbl">Heavy-lift and survey fleet · {FLEET_ITEMS.length} airframes and combos</p>
              <h2 className="disp h-l">The <b>fleet</b></h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="b sm noarrow"
              >
                <span className="roll"><i>Shop all catalog</i><i>Shop all catalog</i></span>
              </button>
            </div>
          </div>

          {/* Horizontal Scroller of Aircraft */}
          <div className="overflow-x-auto pb-8 scrollbar-thin">
            <div className="ftrack">
              {FLEET_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectFleetItem(item)}
                  className="fc cursor-pointer group"
                >
                  <div className="im">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      loading="lazy" 
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="lbl">{item.brand} · {item.sku}</span>
                  </div>

                  <div className="bd">
                    <div>
                      <div className="nm group-hover:text-[#00c5c1] transition-colors">{item.name}</div>
                      <p className="lbl" style={{ marginTop: "8px" }}>{item.flight}</p>
                    </div>
                    <div className="text-right">
                      <div className="disp text-2xl font-bold font-mono text-[#f2f4f3]">{money(item.price)}</div>
                      <div className="text-[11px] font-mono text-[rgba(242,244,243,0.48)]">incl. 10% GST</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FIELD RECORD SECTION (index1.html) */}
      {/* ========================================================= */}
      <section className="relative pad py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max w-full space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <p className="lbl">Field-proven · Bowen Basin, QLD · Riparian corridor</p>
              <h2 className="disp h-m">
                Harrisia cactus control<br />across a <b>560 ha offset</b>
              </h2>
            </div>
            <p className="lede max-w-xl">
              High-resolution aerial survey to find every infestation, variable-rate application to treat it, and as-applied records to prove it. Every figure is drawn from the survey and as-applied records.
            </p>
          </div>

          <div className="bigrow">
            <div>
              <div className="bign text-[#00c5c1]">560</div>
              <p className="lbl">Hectares of environmental offset</p>
            </div>
            <div>
              <div className="bign">97.62%</div>
              <p className="lbl">On-target application</p>
            </div>
            <div>
              <div className="bign">4/4</div>
              <p className="lbl">Campaigns rated "Good"</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('projects')}
              className="b sm"
            >
              <span className="roll"><i>View projects & case studies</i><i>View projects & case studies</i></span>
              <span className="cell">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. CREDENTIALS MARQUEE (index1.html) */}
      {/* ========================================================= */}
      <div className="marq border-y border-[rgba(255,255,255,0.1)] py-2 select-none" aria-label="Credentials">
        <div className="marq-t">
          {[...CREDENTIALS, ...CREDENTIALS].map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 9. INDUSTRIES WE SERVE (index1.html) */}
      {/* ========================================================= */}
      <section className="relative pad py-28 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max w-full space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <p className="lbl">Four verticals</p>
              <h2 className="disp h-m">Industries <b>we serve</b></h2>
            </div>
            <p className="lede max-w-xl">
              Each one drives different platform choices, deliverables and compliance overlays, with the same underlying capability: precision aerial operations done by people who know the terrain.
            </p>
          </div>

          <div className="ind">
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.id}
                onClick={() => onNavigate('industries')}
                className="irow cursor-pointer group"
              >
                <span 
                  className="bgimg" 
                  style={{ backgroundImage: `url('${ind.img}')` }}
                />
                <h3>{ind.label}</h3>
                <p className="small text-[rgba(242,244,243,0.68)]">{ind.head}</p>
                <span className="lbl text-[#00c5c1] font-mono">{ind.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. CONTACT CTA SECTION (index1.html) */}
      {/* ========================================================= */}
      <section className="relative pad py-32 border-t border-[rgba(255,255,255,0.1)] bg-[radial-gradient(circle_at_bottom_left,#0a0c0d,#050607)]">
        <div className="max w-full">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-6 max-w-2xl">
              <p className="lbl">Same-day response</p>
              <h2 className="disp h-l">
                Have a site<br /><b>that needs managing?</b>
              </h2>
              <p className="lede">
                Tell us where the site is and what you need to achieve. We respond within the same business day from our Mackay central workshop.
              </p>
            </div>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              className="circ cursor-pointer"
              style={{ width: "168px", height: "168px" }}
              aria-label="Start a conversation"
            >
              <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <path id="circlePathContact" d="M50 50m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" />
                </defs>
                <text>
                  <textPath href="#circlePathContact">Start a conversation · Start a conversation · </textPath>
                </text>
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. BOTTOM TELEMETRY HUD BAR (index1.html #hud) */}
      {/* ========================================================= */}
      <div className="hud">
        <div className="lbl">
          <span className={`dot ${isWorkshopOpen ? "" : "off"}`}></span>
          <span>Mackay {mackayTime} AEST · {isWorkshopOpen ? "Workshop open" : "Workshop closed"}</span>
          <span className="hidden sm:inline font-mono opacity-60">21.14°S 149.18°E</span>
        </div>
        <div className="lbl font-mono">
          <span>DroneHab Australia</span>
          <span className="hud-prog hidden md:inline-block">
            <i style={{ transform: "scaleX(0.7)" }}></i>
          </span>
        </div>
      </div>
    </div>
  );
};
