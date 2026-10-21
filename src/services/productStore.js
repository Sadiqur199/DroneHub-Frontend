import * as XLSX from 'xlsx';
import { productsApi, categoriesApi, session } from './api';

const EVENT_NAME = 'dh-products-updated';
const CATEGORIES_EVENT = 'dh-categories-updated';

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

// ─────────────────────────────────────────────
// Storefront role -> catalogue category slug
// ─────────────────────────────────────────────
export const CATEGORY_FOR_ROLE = {
  drone: 'drones',
  part: 'parts',
  accessory: 'accessories',
  combo: 'combos',
};

const listeners = { products: new Set(), categories: new Set() };

const emit = (type, detail) => {
  window.dispatchEvent(new CustomEvent(type, { detail }));
  listeners[type === EVENT_NAME ? 'products' : 'categories'].forEach((cb) => cb(detail));
};

// ─────────────────────────────────────────────
// Dynamic Category Store (server backed)
// ─────────────────────────────────────────────
export const categoryStore = {
  cache: [],
  inflight: null,

  async getAll() {
    if (categoryStore.inflight) {
      return categoryStore.inflight;
    }

    const request = (async () => {
      const res = await categoriesApi.getAll();
      categoryStore.cache = res?.data || [];
      emit(CATEGORIES_EVENT, categoryStore.cache);
      return categoryStore.cache;
    })();

    categoryStore.inflight = request.finally(() => {
      categoryStore.inflight = null;
    });

    return categoryStore.inflight;
  },

  getCached: () => categoryStore.cache,

  getByType: (type) => categoryStore.cache.filter((c) => c.type === type),

  getBySlug: (slug) => categoryStore.cache.find((c) => c.slug === slug),

  async addCategory({ name, type, description }) {
    const res = await categoriesApi.create({ name, type, description });
    await categoryStore.getAll();
    return res;
  },

  async updateCategory(id, payload) {
    const res = await categoriesApi.update(id, payload);
    await categoryStore.getAll();
    return res;
  },

  async deleteCategory(id) {
    const res = await categoriesApi.remove(id);
    await categoryStore.getAll();
    return res;
  },

  async addSubcategory(categoryId, subName) {
    const res = await categoriesApi.addSubcategory(categoryId, subName);
    await categoryStore.getAll();
    return res;
  },

  async deleteSubcategory(categoryId, subSlug) {
    const res = await categoriesApi.removeSubcategory(categoryId, subSlug);
    await categoryStore.getAll();
    return res;
  },

  subscribe: (callback) => {
    const handler = (e) => callback(e.detail || categoryStore.cache);
    window.addEventListener(CATEGORIES_EVENT, handler);
    listeners.categories.add(callback);
    return () => {
      window.removeEventListener(CATEGORIES_EVENT, handler);
      listeners.categories.delete(callback);
    };
  },
};

