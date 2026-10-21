import * as XLSX from 'xlsx';
import { DRONES, COMBOS, getAllParts, getAllAccessories, getAllProducts, formatAud, calculateGst } from '../data/products';

const STORAGE_KEY = 'dh_catalog_products_v3';
const CATEGORIES_KEY = 'dh_catalog_categories_v2';
const EVENT_NAME = 'dh-products-updated';
const CATEGORIES_EVENT = 'dh-categories-updated';

// ─────────────────────────────────────────────
// Default Initial Categories
// ─────────────────────────────────────────────
const INITIAL_CATEGORIES = [
  {
    id: 'cat-drone-1',
    name: 'Commercial Drones',
    slug: 'drones',
    type: 'drone',
    description: 'Heavy-lift agricultural spraying drones, radiometric mining survey platforms, and cinema airframes.',
    subcategories: [
      'Agricultural & Spraying',
      'Enterprise & Mining RTK',
      'Thermal & Inspection',
      'Cinema & Film',
      'Survey & Mapping'
    ]
  },
  {
    id: 'cat-part-1',
    name: 'Genuine Spare Parts',
    slug: 'parts',
    type: 'part',
    description: 'Original factory replacement parts, propellers, brushless spray pumps, arm locks, and harnesses.',
    subcategories: [
      'Propellers & Blades',
      'Spray Pumps & Nozzles',
      'Arm Locks & Collars',
      'Cables & Harnesses',
      'Motors & ESC',
      'Frame & Landing Gear',
      'Gimbals & Sensors',
      'Avionics & Radar'
    ]
  },
  {
    id: 'cat-acc-1',
    name: 'Accessories & Payloads',
    slug: 'accessories',
    type: 'accessory',
    description: 'Intelligent high-energy batteries, fast EFI generators, smart controllers, and RTK base stations.',
    subcategories: [
      'Intelligent Batteries',
      'Charging Hubs & Generators',
      'Remote Controllers & Monitors',
      'Payloads & Thermal Sensors',
      'RTK Base Stations',
      'Transport Cases & Mounts'
    ]
  },
  {
    id: 'cat-combo-1',
    name: 'Turnkey Combos',
    slug: 'combos',
    type: 'combo',
    description: 'Turnkey commercial fleet packages with multiple batteries, rapid chargers, and field gear.',
    subcategories: [
      'Agricultural Spray Bundles',
      'Mining Survey Bundles',
      'Rapid Thermal & Bushfire Kits',
      'Dual-Pilot Cinema Kits'
    ]
  }
];

// ─────────────────────────────────────────────
// Standard Drone Component Sections (for Parts)
// ─────────────────────────────────────────────
export const DRONE_COMPONENT_SECTIONS = [
  'Propellers & Blades',
  'Spray Pumps & Nozzles',
  'Motors & ESC',
  'Arm Locks & Collars',
  'Cables & Wiring Harnesses',
  'Frame & Folding Arms',
  'Landing Gear Assembly',
  'Gimbal & Sensor Mounts',
  'Radar & Obstacle Avoidance',
  'Tanks & Flow Meters',
  'Other Mechanical Spares'
];

