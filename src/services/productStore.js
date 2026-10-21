import * as XLSX from 'xlsx';
import { DRONES, COMBOS, getAllParts, getAllAccessories, getAllProducts, formatAud, calculateGst } from '../data/products';

const STORAGE_KEY = 'dh_catalog_products_v2';
const EVENT_NAME = 'dh-products-updated';

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
    return 'Commercial Airframe';
  }

  if (category === 'accessories') {
    if (name.includes('battery') || sku.includes('bat') || name.includes('tb65') || name.includes('db2000') || name.includes('bax')) {
      return 'Intelligent Batteries';
    }
    if (name.includes('charger') || name.includes('generator') || name.includes('hub') || sku.includes('gen') || sku.includes('chg')) {
      return 'Charging & Generators';
    }
    if (name.includes('controller') || name.includes('rc plus') || sku.includes('rc') || name.includes('monitor')) {
      return 'Remote Controllers';
    }
    if (name.includes('zenmuse') || name.includes('payload') || name.includes('thermal') || name.includes('lidar') || name.includes('camera')) {
      return 'Payloads & Sensors';
    }
    if (name.includes('rtk') || name.includes('base station') || name.includes('d-rtk')) {
      return 'RTK Base Stations';
    }
    return 'General Accessories';
  }

  if (category === 'parts') {
    if (name.includes('propeller') || sku.includes('prp') || name.includes('blade')) {
      return 'Carbon Propellers';
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
      return 'Landing Gear & Gimbals';
    }
    return 'Spare Parts';
  }

  if (category === 'combos') {
    if (name.includes('spray') || name.includes('agras') || name.includes('agricultural')) {
      return 'Agricultural Spray Bundles';
    }
    if (name.includes('mining') || name.includes('bowen') || name.includes('rtk')) {
      return 'Mining Survey Bundles';
    }
    if (name.includes('bushfire') || name.includes('thermal') || name.includes('response')) {
      return 'Rapid Thermal & Bushfire Kits';
    }
    if (name.includes('cinema') || name.includes('inspire') || name.includes('master')) {
      return 'Dual-Pilot Cinema Kits';
    }
    return 'Turnkey Combos';
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
    return {
      id: item.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: item.name,
      sku: item.sku || `DH-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: item.brand || 'DroneHub Australia',
      category: category,
      subcategory: subcategory,
      price_cents: Number(item.price_cents) || 0,
      stock_qty: item.stock_qty !== undefined ? Number(item.stock_qty) : 10,
      image_url: item.image_url || '',
      short_description: item.short_description || '',
      description: item.description || '',
      specs: item.specs || [],
      flight_time: item.flight_time || null,
      ip_rating: item.ip_rating || null,
      created_at: new Date().toISOString(),
    };
  });
};

export const productStore = {
  // Get all current products
  getAll: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored products, re-seeding:', e);
    }
    const initial = getInitialCatalog();
    productStore.save(initial);
    return initial;
  },

  // Save full array to storage and emit event
  save: (products) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: products }));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  },

  // Reset back to original factory defaults
  resetToDefault: () => {
    const initial = getInitialCatalog();
    productStore.save(initial);
    return initial;
  },

  // Add a single product
  add: (product) => {
    const current = productStore.getAll();
    const newProduct = {
      id: product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: product.name,
      sku: product.sku || `DH-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: product.brand || 'DroneHub Australia',
      category: product.category || 'parts',
      subcategory: product.subcategory || determineSubcategory(product, product.category || 'parts'),
      price_cents: Number(product.price_cents) || 0,
      stock_qty: Number(product.stock_qty) || 0,
      image_url: product.image_url || '',
      short_description: product.short_description || '',
      description: product.description || '',
      specs: product.specs || [],
      flight_time: product.flight_time || null,
      ip_rating: product.ip_rating || null,
      created_at: new Date().toISOString(),
    };
    const updated = [newProduct, ...current];
    productStore.save(updated);
    return newProduct;
  },

  // Add multiple products (from Excel import)
  addBatch: (productsArray) => {
    const current = productStore.getAll();
    const newItems = productsArray.map((p, idx) => ({
      id: p.id || `prod-xl-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      name: p.name || 'Unnamed Product',
      sku: p.sku || `DH-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: p.brand || 'DroneHub Australia',
      category: p.category || 'parts',
      subcategory: p.subcategory || determineSubcategory(p, p.category || 'parts'),
      price_cents: Number(p.price_cents) || 0,
      stock_qty: p.stock_qty !== undefined ? Number(p.stock_qty) : 10,
      image_url: p.image_url ? String(p.image_url).trim() : '',
      short_description: p.short_description || '',
      description: p.description || p.short_description || '',
      specs: p.specs || [],
      flight_time: p.flight_time || null,
      ip_rating: p.ip_rating || null,
      created_at: new Date().toISOString(),
    }));
    const updated = [...newItems, ...current];
    productStore.save(updated);
    return newItems;
  },

  // Delete a product by ID
  delete: (id) => {
    const current = productStore.getAll();
    const updated = current.filter((p) => p.id !== id);
    productStore.save(updated);
    return true;
  },

  // Get products by specific category
  getByCategory: (category) => {
    const all = productStore.getAll();
    if (!category || category === 'all') return all;
    return all.filter((p) => p.category === category);
  },

  // Subscribe to updates
  subscribe: (callback) => {
    const handler = (e) => callback(e.detail || productStore.getAll());
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  },

  // Demo Excel Template Generator per Category
  exportCategoryTemplate: (category) => {
    const demoRows = getDemoRowsForCategory(category);
    const worksheet = XLSX.utils.json_to_sheet(demoRows);
    
    // Set auto column widths for neat appearance
    worksheet['!cols'] = [
      { wch: 38 }, // Product Name
      { wch: 18 }, // SKU
      { wch: 20 }, // Brand
      { wch: 26 }, // Subcategory
      { wch: 14 }, // Price (AUD)
      { wch: 12 }, // Stock Units
      { wch: 45 }, // Short Description
      { wch: 35 }, // Image URL (blank allowed)
      { wch: 20 }, // Flight Time / Specs
    ];

    const workbook = XLSX.utils.book_new();
    const sheetName = category.toUpperCase().slice(0, 31);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const fileName = `DroneHub_${category.toUpperCase()}_Template_Demo.xlsx`;
    XLSX.writeFile(workbook, fileName);
  },

  // Parse uploaded Excel / CSV file
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
            // Flexible column header mapping
            const name = row['Product Name'] || row['product_name'] || row['Name'] || row['name'] || row['Title'] || '';
            const sku = row['SKU'] || row['sku'] || row['Code'] || `DH-SKU-${Math.floor(1000 + Math.random() * 9000)}`;
            const brand = row['Brand'] || row['brand'] || 'DJI Enterprise';
            const subcategory = row['Subcategory'] || row['subcategory'] || row['Category Type'] || determineSubcategory({ name, sku }, targetCategory);
            
            // Price conversion: users usually write e.g. 1499.00 or $1,499
            const rawPrice = row['Price (AUD)'] ?? row['Price'] ?? row['price'] ?? row['price_aud'] ?? 0;
            const cleanPrice = String(rawPrice).replace(/[$,\s]/g, '');
            const priceAud = parseFloat(cleanPrice) || 0;
            const priceCents = Math.round(priceAud * 100);

            const stock = parseInt(row['Stock Units'] ?? row['Stock'] ?? row['stock_qty'] ?? row['stock'] ?? 10, 10);
            const shortDesc = row['Short Description'] ?? row['short_description'] ?? row['Description'] ?? row['description'] ?? '';
            const imageUrl = row['Image URL'] ?? row['image_url'] ?? row['Image'] ?? '';
            const flightTime = row['Flight Time'] ?? row['flight_time'] ?? '';

            return {
              id: `imported-${Date.now()}-${index}`,
              name: String(name).trim() || `Imported ${targetCategory} #${index + 1}`,
              sku: String(sku).trim(),
              brand: String(brand).trim(),
              category: targetCategory,
              subcategory: String(subcategory).trim(),
              price_cents: priceCents,
              stock_qty: isNaN(stock) ? 10 : stock,
              image_url: String(imageUrl).trim(), // If empty, will show clean black placeholder!
              short_description: String(shortDesc).trim(),
              flight_time: flightTime ? String(flightTime).trim() : null,
              rowNumber: index + 2,
            };
          });

          // Validate at least names exist
          const validProducts = parsedProducts.filter((p) => p.name && p.name !== '');
          if (validProducts.length === 0) {
            reject(new Error('No valid products found. Ensure "Product Name" column is filled.'));
            return;
          }

          resolve(validProducts);
        } catch (err) {
          reject(new Error(`Failed to parse Excel file: ${err.message}`));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsArrayBuffer(file);
    });
  },
};

