import React, { useState, useEffect } from 'react';
import {
  ADMIN_STATS, ADMIN_REVENUE_CHART, ADMIN_ORDERS, ADMIN_PRODUCTS,
  ADMIN_CUSTOMERS, ADMIN_WHOLESALE_APPS, ADMIN_WARRANTY_CLAIMS,
  ADMIN_SERVICE_JOBS, ADMIN_ACTIVITY_LOG, ADMIN_LOW_STOCK, formatAudAdmin,
} from '../data/adminData';
import { ordersApi, productsApi, tutorialsApi, settingsApi } from '../services/api';
import {
  LayoutDashboard, ShoppingCart, Package, Users, Building2,
  ShieldCheck, Wrench, BarChart3, Bell, Search, ChevronRight,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock,
  XCircle, Truck, Eye, FileText, ArrowLeft, ArrowUpRight,
  CircleDot, Activity, DollarSign, UserPlus, PackageCheck,
  ClipboardList, Settings, LogOut, Menu, X, Filter, Download,
  Check, ChevronDown, RefreshCw, Video, Upload, Plus, Trash2,
  ExternalLink, Sparkles, Play
} from 'lucide-react';

// ─────────────────────────────────────────────
// Sidebar Navigation Items
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders & Documents', icon: ShoppingCart },
  { id: 'products', label: 'Products & Inventory', icon: Package },
  { id: 'tutorials', label: 'Tutorials & Guides', icon: Video },
  { id: 'banner', label: 'Home Banner Setup', icon: Sparkles },
  { id: 'wholesale', label: 'Wholesale (ABN)', icon: Building2 },
  { id: 'warranty', label: 'Warranty & Claims', icon: ShieldCheck },
  { id: 'settings', label: 'Store Settings', icon: Settings },
];

// ─────────────────────────────────────────────
// Status Badge Component
// ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    'Pending':       'bg-amber-50 text-amber-700 border-amber-200',
    'Processing':    'bg-blue-50 text-blue-700 border-blue-200',
    'Shipped':       'bg-sky-50 text-sky-700 border-sky-200',
    'Delivered':     'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Cancelled':     'bg-rose-50 text-rose-700 border-rose-200',
    'Active':        'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Low Stock':     'bg-amber-50 text-amber-700 border-amber-200',
    'Out of Stock':  'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────
// Clean KPI Card Component
// ─────────────────────────────────────────────
const KpiCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, iconBg = 'bg-blue-50 text-blue-600' }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs font-medium">
          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
            <TrendingUp className="w-3.5 h-3.5" />
            {trendValue}
          </span>
          <span className="text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
};