// Helper to determine subcategory from item data
const determineSubcategory = (item, category) => {
  if (item.subcategory) return item.subcategory;
  const name = (item.name || '').toLowerCase();
  const sku = (item.sku || '').toLowerCase();
  const series = (item.series || '').toLowerCase();

  if (category === 'drones') {
    if (series.includes('t100') || series.includes('t70') || series.includes('t50') || series.includes('t40') || name.includes('agras') || name.includes('spray') || name.includes('agricultural')) {
      return 'Agricultural & Spraying';
    }
    if (series.includes('matrice') || name.includes('matrice') || name.includes('enterprise') || sku.includes('m350')) {
      return 'Enterprise & Mining RTK';
    }
    if (series.includes('mavic') || name.includes('thermal') || name.includes('survey')) {
      return 'Thermal & Inspection';
    }
    if (series.includes('inspire') || name.includes('inspire') || name.includes('cinema')) {
      return 'Cinema & Film';
    }
    return 'Agricultural & Spraying';
  }

  if (category === 'accessories') {
    if (name.includes('battery') || sku.includes('bat') || name.includes('tb65') || name.includes('db2000') || name.includes('bax')) {
      return 'Intelligent Batteries';
    }
    if (name.includes('charger') || name.includes('generator') || name.includes('hub') || sku.includes('gen') || sku.includes('chg')) {
      return 'Charging Hubs & Generators';
    }
    if (name.includes('controller') || name.includes('rc plus') || sku.includes('rc') || name.includes('monitor')) {
      return 'Remote Controllers & Monitors';
    }
    if (name.includes('zenmuse') || name.includes('payload') || name.includes('thermal') || name.includes('lidar') || name.includes('camera')) {
      return 'Payloads & Thermal Sensors';
    }
    if (name.includes('rtk') || name.includes('base station') || name.includes('d-rtk')) {
      return 'RTK Base Stations';
    }
    return 'Intelligent Batteries';
  }

  if (category === 'parts') {
    if (name.includes('propeller') || sku.includes('prp') || name.includes('blade')) {
      return 'Propellers & Blades';
    }
    if (name.includes('pump') || sku.includes('pmp') || name.includes('nozzle') || sku.includes('nzl') || name.includes('spray') || name.includes('flow')) {
      return 'Spray Pumps & Nozzles';
    }
    if (name.includes('lock') || sku.includes('lck') || name.includes('collar') || name.includes('hinge')) {
      return 'Arm Locks & Collars';
    }
    if (name.includes('cable') || sku.includes('cbl') || name.includes('harness') || name.includes('connector')) {
      return 'Cables & Harnesses';
    }
    if (name.includes('motor') || name.includes('esc') || name.includes('propulsion')) {
      return 'Motors & ESC';
    }
    if (name.includes('gear') || name.includes('leg') || name.includes('gimbal')) {
      return 'Frame & Landing Gear';
    }
    return 'Propellers & Blades';
  }

  if (category === 'combos') {
    return 'Agricultural Spray Bundles';
  }

  return 'General';
};