// Demo rows tailored specifically to each category
const getDemoRowsForCategory = (category) => {
  switch (category) {
    case 'drones':
      return [
        {
          'Product Name': 'DJI Agras T50 Precision Spray Drone',
          'SKU': 'DH-DRN-T50-PRO',
          'Brand': 'DJI Agriculture',
          'Subcategory': 'Agricultural & Spraying',
          'Price (AUD)': 29500.00,
          'Stock Units': 4,
          'Short Description': 'Heavy-duty 50kg spraying airframe with dual atomizing centrifugal nozzles and active phased array radar.',
          'Image URL': '/images/hero-enterprise-drone.jpg',
          'Flight Time': '24 Min Loaded',
        },
        {
          'Product Name': 'DJI Matrice 350 RTK Open-Cut Mining Airframe',
          'SKU': 'DH-DRN-M350-MIN',
          'Brand': 'DJI Enterprise',
          'Subcategory': 'Enterprise & Mining RTK',
          'Price (AUD)': 14999.00,
          'Stock Units': 6,
          'Short Description': 'IP55 sealed industrial inspection airframe engineered for Bowen Basin open-cut coal pits.',
          'Image URL': '/images/hero-enterprise-drone.jpg',
          'Flight Time': '55 Min Flight Time',
        },
        {
          'Product Name': 'DJI Mavic 3 Thermal Compact Inspection Drone',
          'SKU': 'DH-DRN-M3T-AU',
          'Brand': 'DJI Enterprise',
          'Subcategory': 'Thermal & Inspection',
          'Price (AUD)': 7890.00,
          'Stock Units': 12,
          'Short Description': 'Rapid deployment 640x512 radiometric thermal and 56x hybrid zoom drone for solar and powerline audits.',
          'Image URL': '', // Intentionally blank demo to demonstrate black placeholder!
          'Flight Time': '45 Min Flight Time',
        },
      ];

    case 'accessories':
      return [
        {
          'Product Name': 'DJI TB65 Intelligent Flight Battery (5880mAh)',
          'SKU': 'DH-BAT-TB65-DEMO',
          'Brand': 'DJI Enterprise',
          'Subcategory': 'Intelligent Batteries',
          'Price (AUD)': 1299.00,
          'Stock Units': 32,
          'Short Description': 'Dual redundant high-energy battery for Matrice 350 with automated winter pre-heating and 400 cycle life.',
          'Image URL': '/images/drone-parts-accessories.jpg',
          'Flight Time': 'Dual-redundant 44.76V',
        },
        {
          'Product Name': 'DJI RC Plus 7-inch Daylight-Bright Controller',
          'SKU': 'DH-RC-PLUS-DEMO',
          'Brand': 'DJI Enterprise',
          'Subcategory': 'Remote Controllers',
          'Price (AUD)': 2899.00,
          'Stock Units': 10,
          'Short Description': '1,200 nit high-bright 7-inch touchscreen with external WB37 hot-swappable battery support.',
          'Image URL': '', // Intentionally blank demo
          'Flight Time': 'Up to 6 Hours Battery',
        },
        {
          'Product Name': 'DJI D-RTK 2 High-Precision GNSS Base Station',
          'SKU': 'DH-RTK-BASE-DEMO',
          'Brand': 'DJI Enterprise',
          'Subcategory': 'RTK Base Stations',
          'Price (AUD)': 4500.00,
          'Stock Units': 5,
          'Short Description': 'Centimeter-level differential positioning station supporting GPS, GLONASS, BeiDou, and Galileo.',
          'Image URL': '/images/drone-parts-accessories.jpg',
          'Flight Time': 'IP67 Sealed Field Station',
        },
      ];

    case 'parts':
      return [
        {
          'Product Name': 'DJI 2110 Low-Noise Carbon Propellers (Pair)',
          'SKU': 'DH-PRP-2110-DEMO',
          'Brand': 'DJI Enterprise',
          'Subcategory': 'Carbon Propellers',
          'Price (AUD)': 149.00,
          'Stock Units': 80,
          'Short Description': 'Genuine balanced carbon composite folding propellers for Matrice 350 RTK / 300 series.',
          'Image URL': '/images/drone-parts-accessories.jpg',
          'Flight Time': 'High-Tensile Carbon',
        },
        {
          'Product Name': 'Agras T50 High-Flow Impeller Spray Pump Unit',
          'SKU': 'DH-PMP-T50-DEMO',
          'Brand': 'DJI Agriculture',
          'Subcategory': 'Spray Pumps & Nozzles',
          'Price (AUD)': 890.00,
          'Stock Units': 14,
          'Short Description': 'Dual brushless pump unit delivering 16 L/min flow rate with chemical-resistant zirconia ceramic shaft.',
          'Image URL': '', // Intentionally blank demo
          'Flight Time': '16 L/min Dual Brushless',
        },
        {
          'Product Name': 'M350 Dual-Gimbal Downward Harness Connector',
          'SKU': 'DH-CBL-M350-DEMO',
          'Brand': 'DJI Enterprise',
          'Subcategory': 'Cables & Harnesses',
          'Price (AUD)': 350.00,
          'Stock Units': 22,
          'Short Description': 'EMI shielded ribbon cable harness enabling dual downward payload synchronization on M350 RTK.',
          'Image URL': '/images/drone-parts-accessories.jpg',
          'Flight Time': 'Mining Pit Shielded',
        },
      ];

    case 'combos':
      return [
        {
          'Product Name': 'Bowen Basin Mining Pit Complete RTK Survey Pack',
          'SKU': 'DH-CMB-BOWEN-DEMO',
          'Brand': 'DJI Enterprise',
          'Subcategory': 'Mining Survey Bundles',
          'Price (AUD)': 38990.00,
          'Stock Units': 3,
          'Short Description': 'Turnkey mining package: Matrice 350 RTK, Zenmuse H20T thermal payload, D-RTK 2 base station, 8x TB65 batteries, and rapid charging hub.',
          'Image URL': '/images/hero-enterprise-drone.jpg',
          'Flight Time': 'Continuous Multi-Battery Shift',
        },
        {
          'Product Name': 'Agras T50 Turnkey Agricultural Broadacre Spray Bundle',
          'SKU': 'DH-CMB-T50-SPRAY',
          'Brand': 'DJI Agriculture',
          'Subcategory': 'Agricultural Spray Bundles',
          'Price (AUD)': 44500.00,
          'Stock Units': 2,
          'Short Description': 'Complete turnkey commercial spraying outfit: Agras T50 airframe, 4x DB1560 batteries, 9000W EFI generator, and RTK field survey stick.',
          'Image URL': '', // Intentionally blank demo
          'Flight Time': 'Turnkey Agricultural Field Outfit',
        },
      ];

    default:
      return [];
  }
};
