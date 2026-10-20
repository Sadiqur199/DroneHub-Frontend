// =========================================================
// DroneHub Australia — Admin Dashboard Demo Data
// All data is mock/demo for client presentation purposes
// =========================================================

export const ADMIN_STATS = {
  revenue: {
    total: 248750000,       // $2,487,500.00 AUD
    thisMonth: 42350000,    // $423,500.00
    lastMonth: 38900000,    // $389,000.00
    growthPercent: 8.9,
  },
  orders: {
    total: 347,
    thisMonth: 42,
    pending: 8,
    processing: 12,
    shipped: 18,
    delivered: 4,
    cancelled: 2,
  },
  customers: {
    total: 1284,
    retail: 1096,
    wholesale: 142,
    agents: 46,
    newThisMonth: 67,
  },
  products: {
    total: 86,
    active: 78,
    draft: 5,
    outOfStock: 3,
    lowStock: 7,
  },
  warranty: {
    registered: 234,
    activeClaims: 12,
    resolvedThisMonth: 8,
  },
  wholesaleApps: {
    pending: 5,
    approved: 142,
    rejected: 18,
  },
};

export const ADMIN_REVENUE_CHART = [
  { month: 'May', revenue: 18500000 },
  { month: 'Jun', revenue: 22100000 },
  { month: 'Jul', revenue: 19800000 },
  { month: 'Aug', revenue: 31200000 },
  { month: 'Sep', revenue: 38900000 },
  { month: 'Oct', revenue: 42350000 },
];

export const ADMIN_ORDERS = [
  {
    id: 'ORD-2024-0347',
    customer: 'BHP Mitsubishi Alliance',
    email: 'procurement@bhpma.com.au',
    group: 'Wholesale',
    items: 3,
    total: 8499700,
    status: 'Processing',
    date: '2024-10-18',
    payment: 'Net 30 Invoice',
  },
  {
    id: 'ORD-2024-0346',
    customer: 'Lachlan Campbell',
    email: 'lachlan@aerialsurveys.com.au',
    group: 'Retail',
    items: 1,
    total: 1499900,
    status: 'Shipped',
    date: '2024-10-17',
    payment: 'Stripe (Visa)',
    tracking: 'STX-AU-77234891',
  },
  {
    id: 'ORD-2024-0345',
    customer: 'QLD Fire & Emergency',
    email: 'ops@qfes.qld.gov.au',
    group: 'Wholesale',
    items: 5,
    total: 12899500,
    status: 'Pending',
    date: '2024-10-17',
    payment: 'Net 30 Invoice',
  },
  {
    id: 'ORD-2024-0344',
    customer: 'Drone Ag Solutions Pty Ltd',
    email: 'orders@droneag.com.au',
    group: 'Wholesale',
    items: 2,
    total: 5699800,
    status: 'Delivered',
    date: '2024-10-16',
    payment: 'Net 30 Invoice',
  },
  {
    id: 'ORD-2024-0343',
    customer: 'Sarah Mitchell',
    email: 'sarah.m@outlook.com.au',
    group: 'Retail',
    items: 4,
    total: 289500,
    status: 'Shipped',
    date: '2024-10-16',
    payment: 'Afterpay',
    tracking: 'STX-AU-77234887',
  },
  {
    id: 'ORD-2024-0342',
    customer: 'Isaac Hartley — BowenDrone',
    email: 'isaac@bowendrone.com.au',
    group: 'Agent',
    items: 6,
    total: 3450000,
    status: 'Processing',
    date: '2024-10-15',
    payment: 'Agent Credit',
  },
  {
    id: 'ORD-2024-0341',
    customer: 'Rio Tinto Iron Ore',
    email: 'drone.ops@riotinto.com',
    group: 'Wholesale',
    items: 8,
    total: 24999200,
    status: 'Delivered',
    date: '2024-10-14',
    payment: 'Net 30 Invoice',
  },
  {
    id: 'ORD-2024-0340',
    customer: 'Mark Thompson',
    email: 'mark.t@gmail.com',
    group: 'Retail',
    items: 2,
    total: 459800,
    status: 'Cancelled',
    date: '2024-10-14',
    payment: 'Stripe (MC)',
  },
];