// Seed initial products from data/products.js
const getInitialCatalog = () => {
  const parts = getAllParts();
  const accessories = getAllAccessories();
  const rawList = [...DRONES, ...COMBOS, ...parts, ...accessories];

  return rawList.map((item) => {
    const category = item.category || 'parts';
    const subcategory = determineSubcategory(item, category);
    const basePriceCents = Number(item.price_cents) || 0;

    // Associated drone (for parts and accessories)
    let droneName = item.drone_id ? item.drone_id.replace(/-/g, ' ').toUpperCase() : '';
    if (item.drone_id === 'dji-matrice-350-rtk') droneName = 'DJI Matrice 350 RTK';
    if (item.drone_id === 'dji-agras-t100') droneName = 'DJI Agras T100';
    if (item.drone_id === 'dji-agras-t50-agricultural-drone') droneName = 'DJI Agras T50';

    return {
      id: item.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: item.name,
      model_number: item.sku || `DH-MODEL-${Math.floor(1000 + Math.random() * 9000)}`,
      sku: item.sku || `DH-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: item.brand || 'DroneHub Australia',
      category: category,
      subcategory: subcategory,
      price_cents: basePriceCents,
      // Discount
      discount_type: 'none',
      discount_value: 0,
      sale_price_cents: basePriceCents,
      stock_qty: item.stock_qty !== undefined ? Number(item.stock_qty) : 10,
      short_description: item.short_description || '',
      full_description: item.description || item.short_description || '',
      // Associated drone & component section (for parts & accessories)
      drone_id: item.drone_id || (category === 'drones' ? item.id : null),
      drone_name: droneName || (category === 'drones' ? item.name : 'Universal / All Airframes'),
      part_section: subcategory || 'Propellers & Blades',
      // Role-based visibility
      visibility_roles: ['normal', 'wholesale', 'agent'],
      // Tiered Pricing per User Role
      role_prices: {
        normal: basePriceCents,
        wholesale: Math.round(basePriceCents * 0.88), // 12% wholesale dealer discount
        agent: Math.round(basePriceCents * 0.80),    // 20% commercial service agent discount
      },
      image_url: item.image_url || '',
      specs: item.specs || [],
      flight_time: item.flight_time || null,
      created_at: new Date().toISOString(),
    };
  });
};

// ─────────────────────────────────────────────
// Dynamic Category Store
// ─────────────────────────────────────────────
export const categoryStore = {
  getAll: () => {
    try {
      const stored = localStorage.getItem(CATEGORIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    categoryStore.save(INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  },

  save: (categories) => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
      window.dispatchEvent(new CustomEvent(CATEGORIES_EVENT, { detail: categories }));
    } catch (e) {}
  },

  getByType: (type) => {
    const all = categoryStore.getAll();
    return all.filter(c => c.type === type);
  },

  addCategory: ({ name, type, description }) => {
    const all = categoryStore.getAll();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      slug: slug || `cat-${Date.now()}`,
      type: type || 'drone',
      description: description || '',
      subcategories: []
    };
    const updated = [...all, newCat];
    categoryStore.save(updated);
    return newCat;
  },

  deleteCategory: (id) => {
    const all = categoryStore.getAll();
    const updated = all.filter(c => c.id !== id);
    categoryStore.save(updated);
    return true;
  },

  addSubcategory: (categoryId, subName) => {
    if (!subName || !subName.trim()) return false;
    const all = categoryStore.getAll();
    const updated = all.map(cat => {
      if (cat.id === categoryId) {
        const existing = cat.subcategories || [];
        if (!existing.includes(subName.trim())) {
          return { ...cat, subcategories: [...existing, subName.trim()] };
        }
      }
      return cat;
    });
    categoryStore.save(updated);
    return true;
  },

  deleteSubcategory: (categoryId, subName) => {
    const all = categoryStore.getAll();
    const updated = all.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: (cat.subcategories || []).filter(s => s !== subName)
        };
      }
      return cat;
    });
    categoryStore.save(updated);
    return true;
  },

  subscribe: (callback) => {
    const handler = (e) => callback(e.detail || categoryStore.getAll());
    window.addEventListener(CATEGORIES_EVENT, handler);
    return () => window.removeEventListener(CATEGORIES_EVENT, handler);
  }
};

// ─────────────────────────────────────────────
// Central Product Store
// ─────────────────────────────────────────────
export const productStore = {
  getAll: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const initial = getInitialCatalog();
    productStore.save(initial);
    return initial;
  },

  save: (products) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: products }));
    } catch (e) {}
  },

  resetToDefault: () => {
    const initial = getInitialCatalog();
    productStore.save(initial);
    return initial;
  },

  // Get list of existing Drones (for dropdowns when uploading Parts / Accessories)
  getDroneList: () => {
    const all = productStore.getAll();
    return all.filter(p => p.category === 'drones').map(d => ({
      id: d.id,
      name: d.name,
      model_number: d.model_number || d.sku
    }));
  },

  add: (product) => {
    const current = productStore.getAll();
    const normalPriceCents = Number(product.price_cents) || 0;
    const wholesaleCents = product.role_prices?.wholesale !== undefined
      ? Number(product.role_prices.wholesale)
      : Math.round(normalPriceCents * 0.88);
    const agentCents = product.role_prices?.agent !== undefined
      ? Number(product.role_prices.agent)
      : Math.round(normalPriceCents * 0.80);

    const newProduct = {
      id: product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: product.name,
      model_number: product.model_number || product.sku || `DH-MDL-${Math.floor(1000 + Math.random() * 9000)}`,
      sku: product.sku || product.model_number || `DH-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: product.brand || 'DroneHub Australia',
      category: product.category || 'drones',
      subcategory: product.subcategory || 'General',
      price_cents: normalPriceCents,
      discount_type: product.discount_type || 'none',
      discount_value: Number(product.discount_value) || 0,
      sale_price_cents: Number(product.sale_price_cents) || normalPriceCents,
      stock_qty: Number(product.stock_qty) || 0,
      short_description: product.short_description || '',
      full_description: product.full_description || product.description || product.short_description || '',
      // Associated drone & section
      drone_id: product.drone_id || null,
      drone_name: product.drone_name || '',
      part_section: product.part_section || '',
      // Role-based visibility
      visibility_roles: Array.isArray(product.visibility_roles) && product.visibility_roles.length > 0
        ? product.visibility_roles
        : ['normal', 'wholesale', 'agent'],
      // Role-based Tiered Pricing
      role_prices: {
        normal: normalPriceCents,
        wholesale: wholesaleCents,
        agent: agentCents,
      },
      image_url: product.image_url ? String(product.image_url).trim() : '',
      specs: product.specs || [],
      flight_time: product.flight_time || null,
      created_at: new Date().toISOString(),
    };

    const updated = [newProduct, ...current];
    productStore.save(updated);
    return newProduct;
  },

  addBatch: (productsArray) => {
    const current = productStore.getAll();
    const newItems = productsArray.map((p, idx) => {
      const normalPriceCents = Number(p.price_cents) || 0;
      const wholesaleCents = p.role_prices?.wholesale !== undefined
        ? Number(p.role_prices.wholesale)
        : Math.round(normalPriceCents * 0.88);
      const agentCents = p.role_prices?.agent !== undefined
        ? Number(p.role_prices.agent)
        : Math.round(normalPriceCents * 0.80);

      return {
        id: p.id || `prod-xl-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
        name: p.name || 'Unnamed Hardware',
        model_number: p.model_number || p.sku || `DH-MDL-${Math.floor(1000 + Math.random() * 9000)}`,
        sku: p.sku || p.model_number || `DH-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        brand: p.brand || 'DroneHub Australia',
        category: p.category || 'drones',
        subcategory: p.subcategory || 'General',
        price_cents: normalPriceCents,
        discount_type: p.discount_type || 'none',
        discount_value: Number(p.discount_value) || 0,
        sale_price_cents: Number(p.sale_price_cents) || normalPriceCents,
        stock_qty: p.stock_qty !== undefined ? Number(p.stock_qty) : 10,
        short_description: p.short_description || '',
        full_description: p.full_description || p.description || p.short_description || '',
        drone_id: p.drone_id || null,
        drone_name: p.drone_name || '',
        part_section: p.part_section || '',
        visibility_roles: Array.isArray(p.visibility_roles) && p.visibility_roles.length > 0
          ? p.visibility_roles
          : ['normal', 'wholesale', 'agent'],
        role_prices: {
          normal: normalPriceCents,
          wholesale: wholesaleCents,
          agent: agentCents,
        },
        image_url: p.image_url ? String(p.image_url).trim() : '',
        specs: p.specs || [],
        flight_time: p.flight_time || null,
        created_at: new Date().toISOString(),
      };
    });

    const updated = [...newItems, ...current];
    productStore.save(updated);
    return newItems;
  },

  delete: (id) => {
    const current = productStore.getAll();
    const updated = current.filter((p) => p.id !== id);
    productStore.save(updated);
    return true;
  },

  getByCategory: (category) => {
    const all = productStore.getAll();
    if (!category || category === 'all') return all;
    return all.filter((p) => p.category === category);
  },

  subscribe: (callback) => {
    const handler = (e) => callback(e.detail || productStore.getAll());
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  },

  // ─────────────────────────────────────────────
  // Demo Excel Template Export per Category
  // ─────────────────────────────────────────────
  exportCategoryTemplate: (category) => {
    let demoRows = [];

    if (category === 'drones') {
      demoRows = [
        {
          'Drone Name': 'DJI Agras T100 Flagship Heavy Spray Drone',
          'Drone Model/Number': 'DH-AG-T100-PRO',
          'Category': 'Commercial Drones',
          'Subcategory': 'Agricultural & Spraying',
          'Retail Normal Price (AUD)': 48900.00,
          'Wholesale Price (AUD)': 43000.00,
          'Service Agent Price (AUD)': 39500.00,
          'Discount (%)': 5,
          'Stock Units': 3,
          'Visible To (normal,wholesale,agent)': 'normal,wholesale,agent',
          'Short Description': 'Flagship 100kg maximum payload broadacre spray drone with coaxial octa-rotor lift.',
          'Full Description': 'The DJI Agras T100 delivers unprecedented heavy payload aerial chemical discharge up to 32 L/min with dual high-pressure impeller pumps and active phased array obstacle radar.',
          'Image URL': '/images/hero-enterprise-drone.jpg'
        },
        {
          'Drone Name': 'DJI Matrice 350 RTK Open-Cut Mining Airframe',
          'Drone Model/Number': 'DH-M350-RTK-AU',
          'Category': 'Commercial Drones',
          'Subcategory': 'Enterprise & Mining RTK',
          'Retail Normal Price (AUD)': 14999.00,
          'Wholesale Price (AUD)': 13200.00,
          'Service Agent Price (AUD)': 12000.00,
          'Discount (%)': 0,
          'Stock Units': 6,
          'Visible To (normal,wholesale,agent)': 'normal,wholesale,agent',
          'Short Description': 'IP55 sealed industrial inspection platform for Bowen Basin open-cut coal pits.',
          'Full Description': 'Upgraded enterprise flagship with 55 min flight time, 20km transmission range, and dual-downward payload support.',
          'Image URL': '/images/hero-enterprise-drone.jpg'
        },
        {
          'Drone Name': 'DJI Mavic 3 Thermal Enterprise Drone',
          'Drone Model/Number': 'DH-M3T-SURVEY',
          'Category': 'Commercial Drones',
          'Subcategory': 'Thermal & Inspection',
          'Retail Normal Price (AUD)': 7890.00,
          'Wholesale Price (AUD)': 6950.00,
          'Service Agent Price (AUD)': 6300.00,
          'Discount (%)': 0,
          'Stock Units': 10,
          'Visible To (normal,wholesale,agent)': 'wholesale,agent',
          'Short Description': 'Compact radiometric thermal and 56x optical zoom sensor for utility and fire inspections.',
          'Full Description': 'Under 1kg rapid deployment thermal drone with 45 minutes flight time.',
          'Image URL': '' // Blank demo to test clean black placeholder
        }
      ];
    } else if (category === 'parts') {
      demoRows = [
        {
          'Part Name': 'Agras T100 60-inch Carbon Coaxial Propeller Set',
          'Part Number/SKU': 'DH-PRP-T100',
          'Compatible Drone': 'DJI Agras T100',
          'Drone Component Section': 'Propellers & Blades',
          'Category': 'Genuine Spare Parts',
          'Subcategory': 'Propellers & Blades',
          'Retail Normal Price (AUD)': 380.00,
          'Wholesale Price (AUD)': 320.00,
          'Service Agent Price (AUD)': 290.00,
          'Discount (%)': 0,
          'Stock Units': 24,
          'Visible To (normal,wholesale,agent)': 'normal,wholesale,agent',
          'Short Description': 'Genuine balanced 60-inch high-tensile carbon composite propeller pair.',
          'Full Description': 'Engineered to handle high aerodynamic stress and abrasive dust over Australian broadacre farming fields.',
          'Image URL': '/images/drone-parts-accessories.jpg'
        },
        {
          'Part Name': 'Agras T50 Dual Brushless Impeller Spray Pump Unit',
          'Part Number/SKU': 'DH-PMP-T50',
          'Compatible Drone': 'DJI Agras T50',
          'Drone Component Section': 'Spray Pumps & Nozzles',
          'Category': 'Genuine Spare Parts',
          'Subcategory': 'Spray Pumps & Nozzles',
          'Retail Normal Price (AUD)': 890.00,
          'Wholesale Price (AUD)': 760.00,
          'Service Agent Price (AUD)': 690.00,
          'Discount (%)': 10,
          'Stock Units': 12,
          'Visible To (normal,wholesale,agent)': 'normal,wholesale,agent',
          'Short Description': 'Chemical resistant 16 L/min dual pump with zirconia ceramic shaft.',
          'Full Description': 'High flow magnetic drive brushless pump impervious to harsh agricultural fertilizers and herbicides.',
          'Image URL': ''
        },
        {
          'Part Name': 'Matrice 350 Dual Downward Gimbal Harness Cable',
          'Part Number/SKU': 'DH-CBL-M350',
          'Compatible Drone': 'DJI Matrice 350 RTK',
          'Drone Component Section': 'Cables & Wiring Harnesses',
          'Category': 'Genuine Spare Parts',
          'Subcategory': 'Cables & Harnesses',
          'Retail Normal Price (AUD)': 350.00,
          'Wholesale Price (AUD)': 295.00,
          'Service Agent Price (AUD)': 260.00,
          'Discount (%)': 0,
          'Stock Units': 18,
          'Visible To (normal,wholesale,agent)': 'wholesale,agent',
          'Short Description': 'EMI shielded ribbon harness enabling simultaneous thermal and zoom payload operations.',
          'Full Description': 'Factory original dual payload connector harness with gold-plated locking terminal connectors.',
          'Image URL': '/images/drone-parts-accessories.jpg'
        }
      ];
    } else if (category === 'accessories') {
      demoRows = [
        {
          'Accessory Name': 'DJI DB2000 Intelligent Flight Battery (40,000 mAh)',
          'Accessory Number/SKU': 'DH-BAT-DB2000',
          'Compatible Drone': 'DJI Agras T100',
          'Category': 'Accessories & Payloads',
          'Subcategory': 'Intelligent Batteries',
          'Retail Normal Price (AUD)': 3650.00,
          'Wholesale Price (AUD)': 3100.00,
          'Service Agent Price (AUD)': 2850.00,
          'Discount (%)': 0,
          'Stock Units': 15,
          'Visible To (normal,wholesale,agent)': 'normal,wholesale,agent',
          'Short Description': 'Massive 40Ah flight battery with water cooling jacket for 9-minute rapid turnaround.',
          'Full Description': 'High energy density cells designed for heavy-lift continuous operation under harsh Australian summer heat.',
          'Image URL': '/images/drone-parts-accessories.jpg'
        },
        {
          'Accessory Name': 'DJI RC Plus Enterprise 7-inch Daylight Smart Controller',
          'Accessory Number/SKU': 'DH-RC-PLUS-AU',
          'Compatible Drone': 'DJI Matrice 350 RTK',
          'Category': 'Accessories & Payloads',
          'Subcategory': 'Remote Controllers & Monitors',
          'Retail Normal Price (AUD)': 2899.00,
          'Wholesale Price (AUD)': 2500.00,
          'Service Agent Price (AUD)': 2250.00,
          'Discount (%)': 0,
          'Stock Units': 8,
          'Visible To (normal,wholesale,agent)': 'normal,wholesale,agent',
          'Short Description': '1,200 nit high-bright daylight readable screen with external WB37 hot-swappable battery.',
          'Full Description': 'IP54 weather sealed controller with physical hardware control sticks and physical function switches.',
          'Image URL': ''
        }
      ];
    } else {
      demoRows = [
        {
          'Product Name': 'Turnkey Agricultural Spray Pack',
          'SKU': 'DH-CMB-T50-SPRAY',
          'Category': 'Turnkey Combos',
          'Subcategory': 'Agricultural Spray Bundles',
          'Retail Normal Price (AUD)': 44500.00,
          'Wholesale Price (AUD)': 39500.00,
          'Service Agent Price (AUD)': 36000.00,
          'Discount (%)': 0,
          'Stock Units': 2,
          'Visible To (normal,wholesale,agent)': 'normal,wholesale,agent',
          'Short Description': 'Complete commercial broadacre outfit with 4x batteries and fast charger.',
          'Full Description': 'Includes airframe, four batteries, high-output inverter charger, RTK survey stick, and priority support.',
          'Image URL': ''
        }
      ];
    }

    const worksheet = XLSX.utils.json_to_sheet(demoRows);
    worksheet['!cols'] = [
      { wch: 36 }, // Name
      { wch: 22 }, // Number/SKU
      { wch: 24 }, // Compatible Drone
      { wch: 24 }, // Component Section
      { wch: 22 }, // Category
      { wch: 24 }, // Subcategory
      { wch: 22 }, // Normal Price
      { wch: 20 }, // Wholesale Price
      { wch: 22 }, // Service Agent Price
      { wch: 14 }, // Discount
      { wch: 12 }, // Stock
      { wch: 30 }, // Visible To
      { wch: 45 }, // Short Description
      { wch: 55 }, // Full Description
      { wch: 30 }, // Image URL
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, category.toUpperCase());
    XLSX.writeFile(workbook, `DroneHub_${category.toUpperCase()}_Demo_Template.xlsx`);
  },

  // ─────────────────────────────────────────────
  // Parse Uploaded Excel File per Category
  // ─────────────────────────────────────────────
  parseExcelFile: (file, targetCategory) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          if (!rawRows || rawRows.length === 0) {
            reject(new Error('Excel file is empty or contains no valid rows.'));
            return;
          }

          const parsedProducts = rawRows.map((row, index) => {
            const name = row['Drone Name'] || row['Part Name'] || row['Accessory Name'] || row['Product Name'] || row['Name'] || '';
            const modelNum = row['Drone Model/Number'] || row['Part Number/SKU'] || row['Accessory Number/SKU'] || row['SKU'] || row['sku'] || `DH-ITEM-${Math.floor(1000 + Math.random() * 9000)}`;
            const compDrone = row['Compatible Drone'] || row['compatible_drone'] || '';
            const compSection = row['Drone Component Section'] || row['component_section'] || '';
            const subcategory = row['Subcategory'] || row['subcategory'] || determineSubcategory({ name, sku: modelNum }, targetCategory);
            
            // Prices
            const parsePrice = (val, fallback = 0) => {
              if (val === undefined || val === null || val === '') return fallback;
              const num = parseFloat(String(val).replace(/[$,\s]/g, ''));
              return isNaN(num) ? fallback : Math.round(num * 100);
            };

            const normalPriceCents = parsePrice(row['Retail Normal Price (AUD)'] ?? row['Price (AUD)'] ?? row['Price'] ?? 0);
            const wholesaleCents = parsePrice(row['Wholesale Price (AUD)'], Math.round(normalPriceCents * 0.88));
            const agentCents = parsePrice(row['Service Agent Price (AUD)'], Math.round(normalPriceCents * 0.80));

            // Discount
            const discountVal = parseFloat(String(row['Discount (%)'] ?? row['Discount'] ?? 0).replace(/[%,]/g, '')) || 0;
            const discountType = discountVal > 0 ? 'percentage' : 'none';
            const salePriceCents = discountVal > 0
              ? Math.round(normalPriceCents * (1 - discountVal / 100))
              : normalPriceCents;

            const stock = parseInt(row['Stock Units'] ?? row['Stock'] ?? 10, 10);
            const shortDesc = row['Short Description'] ?? row['short_description'] ?? '';
            const fullDesc = row['Full Description'] ?? row['full_description'] ?? shortDesc;
            const imageUrl = row['Image URL'] ?? row['image_url'] ?? '';

            // Roles
            const rolesRaw = String(row['Visible To (normal,wholesale,agent)'] ?? 'normal,wholesale,agent').toLowerCase();
            const roles = [];
            if (rolesRaw.includes('normal') || rolesRaw.includes('retail') || rolesRaw.includes('all')) roles.push('normal');
            if (rolesRaw.includes('wholesale') || rolesRaw.includes('dealer') || rolesRaw.includes('all')) roles.push('wholesale');
            if (rolesRaw.includes('agent') || rolesRaw.includes('service') || rolesRaw.includes('all')) roles.push('agent');
            if (roles.length === 0) roles.push('normal', 'wholesale', 'agent');

            return {
              id: `imported-${Date.now()}-${index}`,
              name: String(name).trim() || `Imported ${targetCategory} #${index + 1}`,
              model_number: String(modelNum).trim(),
              sku: String(modelNum).trim(),
              brand: 'DJI Official',
              category: targetCategory,
              subcategory: String(subcategory).trim(),
              price_cents: normalPriceCents,
              discount_type: discountType,
              discount_value: discountVal,
              sale_price_cents: salePriceCents,
              stock_qty: isNaN(stock) ? 10 : stock,
              drone_id: null,
              drone_name: String(compDrone).trim(),
              part_section: String(compSection).trim(),
              visibility_roles: roles,
              role_prices: {
                normal: normalPriceCents,
                wholesale: wholesaleCents,
                agent: agentCents,
              },
              short_description: String(shortDesc).trim(),
              full_description: String(fullDesc).trim(),
              image_url: String(imageUrl).trim(),
              rowNumber: index + 2,
            };
          });

          const valid = parsedProducts.filter(p => p.name && p.name !== '');
          if (valid.length === 0) {
            reject(new Error('No valid rows found in spreadsheet. Ensure Name column is filled.'));
            return;
          }

          resolve(valid);
        } catch (err) {
          reject(new Error(`Failed to parse file: ${err.message}`));
        }
      };

      reader.onerror = () => reject(new Error('File reading error.'));
      reader.readAsArrayBuffer(file);
    });
  }
};