// ─────────────────────────────────────────────
// Central Product Store (server backed)
// ─────────────────────────────────────────────
export const productStore = {
  cache: [],
  lastError: null,
  inflight: null,

  /**
   * Load the catalogue from the API. The server applies the signed-in
   * customer's group rules, so a wholesale buyer only ever receives
   * wholesale-visible products priced at the wholesale rate.
   */
  async getAll(params = {}) {
    // De-duplicate concurrent loads (several panels mount at once).
    if (productStore.inflight && Object.keys(params).length === 0) {
      return productStore.inflight;
    }

    const request = (async () => {
      try {
        const res = await productsApi.getAll(params);
        productStore.cache = res?.data || [];
        productStore.lastError = null;
        emit(EVENT_NAME, productStore.cache);
        return productStore.cache;
      } catch (err) {
        productStore.lastError = err.message;
        throw err;
      } finally {
        productStore.inflight = null;
      }
    })();

    productStore.inflight = request;
    return request;
  },

  getCached: () => productStore.cache,

  getById: (id) => productStore.cache.find((p) => p.id === id),

  /** Drones available for linking parts & accessories. */
  getDroneList: () =>
    productStore.cache
      .filter((p) => p.category === 'drones')
      .map((d) => ({ id: d.id, name: d.name, model_number: d.model_number || d.sku })),

  /**
   * Create a product on the server.
   * @param {object} product  normalised product payload
   */
  async add(product) {
    const fd = new FormData();
    fd.append('name', product.name || '');
    fd.append('sku', product.sku || product.model_number || '');
    fd.append('model_number', product.model_number || product.sku || '');
    fd.append('category', product.category || 'parts');
    fd.append('subcategory', product.subcategory || '');
    fd.append('price_normal', String(product.price_cents ?? 0) / 100);
    if (product.role_prices?.wholesale != null) {
      fd.append('price_wholesale', String(product.role_prices.wholesale) / 100);
    }
    if (product.role_prices?.agent != null) {
      fd.append('price_agent', String(product.role_prices.agent) / 100);
    }
    if (product.discount_type && product.discount_type !== 'none') {
      fd.append('discount_type', product.discount_type);
      fd.append('discount_value', String(product.discount_value || 0));
    }
    fd.append('stock', String(product.stock_qty ?? 0));
    fd.append('short_description', product.short_description || '');
    fd.append('full_description', product.full_description || product.description || '');
    fd.append('image_url', product.image_url || '');
    if (product.flight_time) fd.append('flight_time', product.flight_time);
    if (product.drone_id) fd.append('drone_id', String(product.drone_id).replace('p-', ''));
    (product.visibility_roles || []).forEach((r) => fd.append('visibility_roles[]', r));

    const res = await productsApi.create(fd);
    await productStore.getAll();
    return res;
  },

  /**
   * Edit an existing product on the server.
   */
  async update(id, product) {
    const fd = new FormData();
    fd.append('name', product.name || '');
    fd.append('sku', product.sku || product.model_number || '');
    fd.append('model_number', product.model_number || product.sku || '');
    fd.append('category', product.category || 'parts');
    fd.append('subcategory', product.subcategory || '');
    fd.append('price_normal', String(product.price_cents ?? 0) / 100);
    if (product.role_prices?.wholesale != null) {
      fd.append('price_wholesale', String(product.role_prices.wholesale) / 100);
    }
    if (product.role_prices?.agent != null) {
      fd.append('price_agent', String(product.role_prices.agent) / 100);
    }
    if (product.discount_type && product.discount_type !== 'none') {
      fd.append('discount_type', product.discount_type);
      fd.append('discount_value', String(product.discount_value || 0));
    }
    fd.append('stock', String(product.stock_qty ?? 0));
    fd.append('short_description', product.short_description || '');
    fd.append('full_description', product.full_description || product.description || '');
    fd.append('image_url', product.image_url || '');
    if (product.flight_time) fd.append('flight_time', product.flight_time);
    if (product.drone_id) fd.append('drone_id', String(product.drone_id).replace('p-', ''));
    (product.visibility_roles || []).forEach((r) => fd.append('visibility_roles[]', r));

    const res = await productsApi.update(id, fd);
    await productStore.getAll();
    return res;
  },

  async delete(id) {
    const res = await productsApi.delete(id);
    await productStore.getAll();
    return res;
  },

  /**
   * Bulk import from an Excel spreadsheet (server side parsing).
   */
  async addBatch(file, category) {
    const res = await productsApi.importExcel(file, category);
    await productStore.getAll();
    return res;
  },

  subscribe: (callback) => {
    const handler = (e) => callback(e.detail || productStore.cache);
    window.addEventListener(EVENT_NAME, handler);
    listeners.products.add(callback);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      listeners.products.delete(callback);
    };
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
          'Image URL': ''
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
          'Drone Component Section': 'Cables & Harnesses',
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
      { wch: 30 }  // Image URL
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, category.toUpperCase());
    XLSX.writeFile(workbook, `DroneHub_${category.toUpperCase()}_Demo_Template.xlsx`);
  },

  // ─────────────────────────────────────────────
  // Client side preview of an uploaded Excel file
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
            const modelNum = row['Drone Model/Number'] || row['Part Number/SKU'] || row['Accessory Number/SKU'] || row['SKU'] || row['sku'] || '';
            const compDrone = row['Compatible Drone'] || row['compatible_drone'] || '';
            const compSection = row['Drone Component Section'] || row['component_section'] || '';
            const subcategory = row['Subcategory'] || row['subcategory'] || compSection || 'General';

            const parsePrice = (val, fallback = 0) => {
              if (val === undefined || val === null || val === '') return fallback;
              const num = parseFloat(String(val).replace(/[$,\s]/g, ''));
              return isNaN(num) ? fallback : Math.round(num * 100);
            };

            const normalPriceCents = parsePrice(row['Retail Normal Price (AUD)'] ?? row['Price (AUD)'] ?? row['Price'] ?? 0);
            const wholesaleCents = parsePrice(row['Wholesale Price (AUD)'], Math.round(normalPriceCents * 0.88));
            const agentCents = parsePrice(row['Service Agent Price (AUD)'], Math.round(normalPriceCents * 0.80));

            const discountVal = parseFloat(String(row['Discount (%)'] ?? row['Discount'] ?? 0).replace(/[%,]/g, '')) || 0;
            const discountType = discountVal > 0 ? 'percentage' : 'none';
            const salePriceCents = discountVal > 0
              ? Math.round(normalPriceCents * (1 - discountVal / 100))
              : normalPriceCents;

            const stock = parseInt(row['Stock Units'] ?? row['Stock'] ?? 10, 10);
            const shortDesc = row['Short Description'] ?? row['short_description'] ?? '';
            const fullDesc = row['Full Description'] ?? row['full_description'] ?? shortDesc;
            const imageUrl = row['Image URL'] ?? row['image_url'] ?? '';

            const rolesRaw = String(row['Visible To (normal,wholesale,agent)'] ?? 'normal,wholesale,agent').toLowerCase();
            const roles = [];
            if (rolesRaw.includes('normal') || rolesRaw.includes('retail') || rolesRaw.includes('all')) roles.push('normal');
            if (rolesRaw.includes('wholesale') || rolesRaw.includes('dealer') || rolesRaw.includes('all')) roles.push('wholesale');
            if (rolesRaw.includes('agent') || rolesRaw.includes('service') || rolesRaw.includes('all')) roles.push('agent');
            if (roles.length === 0) roles.push('normal', 'wholesale', 'agent');

            return {
              name: String(name).trim() || `Imported ${targetCategory} #${index + 1}`,
              model_number: String(modelNum).trim(),
              sku: String(modelNum).trim(),
              category: targetCategory,
              subcategory: String(subcategory).trim(),
              price_cents: normalPriceCents,
              discount_type: discountType,
              discount_value: discountVal,
              sale_price_cents: salePriceCents,
              stock_qty: isNaN(stock) ? 10 : stock,
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

          const valid = parsedProducts.filter((p) => p.name && p.name !== '');
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
  },
};