export const ADMIN_PRODUCTS = [
  { id: 1, name: 'DJI Matrice 350 RTK', sku: 'DH-M350-RTK', category: 'Drones', price: 1499900, stock: 6, status: 'Active' },
  { id: 2, name: 'DJI Agras T50 Sprayer', sku: 'DH-T50-SPR', category: 'Drones', price: 2899900, stock: 4, status: 'Active' },
  { id: 3, name: 'DJI Mavic 3 Thermal', sku: 'DH-M3T-ENT', category: 'Drones', price: 899900, stock: 8, status: 'Active' },
  { id: 4, name: 'DJI Matrice 30T', sku: 'DH-M30T-ENT', category: 'Drones', price: 1899900, stock: 3, status: 'Active' },
  { id: 5, name: 'TB65 Intelligent Battery', sku: 'DH-TB65-BAT', category: 'Parts', price: 89900, stock: 22, status: 'Active' },
  { id: 6, name: 'T50 Spray Tank 40L', sku: 'DH-T50-TANK', category: 'Parts', price: 149900, stock: 2, status: 'Low Stock' },
  { id: 7, name: 'Zenmuse H20T Payload', sku: 'DH-H20T-PL', category: 'Accessories', price: 1299900, stock: 5, status: 'Active' },
  { id: 8, name: 'D-RTK 2 Base Station', sku: 'DH-DRTK2-BS', category: 'Accessories', price: 499900, stock: 0, status: 'Out of Stock' },
  { id: 9, name: 'T50 Propeller Set (CW/CCW)', sku: 'DH-T50-PROP', category: 'Parts', price: 24900, stock: 45, status: 'Active' },
  { id: 10, name: 'RC Plus Controller', sku: 'DH-RCPLUS', category: 'Accessories', price: 349900, stock: 1, status: 'Low Stock' },
  { id: 11, name: 'M350 Mining Survey Combo', sku: 'DH-COMBO-M350', category: 'Combos', price: 3499900, stock: 3, status: 'Active' },
  { id: 12, name: 'T50 Spreading System', sku: 'DH-T50-SPREAD', category: 'Parts', price: 199900, stock: 0, status: 'Out of Stock' },
];

export const ADMIN_CUSTOMERS = [
  { id: 1, name: 'BHP Mitsubishi Alliance', email: 'procurement@bhpma.com.au', group: 'Wholesale', abn: '45 004 028 077', orders: 23, spent: 38750000, joined: '2024-01-15', status: 'Active' },
  { id: 2, name: 'Lachlan Campbell', email: 'lachlan@aerialsurveys.com.au', group: 'Retail', abn: '-', orders: 5, spent: 3250000, joined: '2024-03-22', status: 'Active' },
  { id: 3, name: 'QLD Fire & Emergency', email: 'ops@qfes.qld.gov.au', group: 'Wholesale', abn: '35 732 891 764', orders: 12, spent: 18900000, joined: '2024-02-10', status: 'Active' },
  { id: 4, name: 'Isaac Hartley — BowenDrone', email: 'isaac@bowendrone.com.au', group: 'Agent', abn: '62 144 092 588', orders: 31, spent: 12400000, joined: '2023-11-05', status: 'Active' },
  { id: 5, name: 'Sarah Mitchell', email: 'sarah.m@outlook.com.au', group: 'Retail', abn: '-', orders: 2, spent: 289500, joined: '2024-09-18', status: 'Active' },
  { id: 6, name: 'Rio Tinto Iron Ore', email: 'drone.ops@riotinto.com', group: 'Wholesale', abn: '96 004 458 404', orders: 18, spent: 45200000, joined: '2023-08-20', status: 'Active' },
  { id: 7, name: 'Mark Thompson', email: 'mark.t@gmail.com', group: 'Retail', abn: '-', orders: 1, spent: 0, joined: '2024-10-14', status: 'Inactive' },
  { id: 8, name: 'Drone Ag Solutions Pty Ltd', email: 'orders@droneag.com.au', group: 'Wholesale', abn: '51 621 389 004', orders: 15, spent: 22800000, joined: '2024-01-30', status: 'Active' },
];

