import React, { useState, useEffect, useRef } from 'react';
import { productStore } from '../../services/productStore';
import { formatAud } from '../../data/products';
import {
  FileSpreadsheet, Download, Upload, Trash2, CheckCircle2,
  AlertCircle, Plane, Battery, Wrench, Package, Search,
  Plus, Eye, RefreshCw, X, ArrowUpRight, Pencil
} from 'lucide-react';

export const CategoryExcelManager = ({ onClose, onProductsChanged }) => {
  const [activeTab, setActiveTab] = useState('drones'); // 'drones', 'accessories', 'parts', 'combos'
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  
  // File upload & parsing state
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [parseError, setParseError] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  // Load products
  const reloadProducts = async () => {
    try {
      const all = await productStore.getAll();
      setProducts(all);
      if (onProductsChanged) onProductsChanged(all);
    } catch (err) {
      notify('Could not load the catalogue: ' + err.message, 'error');
    }
  };

  useEffect(() => {
    reloadProducts();
    const unsub = productStore.subscribe((updated) => {
      setProducts(updated);
      if (onProductsChanged) onProductsChanged(updated);
    });
    return unsub;
  }, []);

  // Show transient notification
  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Switch tab resets file upload preview
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedFile(null);
    setParsedRows([]);
    setParseError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Category definitions
  const CATEGORIES = [
    {
      id: 'drones',
      label: 'Commercial Drones',
      icon: Plane,
      color: 'text-cyan-400',
      activeBorder: 'border-cyan-500',
      activeBg: 'bg-cyan-500/10 text-cyan-300',
      desc: 'Agricultural spraying drones (T100, T70, T50), Bowen Basin mining inspection airframes, and cinema rigs.'
    },
    {
      id: 'accessories',
      label: 'Accessories & Payloads',
      icon: Battery,
      color: 'text-blue-400',
      activeBorder: 'border-blue-500',
      activeBg: 'bg-blue-500/10 text-blue-300',
      desc: 'Intelligent flight batteries, fast chargers, EFI generators, enterprise controllers, and thermal sensors.'
    },
    {
      id: 'parts',
      label: 'Genuine Spare Parts',
      icon: Wrench,
      color: 'text-amber-400',
      activeBorder: 'border-amber-500',
      activeBg: 'bg-amber-500/10 text-amber-300',
      desc: 'Carbon composite propellers, spray pumps, nozzles, CNC arm folding lock kits, and wiring harnesses.'
    },
    {
      id: 'combos',
      label: 'Turnkey Combos',
      icon: Package,
      color: 'text-purple-400',
      activeBorder: 'border-purple-500',
      activeBg: 'bg-purple-500/10 text-purple-300',
      desc: 'Complete commercial field turnkey outfits with multiple batteries, RTK base, and transport cases.'
    },
  ];

  const currentCategoryMeta = CATEGORIES.find(c => c.id === activeTab) || CATEGORIES[0];
  const categoryProducts = products.filter(p => p.category === activeTab);
  const filteredProducts = categoryProducts.filter(p => {
    const q = search.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.subcategory || '').toLowerCase().includes(q)
    );
  });

  // Handle Export Demo Template
  const handleExportDemo = () => {
    try {
      productStore.exportCategoryTemplate(activeTab);
      notify(`Downloaded demo Excel template for ${currentCategoryMeta.label}!`);
    } catch (e) {
      console.error(e);
      notify('Failed to generate template: ' + e.message, 'error');
    }
  };

  // Handle File Select
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsParsing(true);
    setParseError('');
    setParsedRows([]);

    try {
      const parsed = await productStore.parseExcelFile(file, activeTab);
      setParsedRows(parsed);
      setIsParsing(false);
      notify(`Parsed ${parsed.length} products from Excel! Review preview below and click Confirm.`);
    } catch (err) {
      setIsParsing(false);
      setParseError(err.message || 'Error parsing file.');
      notify(err.message || 'Failed to parse file.', 'error');
    }
  };

  // Confirm Import
  const handleConfirmImport = async () => {
    if (!selectedFile) return;
    setIsParsing(true);
    try {
      const res = await productStore.addBatch(selectedFile, activeTab);
      const extra = res?.errors?.length ? ` (${res.errors.length} row(s) skipped)` : '';
      notify(`Successfully imported ${res?.imported ?? parsedRows.length} ${currentCategoryMeta.label} into the store!${extra}`);
      setSelectedFile(null);
      setParsedRows([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await reloadProducts();
    } catch (err) {
      notify('Import failed: ' + err.message, 'error');
    } finally {
      setIsParsing(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await productStore.delete(id);
      notify(`Deleted "${name}"`);
      await reloadProducts();
    } catch (err) {
      notify('Delete failed: ' + err.message, 'error');
    }
  };

  // ─────────────────────────────────────────────
  // Inline edit
  // ─────────────────────────────────────────────
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const openEditProduct = (product) => {
    setEditing(product);
    setEditForm({
      name: product.name || '',
      sku: product.sku || product.model_number || '',
      subcategory: product.subcategory || '',
      price_normal: product.price_cents ? (product.price_cents / 100).toFixed(2) : '',
      price_wholesale: product.role_prices?.wholesale ? (product.role_prices.wholesale / 100).toFixed(2) : '',
      price_agent: product.role_prices?.agent ? (product.role_prices.agent / 100).toFixed(2) : '',
      stock: product.stock_qty ?? 0,
      visibility_roles: product.visibility_roles?.length ? product.visibility_roles : ['normal', 'wholesale', 'agent'],
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editing) return;

    setSaving(true);
    try {
      const normal = Math.round((parseFloat(editForm.price_normal) || 0) * 100);
      const wholesale = editForm.price_wholesale ? Math.round(parseFloat(editForm.price_wholesale) * 100) : null;
      const agent = editForm.price_agent ? Math.round(parseFloat(editForm.price_agent) * 100) : null;

      await productStore.update(editing.id, {
        name: editForm.name,
        sku: editForm.sku,
        model_number: editForm.sku,
        category: editing.category,
        subcategory: editForm.subcategory,
        price_cents: normal,
        stock_qty: Number(editForm.stock) || 0,
        short_description: editing.short_description || '',
        full_description: editing.full_description || editing.description || '',
        image_url: editing.image_url || '',
        role_prices: { normal, wholesale, agent },
        visibility_roles: editForm.visibility_roles,
      });

      notify(`Updated "${editForm.name}"`);
      setEditing(null);
      await reloadProducts();
    } catch (err) {
      notify('Update failed: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl text-slate-100 relative">
      {/* Top Banner / Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold border transition-all ${
          notification.type === 'error'
            ? 'bg-rose-950/80 border-rose-700 text-rose-200'
            : 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel Batch Import & Catalog Control</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Category Excel Upload System
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Upload and manage products segmented by category: Drones, Accessories, Parts, and Turnkey Combos. Download ready-to-fill demo templates, import spreadsheets, and manage or delete inventory.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-start sm:self-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 4 Separate Category Tabs ("drone, acessoirs, parts, combo egolo upload er alada system takbe") */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          const count = products.filter(p => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? `${cat.activeBorder} ${cat.activeBg} shadow-lg ring-1 ring-cyan-500/30`
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${isActive ? 'bg-slate-900 shadow' : 'bg-slate-900/60'}`}>
                  <Icon className={`w-5 h-5 ${cat.color}`} />
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
                  {count} items
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{cat.label}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">Excel Upload & Template</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Actions Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                activeTab === 'drones' ? 'bg-cyan-400' :
                activeTab === 'accessories' ? 'bg-blue-400' :
                activeTab === 'parts' ? 'bg-amber-400' : 'bg-purple-400'
              }`}></span>
              <h3 className="text-lg font-bold text-white">
                {currentCategoryMeta.label} Section
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentCategoryMeta.desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Step 1: Download Demo Template Button */}
            <button
              onClick={handleExportDemo}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              title="Download pre-filled Excel demo spreadsheet for this category"
            >
              <Download className="w-4 h-4" />
              <span>Export Demo {currentCategoryMeta.label} Template (.xlsx)</span>
            </button>

            {/* Step 2: Hidden File Input Trigger */}
            <label className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95">
              <Upload className="w-4 h-4" />
              <span>Select {currentCategoryMeta.label} Excel File</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Parsing Error Warning */}
        {parseError && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {/* Selected File & Preview Section */}
        {selectedFile && parsedRows.length > 0 && (
          <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-200">File:</span>
                <span className="font-mono text-cyan-300 font-bold">{selectedFile.name}</span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400 font-semibold">{parsedRows.length} Rows Ready to Import</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setParsedRows([]);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Import ({parsedRows.length} Products)</span>
                </button>
              </div>
            </div>

            {/* Table Preview */}
            <div className="overflow-x-auto max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="pb-2">Row</th>
                    <th className="pb-2">Product Name</th>
                    <th className="pb-2">SKU</th>
                    <th className="pb-2">Subcategory</th>
                    <th className="pb-2">Price AUD</th>
                    <th className="pb-2">Stock</th>
                    <th className="pb-2">Image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                  {parsedRows.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2 text-slate-500">{row.rowNumber}</td>
                      <td className="py-2 font-sans font-semibold text-white">{row.name}</td>
                      <td className="py-2 text-cyan-400">{row.sku}</td>
                      <td className="py-2 text-slate-400">{row.subcategory}</td>
                      <td className="py-2 text-emerald-400">{formatAud(row.price_cents)}</td>
                      <td className="py-2">{row.stock_qty}</td>
                      <td className="py-2 text-slate-500">
                        {row.image_url ? (
                          <span className="text-cyan-400 truncate max-w-[120px] inline-block">{row.image_url}</span>
                        ) : (
                          <span className="text-amber-400/80">Black Placeholder</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 10 && (
                <div className="text-center py-2 text-[11px] text-slate-500 border-t border-slate-800">
                  + {parsedRows.length - 10} more rows ready for import
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Existing Products in This Category (with Delete Support) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">
              Current {currentCategoryMeta.label} ({categoryProducts.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Live in store catalog
            </span>
          </div>

          {/* Quick Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${currentCategoryMeta.label}...`}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Table of items with Delete button */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No products found in this category. Upload an Excel file or export the demo template to get started!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/80">
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Product Name & SKU</th>
                  <th className="py-3 px-4">Subcategory</th>
                  <th className="py-3 px-4">Price (AUD)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Delete Product</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const hasImage = p.image_url && String(p.image_url).trim() !== '';

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                          {hasImage ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-[9px] font-mono text-slate-600 font-bold uppercase">KALI</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-100">{p.name}</div>
                        <div className="font-mono text-[11px] text-cyan-400/90">{p.sku}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                          {p.subcategory || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {formatAud(p.price_cents || 0)}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className={`text-[11px] font-semibold ${
                          (p.stock_qty || 0) > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {p.stock_qty || 0} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditProduct(p)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-800/80 transition-all"
                            title="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/80 transition-all"
                            title="Delete product from catalog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Edit Product</h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-slate-500 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">SKU / Model</label>
                <input
                  type="text"
                  value={editForm.sku}
                  onChange={(e) => setEditForm(prev => ({ ...prev, sku: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Subcategory</label>
                <input
                  type="text"
                  value={editForm.subcategory}
                  onChange={(e) => setEditForm(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Retail $</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editForm.price_normal}
                  onChange={(e) => setEditForm(prev => ({ ...prev, price_normal: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Wholesale $</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price_wholesale}
                  onChange={(e) => setEditForm(prev => ({ ...prev, price_wholesale: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Agent $</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price_agent}
                  onChange={(e) => setEditForm(prev => ({ ...prev, price_agent: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Stock</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Visible To</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'normal', label: 'Retail' },
                    { id: 'wholesale', label: 'Wholesale' },
                    { id: 'agent', label: 'Agent' },
                  ].map((role) => {
                    const checked = editForm.visibility_roles.includes(role.id);
                    return (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => {
                          const has = editForm.visibility_roles.includes(role.id);
                          const next = has
                            ? editForm.visibility_roles.filter(r => r !== role.id)
                            : [...editForm.visibility_roles, role.id];
                          setEditForm(prev => ({ ...prev, visibility_roles: next.length ? next : [role.id] }));
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold ${
                          checked
                            ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        {role.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-xs font-bold"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