export const AdminDashboard = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  // Dynamic Data States
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [bannerConfig, setBannerConfig] = useState({
    media_type: 'video',
    media_url: '',
    title: '',
    subtitle: '',
    badge_text: '',
  });

  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Product Creation Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    stock: 10,
    type: 'part',
    category_id: 1,
    description: '',
  });
  const [productImageFile, setProductImageFile] = useState(null);

  // Tutorial Creation Modal
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [tutorialForm, setTutorialForm] = useState({
    title: '',
    category: 'Getting Started',
    description: '',
    duration: '5:00',
    video_url: '',
  });
  const [tutorialVideoFile, setTutorialVideoFile] = useState(null);
  const [tutorialThumbFile, setTutorialThumbFile] = useState(null);

  // Banner Update Form State
  const [bannerVideoFile, setBannerVideoFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerSubmitting, setBannerSubmitting] = useState(false);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      // 1. Load Orders
      const orderRes = await ordersApi.getAll();
      if (orderRes.success) setOrders(orderRes.data);

      // 2. Load Products
      const prodRes = await productsApi.getAll();
      if (prodRes.success) setProducts(prodRes.data);

      // 3. Load Tutorials
      const tutRes = await tutorialsApi.getAll();
      if (tutRes.success) setTutorials(tutRes.data);

      // 4. Load Banner Config
      const banRes = await settingsApi.getBanner();
      if (banRes.success && banRes.data) setBannerConfig(banRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  // ─────────────────────────────────────────────
  // Order Status Update
  // ─────────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await ordersApi.updateStatus(orderId, newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        triggerNotice(`Order #${orderId} status changed to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      triggerNotice('Failed to update status.');
    }
  };

  // ─────────────────────────────────────────────
  // Product Creation
  // ─────────────────────────────────────────────
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', productForm.name);
      fd.append('price', productForm.price);
      fd.append('stock', productForm.stock);
      fd.append('type', productForm.type);
      fd.append('category_id', productForm.category_id);
      fd.append('description', productForm.description);
      if (productImageFile) {
        fd.append('image', productImageFile);
      }

      const res = await productsApi.create(fd);
      if (res.success) {
        triggerNotice('Product uploaded to database!');
        setShowProductModal(false);
        setProductForm({ name: '', price: '', stock: 10, type: 'part', category_id: 1, description: '' });
        setProductImageFile(null);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
      triggerNotice('Error uploading product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await productsApi.delete(id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        triggerNotice('Product deleted.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ─────────────────────────────────────────────
  // Tutorial Creation
  // ─────────────────────────────────────────────
  const handleCreateTutorial = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', tutorialForm.title);
      fd.append('category', tutorialForm.category);
      fd.append('description', tutorialForm.description);
      fd.append('duration', tutorialForm.duration);
      if (tutorialForm.video_url) fd.append('video_url', tutorialForm.video_url);
      if (tutorialVideoFile) fd.append('video_file', tutorialVideoFile);
      if (tutorialThumbFile) fd.append('thumbnail', tutorialThumbFile);

      const res = await tutorialsApi.create(fd);
      if (res.success) {
        triggerNotice('Tutorial uploaded successfully!');
        setShowTutorialModal(false);
        setTutorialForm({ title: '', category: 'Getting Started', description: '', duration: '5:00', video_url: '' });
        setTutorialVideoFile(null);
        setTutorialThumbFile(null);
        loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
      triggerNotice('Error uploading tutorial.');
    }
  };

  const handleDeleteTutorial = async (id) => {
    if (!window.confirm('Delete this tutorial?')) return;
    try {
      const res = await tutorialsApi.delete(id);
      if (res.success) {
        setTutorials(prev => prev.filter(t => t.id !== id));
        triggerNotice('Tutorial removed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ─────────────────────────────────────────────
  // Banner Settings Update
  // ─────────────────────────────────────────────
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setBannerSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('media_type', bannerConfig.media_type);
      fd.append('title', bannerConfig.title || '');
      fd.append('subtitle', bannerConfig.subtitle || '');
      fd.append('badge_text', bannerConfig.badge_text || '');
      if (bannerConfig.media_url) fd.append('media_url', bannerConfig.media_url);
      if (bannerVideoFile) fd.append('video_file', bannerVideoFile);
      if (bannerImageFile) fd.append('image_file', bannerImageFile);

      const res = await settingsApi.updateBanner(fd);
      if (res.success) {
        triggerNotice('Home page hero banner updated successfully!');
        setBannerVideoFile(null);
        setBannerImageFile(null);
        setBannerConfig(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error(err);
      triggerNotice('Failed to update banner.');
    } finally {
      setBannerSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-gray-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow-sm">
              DH
            </div>
            <div>
              <span className="font-bold tracking-tight text-white block text-sm leading-tight group-hover:text-blue-400 transition-colors">
                DroneHub Australia
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">Central Command • Mackay Hub</span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Store</span>
          </button>

          <button
            onClick={() => loadAllAdminData()}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh Database Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-mono">Database Live</span>
          </div>
        </div>
      </header>

      {/* Floating Notice Banner */}
      {notice && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white border border-blue-500 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 bg-white border-r border-gray-200 p-4 space-y-1.5 shrink-0 flex flex-col justify-between fixed md:static inset-y-0 left-0 z-40 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Management Modules
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              let badgeCount = null;
              if (item.id === 'orders') badgeCount = orders.length;
              if (item.id === 'products') badgeCount = products.length;
              if (item.id === 'tutorials') badgeCount = tutorials.length;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {badgeCount !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-500 space-y-1">
            <div className="font-bold text-gray-900">Mackay Airport Hub</div>
            <div className="text-[11px] text-gray-400">Laravel 11 • MySQL Engine</div>
            <div className="text-[11px] text-emerald-600 font-semibold">10% Australian GST Mode</div>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto space-y-6">
          {/* ========================================================= */}
          {/* SECTION: DASHBOARD OVERVIEW */}
          {/* ========================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Top 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <KpiCard
                  title="Total Orders"
                  value={orders.length}
                  subtitle="Recorded in central database"
                  icon={ShoppingCart}
                  trend="up"
                  trendValue={`${orders.length} orders`}
                  iconBg="bg-blue-50 text-blue-600"
                />
                <KpiCard
                  title="Catalog Products"
                  value={products.length}
                  subtitle="Active drones & spare parts"
                  icon={Package}
                  trend="up"
                  trendValue={`${products.length} items`}
                  iconBg="bg-emerald-50 text-emerald-600"
                />
                <KpiCard
                  title="Tutorial Guides"
                  value={tutorials.length}
                  subtitle="Flight & Maintenance guides"
                  icon={Video}
                  trend="up"
                  trendValue="Active Academy"
                  iconBg="bg-purple-50 text-purple-600"
                />
                <KpiCard
                  title="Hero Banner Status"
                  value={bannerConfig.media_type === 'video' ? 'Video Active' : 'Image Active'}
                  subtitle="Live on Home Page"
                  icon={Sparkles}
                  iconBg="bg-amber-50 text-amber-600"
                />
              </div>

              {/* Quick Actions Strip */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Central Operations Actions</h3>
                  <p className="text-xs text-gray-500">Quickly upload new hardware, flight tutorials, or customize banner media.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => { setActiveSection('products'); setShowProductModal(true); }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Product</span>
                  </button>
                  <button
                    onClick={() => { setActiveSection('tutorials'); setShowTutorialModal(true); }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Upload Tutorial</span>
                  </button>
                  <button
                    onClick={() => setActiveSection('banner')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Change Home Banner</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders Overview Table */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-gray-900">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All ({orders.length}) →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">No customer orders recorded yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                          <th className="pb-2">Order #</th>
                          <th className="pb-2">Customer</th>
                          <th className="pb-2">Total (AUD)</th>
                          <th className="pb-2">GST Included</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2 text-right">Document</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="hover:bg-gray-50/50">
                            <td className="py-3 font-mono font-bold text-blue-600">{o.order_number}</td>
                            <td className="py-3">
                              <span className="font-semibold text-gray-900">{o.customer_name}</span>
                              <span className="text-[11px] text-gray-400 block">{o.email}</span>
                            </td>
                            <td className="py-3 font-mono font-bold text-gray-900">{o.total_formatted}</td>
                            <td className="py-3 font-mono text-emerald-700">${o.gst_amount.toFixed(2)}</td>
                            <td className="py-3"><StatusBadge status={o.status} /></td>
                            <td className="py-3 text-right">
                              {o.has_document ? (
                                <a
                                  href={o.document_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2 py-1 bg-blue-50 text-blue-600 font-bold rounded-lg text-[11px] inline-flex items-center gap-1 hover:bg-blue-100"
                                >
                                  <FileText className="w-3 h-3" /> View Doc
                                </a>
                              ) : (
                                <span className="text-gray-300 text-[11px]">None</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION: ORDERS & DOCUMENTS (REAL DATABASE DATA) */}
          {/* ========================================================= */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Commercial Orders & Customer Documents</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Live orders submitted from the checkout page with customer information, items, and attached documentation.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                    {orders.length} Orders Live in DB
                  </span>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-center space-y-2">
                  <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto" />
                  <h4 className="text-sm font-bold text-gray-800">No Orders in Database</h4>
                  <p className="text-xs text-gray-500">Go to public store, add products to cart, and submit checkout to test!</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Customer Info</th>
                        <th className="pb-3">Delivery Address</th>
                        <th className="pb-3">Total (AUD)</th>
                        <th className="pb-3">Attached Document</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3.5 font-mono font-bold text-blue-600">{order.order_number}</td>
                          <td className="py-3.5">
                            <div className="font-semibold text-gray-900">{order.customer_name}</div>
                            <div className="text-[11px] text-gray-500">{order.email}</div>
                            <div className="text-[11px] text-gray-400">{order.phone}</div>
                            {order.company && (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600 font-semibold mt-0.5">
                                {order.company}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-gray-600 max-w-xs">{order.address}</td>
                          <td className="py-3.5 font-mono font-bold text-gray-900">
                            {order.total_formatted}
                            <span className="text-[10px] font-normal text-emerald-700 block">
                              Inc. 10% GST (${order.gst_amount.toFixed(2)})
                            </span>
                          </td>
                          <td className="py-3.5">
                            {order.has_document ? (
                              <a
                                href={order.document_url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-blue-200"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>View Document</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">No attachment</span>
                            )}
                          </td>
                          <td className="py-3.5">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3.5 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white text-gray-800"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="In Workshop">In Workshop</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION: PRODUCTS & INVENTORY (REAL DATABASE CRUD) */}
          {/* ========================================================= */}
          {activeSection === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Hardware Catalog & Spares Control</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage commercial drones, batteries, nozzles, and payloads loaded dynamically from database.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload New Product</span>
                  </button>
                </div>
              </div>

              {/* Product List Table */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                      <th className="pb-3">Image</th>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Type / Category</th>
                      <th className="pb-3">Price (AUD)</th>
                      <th className="pb-3">Stock Units</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3">
                          <img
                            src={prod.image_url || '/drone.png'}
                            alt={prod.name}
                            className="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-gray-50 p-1"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/drone.png';
                            }}
                          />
                        </td>
                        <td className="py-3 font-mono text-gray-500">{prod.sku}</td>
                        <td className="py-3 font-semibold text-gray-900">{prod.name}</td>
                        <td className="py-3 capitalize text-gray-500">{prod.category || prod.type}</td>
                        <td className="py-3 font-mono font-bold text-gray-900">{prod.price_formatted}</td>
                        <td className="py-3 font-mono font-semibold">
                          <span className={prod.stock <= 5 ? 'text-amber-600' : 'text-gray-900'}>
                            {prod.stock} in stock
                          </span>
                        </td>
                        <td className="py-3">
                          <StatusBadge status={prod.stock > 0 ? 'Active' : 'Out of Stock'} />
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION: TUTORIALS & GUIDES (UPLOAD & MANAGE) */}
          {/* ========================================================= */}
          {activeSection === 'tutorials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Flight Academy & Tutorial Video Uploads</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Upload flight tutorials, maintenance videos, or add YouTube/Vimeo instructions for the public Academy.
                  </p>
                </div>

                <button
                  onClick={() => setShowTutorialModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload New Tutorial</span>
                </button>
              </div>

              {/* Tutorials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tut) => (
                  <div key={tut.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3">
                        <img
                          src={tut.thumbnail || '/drone.png'}
                          alt={tut.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/drone.png';
                          }}
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-mono">
                          {tut.duration}
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                        {tut.category}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 mt-1">{tut.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{tut.description}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <a
                        href={tut.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" /> Preview
                      </a>
                      <button
                        onClick={() => handleDeleteTutorial(tut.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                        title="Delete Tutorial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION: HERO BANNER BACKGROUND SETTINGS (VIDEO / IMAGE) */}
          {/* ========================================================= */}
          {activeSection === 'banner' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <h2 className="text-xl font-bold text-gray-900">Home Page Hero Banner Customization</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Upload background video or high-resolution photo for the main Home Page banner directly from here.
                </p>
              </div>

              <form onSubmit={handleSaveBanner} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6 max-w-3xl">
                {/* Media Type Selector */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                    Hero Background Media Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      onClick={() => setBannerConfig(prev => ({ ...prev, media_type: 'video' }))}
                      className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        bannerConfig.media_type === 'video'
                          ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-blue-700'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Video className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-bold text-xs">Video Background</div>
                        <div className="text-[11px] text-gray-500">MP4, WebM or YouTube Link</div>
                      </div>
                    </label>

                    <label
                      onClick={() => setBannerConfig(prev => ({ ...prev, media_type: 'image' }))}
                      className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        bannerConfig.media_type === 'image'
                          ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-blue-700'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-bold text-xs">Image Photo Background</div>
                        <div className="text-[11px] text-gray-500">High-Resolution JPG / PNG</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Video Upload / URL Inputs */}
                {bannerConfig.media_type === 'video' ? (
                  <div className="space-y-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Upload Video File (MP4, WebM, MOV - Max 100MB)
                      </label>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/mov"
                        onChange={(e) => setBannerVideoFile(e.target.files[0])}
                        className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        OR Video Stream / YouTube Embed URL
                      </label>
                      <input
                        type="text"
                        value={bannerConfig.media_url}
                        onChange={(e) => setBannerConfig(prev => ({ ...prev, media_url: e.target.value }))}
                        placeholder="e.g. https://www.youtube.com/embed/6oPtcmr50Ls?autoplay=1&mute=1..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Upload Banner Image File (JPG, PNG, WebP)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBannerImageFile(e.target.files[0])}
                      className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                    />
                  </div>
                )}

                {/* Banner Text Customization */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Top Badge Text
                    </label>
                    <input
                      type="text"
                      value={bannerConfig.badge_text}
                      onChange={(e) => setBannerConfig(prev => ({ ...prev, badge_text: e.target.value }))}
                      placeholder="e.g. DJI Agras T50 & Commercial Fleet | Central QLD Hub"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Main Banner Headline
                    </label>
                    <input
                      type="text"
                      value={bannerConfig.title}
                      onChange={(e) => setBannerConfig(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Australia’s Premier Commercial Drone Fleet"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Banner Subtitle
                    </label>
                    <textarea
                      rows="3"
                      value={bannerConfig.subtitle}
                      onChange={(e) => setBannerConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Supplying heavy-lift agricultural spraying drones..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bannerSubmitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
                >
                  {bannerSubmitting ? 'Saving to Database...' : 'Save & Publish Banner to Home Page'}
                </button>
              </form>
            </div>
          )}

          {/* Wholesale & Warranty fallbacks */}
          {activeSection === 'wholesale' && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-3">
              <Building2 className="w-10 h-10 text-blue-600 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">Wholesale B2B & ABN Accounts</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Australian Business Number validation active. Approved partners receive trade margins and Net 30 day payment terms.
              </p>
            </div>
          )}

          {activeSection === 'warranty' && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">Mackay Workshop RMA Tracking</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Airframe serial lookup active. Factory repairs handled by CASA certified technicians.
              </p>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-base font-bold text-gray-900">DroneHub Store & Tax Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 block mb-0.5">Registered ABN</span>
                  <span className="font-bold text-gray-800">48 612 908 124</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 block mb-0.5">Central Hub Location</span>
                  <span className="font-bold text-gray-800">Cnr Gordon & Gregory Streets, Mackay QLD 4740</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 block mb-0.5">Australian GST Percentage</span>
                  <span className="font-bold text-emerald-600">10% Statutory Rate</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-400 block mb-0.5">Aviation Certification</span>
                  <span className="font-bold text-gray-800">CASA.ReOC.8842 Certified</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD PRODUCT */}
      {/* ========================================================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Upload New Hardware / Product</h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Agras T50 Dual Centrifugal Spray Pump"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Price (AUD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 550.00"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="10"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Type</label>
                <select
                  value={productForm.type}
                  onChange={(e) => setProductForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none"
                >
                  <option value="part">Genuine Spare Part</option>
                  <option value="drone">Commercial Drone Airframe</option>
                  <option value="accessory">Payload / Battery</option>
                  <option value="combo">Combo Bundle</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Upload Product Image (PNG, JPG, WebP)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductImageFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD TUTORIAL */}
      {/* ========================================================= */}
      {showTutorialModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Upload New Flight Tutorial</h3>
              <button onClick={() => setShowTutorialModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTutorial} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Tutorial Title *</label>
                <input
                  type="text"
                  required
                  value={tutorialForm.title}
                  onChange={(e) => setTutorialForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Agras T50 Spray Calibration & Nozzle Setup"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Category</label>
                  <select
                    value={tutorialForm.category}
                    onChange={(e) => setTutorialForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none"
                  >
                    <option value="Getting Started">Getting Started</option>
                    <option value="Operations">Operations</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Troubleshooting">Troubleshooting</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={tutorialForm.duration}
                    onChange={(e) => setTutorialForm(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g. 6:45"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Video Stream / YouTube Embed URL</label>
                <input
                  type="text"
                  value={tutorialForm.video_url}
                  onChange={(e) => setTutorialForm(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">OR Upload Video File (MP4, WebM)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setTutorialVideoFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-purple-600 file:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows="2"
                  value={tutorialForm.description}
                  onChange={(e) => setTutorialForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief summary of steps covered in this tutorial video..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowTutorialModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md"
                >
                  Save & Publish Tutorial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