export const ADMIN_WHOLESALE_APPS = [
  { id: 'WA-2024-048', company: 'Pilbara Mining Services', contact: 'James Worthington', email: 'james@pilbaramining.com.au', abn: '73 912 455 001', phone: '0412 345 678', state: 'WA', appliedDate: '2024-10-17', status: 'Pending', notes: 'Large iron ore operation, requesting fleet pricing for 12 x M350 RTK units.' },
  { id: 'WA-2024-047', company: 'SkyWatch Inspections', contact: 'Emily Zhang', email: 'emily@skywatch.com.au', abn: '28 654 011 892', phone: '0423 987 654', state: 'QLD', appliedDate: '2024-10-16', status: 'Pending', notes: 'Powerline and solar farm inspection company. CASA ReOC holder.' },
  { id: 'WA-2024-046', company: 'Northern Ag Drones', contact: 'Tom Baker', email: 'tom@northernag.com.au', abn: '91 733 288 510', phone: '0407 111 222', state: 'QLD', appliedDate: '2024-10-15', status: 'Pending', notes: 'Sugarcane spraying operation near Mackay. Interested in T50 fleet.' },
  { id: 'WA-2024-045', company: 'CQ Mapping Pty Ltd', contact: 'Dave Morrison', email: 'dave@cqmapping.com.au', abn: '44 192 877 603', phone: '0438 555 666', state: 'QLD', appliedDate: '2024-10-14', status: 'Pending', notes: 'Survey and mapping company, needs Matrice 350 + Zenmuse L2 combo.' },
  { id: 'WA-2024-044', company: 'AeroVision Sydney', contact: 'Rachel Nguyen', email: 'rachel@aerovision.com.au', abn: '67 891 234 567', phone: '0455 777 888', state: 'NSW', appliedDate: '2024-10-13', status: 'Pending', notes: 'Real estate aerial photography and thermal building inspections.' },
];

export const ADMIN_WARRANTY_CLAIMS = [
  { id: 'RMA-2024-089', serial: 'DH-AU-77492', product: 'DJI Matrice 350 RTK', customer: 'BHP Mitsubishi Alliance', type: 'Motor Replacement', status: 'In Workshop', priority: 'High', filed: '2024-10-16', agent: 'Isaac Hartley' },
  { id: 'RMA-2024-088', serial: 'DH-AU-81205', product: 'DJI Agras T50', customer: 'Drone Ag Solutions', type: 'Spray System Calibration', status: 'Diagnostics', priority: 'Medium', filed: '2024-10-15', agent: 'Unassigned' },
  { id: 'RMA-2024-087', serial: 'DH-AU-65318', product: 'DJI Mavic 3T', customer: 'Lachlan Campbell', type: 'Gimbal Recalibration', status: 'Bench Test', priority: 'Low', filed: '2024-10-13', agent: 'Isaac Hartley' },
  { id: 'RMA-2024-086', serial: 'DH-AU-92104', product: 'DJI Matrice 30T', customer: 'QLD Fire & Emergency', type: 'Crash Damage — Propulsion', status: 'Parts Ordered', priority: 'Critical', filed: '2024-10-12', agent: 'Isaac Hartley' },
  { id: 'RMA-2024-085', serial: 'DH-AU-44871', product: 'DJI Matrice 350 RTK', customer: 'Rio Tinto Iron Ore', type: '500-Hour Overhaul', status: 'Completed', priority: 'Medium', filed: '2024-10-08', agent: 'Isaac Hartley' },
];

export const ADMIN_SERVICE_JOBS = [
  { id: 'SJ-2024-112', rma: 'RMA-2024-089', product: 'DJI Matrice 350 RTK', agent: 'Isaac Hartley', stage: 'In Workshop', started: '2024-10-17', eta: '2024-10-22', location: 'Mackay HQ' },
  { id: 'SJ-2024-111', rma: 'RMA-2024-088', product: 'DJI Agras T50', agent: 'Unassigned', stage: 'Diagnostics', started: '2024-10-16', eta: '2024-10-21', location: 'Mackay HQ' },
  { id: 'SJ-2024-110', rma: 'RMA-2024-087', product: 'DJI Mavic 3T', agent: 'Isaac Hartley', stage: 'Bench Test', started: '2024-10-14', eta: '2024-10-19', location: 'Mackay HQ' },
  { id: 'SJ-2024-109', rma: 'RMA-2024-086', product: 'DJI Matrice 30T', agent: 'Isaac Hartley', stage: 'Parts Ordered', started: '2024-10-13', eta: '2024-10-25', location: 'Mackay HQ' },
];

export const ADMIN_ACTIVITY_LOG = [
  { time: '2 min ago', action: 'New order placed', detail: 'ORD-2024-0347 by BHP Mitsubishi Alliance — $84,997.00', type: 'order' },
  { time: '18 min ago', action: 'Wholesale application received', detail: 'Pilbara Mining Services (ABN: 73 912 455 001) from WA', type: 'wholesale' },
  { time: '45 min ago', action: 'Stock alert triggered', detail: 'T50 Spray Tank 40L — Only 2 units remaining', type: 'inventory' },
  { time: '1 hour ago', action: 'RMA claim filed', detail: 'RMA-2024-089 — Motor Replacement for M350 RTK (Serial: DH-AU-77492)', type: 'warranty' },
  { time: '2 hours ago', action: 'Order shipped', detail: 'ORD-2024-0346 — StarTrack Express STX-AU-77234891', type: 'order' },
  { time: '3 hours ago', action: 'Customer registered', detail: 'Mark Thompson (mark.t@gmail.com) — Retail account', type: 'customer' },
  { time: '5 hours ago', action: 'Product updated', detail: 'DJI Agras T50 — Price adjusted to $28,999.00 AUD', type: 'product' },
  { time: '6 hours ago', action: 'Service job completed', detail: 'SJ-2024-108 — 500-Hour Overhaul dispatched to Rio Tinto', type: 'service' },
  { time: '8 hours ago', action: 'Invoice generated', detail: 'INV-2024-0291 — $24,999.20 AUD GST Tax Invoice for Rio Tinto', type: 'invoice' },
  { time: '1 day ago', action: 'Wholesale account approved', detail: 'Northern Surveying Co — ABN verified, Net 30 terms granted', type: 'wholesale' },
];

export const ADMIN_LOW_STOCK = [
  { name: 'D-RTK 2 Base Station', sku: 'DH-DRTK2-BS', stock: 0, reorderPoint: 5, status: 'Out of Stock' },
  { name: 'T50 Spreading System', sku: 'DH-T50-SPREAD', stock: 0, reorderPoint: 3, status: 'Out of Stock' },
  { name: 'RC Plus Controller', sku: 'DH-RCPLUS', stock: 1, reorderPoint: 5, status: 'Critical' },
  { name: 'T50 Spray Tank 40L', sku: 'DH-T50-TANK', stock: 2, reorderPoint: 8, status: 'Low' },
  { name: 'DJI Matrice 30T', sku: 'DH-M30T-ENT', stock: 3, reorderPoint: 5, status: 'Low' },
  { name: 'DJI Agras T50 Sprayer', sku: 'DH-T50-SPR', stock: 4, reorderPoint: 6, status: 'Low' },
  { name: 'Zenmuse H20T Payload', sku: 'DH-H20T-PL', stock: 5, reorderPoint: 8, status: 'Low' },
];

// Helper to format cents to AUD
export const formatAudAdmin = (cents) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(cents / 100);
};
