import React, { useState, useEffect, useRef } from 'react';
import { productStore, categoryStore } from '../../services/productStore';
import { formatAud } from '../../data/products';
import {
  Plane, Upload, Download, Plus, Trash2, FileSpreadsheet,
  CheckCircle2, AlertCircle, Sparkles, Eye, ShieldCheck,
  Tag, DollarSign, Percent, Layers, Box, Pencil, Save, RefreshCw
} from 'lucide-react';

export const UploadDroneSection = () => {
  const [drones, setDrones] = useState([]);
  const [droneCategories, setDroneCategories] = useState([]);
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    model_number: '',
    category: 'Commercial Drones',
    subcategory: 'Agricultural & Spraying',
    price_normal: '',
    price_wholesale: '',
    price_agent: '',
    discount_type: 'none', // 'none', 'percentage', 'fixed'
    discount_value: '',
    stock: 5,
    short_description: '',
    full_description: '',
    image_url: '',
    visibility_roles: ['normal', 'wholesale', 'agent'],
    flight_time: '',
    payload_capacity: '',
  });

  const [imageFile, setImageFile] = useState(null);

  // Excel Upload State
  const [excelFile, setExcelFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [parseError, setParseError] = useState('');
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const reload = async () => {
      try {
        const all = await productStore.getAll();
        setDrones(all.filter(p => p.category === 'drones'));
      } catch (err) {
        triggerNotice('Could not load the drone catalogue: ' + err.message, 'error');
      }
    };

    const reloadCategories = async () => {
      try {
        await categoryStore.getAll();
        setDroneCategories(categoryStore.getByType('drone'));
      } catch (err) {
        /* categories are non critical for the upload form */
      }
    };

    reload();
    reloadCategories();

    const unsubP = productStore.subscribe((updated) => {
      setDrones((updated || []).filter(p => p.category === 'drones'));
    });
    const unsubC = categoryStore.subscribe((updated) => {
      setDroneCategories((updated || []).filter(c => c.type === 'drone'));
    });
    return () => {
      unsubP();
      unsubC();
    };
  }, []);

  const triggerNotice = (msg, type = 'success') => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 3500);
  };

  // Auto-calculate wholesale & agent prices when normal price changes if empty
  const handleNormalPriceChange = (val) => {
    const num = parseFloat(val) || 0;
    setForm(prev => ({
      ...prev,
      price_normal: val,
      price_wholesale: prev.price_wholesale === '' ? (num * 0.88).toFixed(2) : prev.price_wholesale,
      price_agent: prev.price_agent === '' ? (num * 0.80).toFixed(2) : prev.price_agent,
    }));
  };

  // Toggle user role visibility
  const toggleRole = (role) => {
    setForm(prev => {
      const exists = prev.visibility_roles.includes(role);
      let updated = [];
      if (exists) {
        updated = prev.visibility_roles.filter(r => r !== role);
        if (updated.length === 0) updated = [role]; // at least one role
      } else {
        updated = [...prev.visibility_roles, role];
      }
      return { ...prev, visibility_roles: updated };
    });
  };

  // Calculate sale price after discount
  const normalPriceNum = parseFloat(form.price_normal) || 0;
  const discountValNum = parseFloat(form.discount_value) || 0;
  let calculatedSalePrice = normalPriceNum;
  if (form.discount_type === 'percentage' && discountValNum > 0) {
    calculatedSalePrice = Math.max(0, normalPriceNum * (1 - discountValNum / 100));
  } else if (form.discount_type === 'fixed' && discountValNum > 0) {
    calculatedSalePrice = Math.max(0, normalPriceNum - discountValNum);
  }

  // Handle Form Submit (create or edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price_normal) {
      triggerNotice('Please provide drone name and normal price.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const normalCents = Math.round(normalPriceNum * 100);
      const wholesaleCents = Math.round((parseFloat(form.price_wholesale) || normalPriceNum * 0.88) * 100);
      const agentCents = Math.round((parseFloat(form.price_agent) || normalPriceNum * 0.80) * 100);
      const saleCents = Math.round(calculatedSalePrice * 100);

      const modelNumber = form.model_number.trim()
        || (editing?.model_number || editing?.sku)
        || `DH-DRN-${Math.floor(1000 + Math.random() * 9000)}`;

      const newDrone = {
        name: form.name.trim(),
        model_number: modelNumber,
        sku: modelNumber,
        category: 'drones',
        subcategory: form.subcategory,
        brand: 'DJI Enterprise',
        price_cents: normalCents,
        discount_type: form.discount_type,
        discount_value: discountValNum,
        sale_price_cents: saleCents,
        stock_qty: parseInt(form.stock, 10) || 5,
        short_description: form.short_description.trim(),
        full_description: form.full_description.trim() || form.short_description.trim(),
        visibility_roles: form.visibility_roles,
        role_prices: {
          normal: normalCents,
          wholesale: wholesaleCents,
          agent: agentCents,
        },
        flight_time: form.flight_time ? `${form.flight_time} Min Flight Time` : null,
        specs: form.payload_capacity ? [{ label: 'Payload', value: form.payload_capacity }] : [],
        image_url: form.image_url.trim(),
      };

      if (editing) {
        await productStore.update(editing.id, newDrone);
        triggerNotice(`Drone "${newDrone.name}" updated successfully!`);
      } else {
        await productStore.add(newDrone);
        triggerNotice(`Drone "${newDrone.name}" uploaded successfully!`);
      }

      resetForm();
    } catch (err) {
      triggerNotice('Failed to save drone: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Load an existing drone into the form for editing
  const openEdit = (drone) => {
    setEditing(drone);
    setForm({
      name: drone.name || '',
      model_number: drone.model_number || drone.sku || '',
      category: 'Commercial Drones',
      subcategory: drone.subcategory || 'Agricultural & Spraying',
      price_normal: drone.price_cents ? (drone.price_cents / 100).toFixed(2) : '',
      price_wholesale: drone.role_prices?.wholesale ? (drone.role_prices.wholesale / 100).toFixed(2) : '',
      price_agent: drone.role_prices?.agent ? (drone.role_prices.agent / 100).toFixed(2) : '',
      discount_type: drone.discount_type || 'none',
      discount_value: drone.discount_value || 0,
      stock: drone.stock_qty ?? 5,
      short_description: drone.short_description || '',
      full_description: drone.full_description || drone.description || '',
      image_url: drone.image_url || '',
      visibility_roles: drone.visibility_roles?.length
        ? drone.visibility_roles
        : ['normal', 'wholesale', 'agent'],
      flight_time: (drone.flight_time || '').replace(/\s*Min Flight Time$/i, ''),
      payload_capacity: drone.specs?.find(s => s.label === 'Payload')?.value || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: '',
      model_number: '',
      category: 'Commercial Drones',
      subcategory: 'Agricultural & Spraying',
      price_normal: '',
      price_wholesale: '',
      price_agent: '',
      discount_type: 'none',
      discount_value: '',
      stock: 5,
      short_description: '',
      full_description: '',
      image_url: '',
      visibility_roles: ['normal', 'wholesale', 'agent'],
      flight_time: '',
      payload_capacity: '',
    });
    setImageFile(null);
  };

  // Excel handlers
  const handleExportDemo = () => {
    try {
      productStore.exportCategoryTemplate('drones');
      triggerNotice('Downloaded Demo Drone Excel Template!');
    } catch (e) {
      triggerNotice('Export failed: ' + e.message, 'error');
    }
  };

  const handleExcelSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    setParseError('');
    try {
      const parsed = await productStore.parseExcelFile(file, 'drones');
      setParsedRows(parsed);
      triggerNotice(`Parsed ${parsed.length} drones from Excel! Review preview and confirm import.`);
    } catch (err) {
      setParseError(err.message);
      triggerNotice(err.message, 'error');
    }
  };

  const handleConfirmExcelImport = async () => {
    if (!excelFile) return;
    setImporting(true);
    try {
      const res = await productStore.addBatch(excelFile, 'drones');
      const extra = res?.errors?.length ? ` (${res.errors.length} row(s) skipped)` : '';
      triggerNotice(`Imported ${res?.imported ?? parsedRows.length} drones successfully!${extra}`);
      setExcelFile(null);
      setParsedRows([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      triggerNotice('Import failed: ' + err.message, 'error');
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteDrone = async (id, name) => {
    if (!window.confirm(`Delete drone "${name}" from store catalog?`)) return;
    try {
      await productStore.delete(id);
      triggerNotice(`Deleted "${name}"`);
    } catch (err) {
      triggerNotice('Delete failed: ' + err.message, 'error');
    }
  };

  // Subcategories available from categories store
  const availableSubcategories = droneCategories.flatMap(c => c.subcategories || []);
  const allSubs = availableSubcategories.length > 0
    ? availableSubcategories
    : ['Agricultural & Spraying', 'Enterprise & Mining RTK', 'Thermal & Inspection', 'Cinema & Film'];

  return (
    <div className="space-y-8">
      {/* Toast Notice */}
      {notice && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold border ${
          notice.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {notice.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{notice.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Plane className="w-3.5 h-3.5" />
            <span>Commercial Drones Department</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Upload Commercial Drone Airframe
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 max-w-2xl">
            Upload commercial drones with model serial numbers, discounts, separate short & full descriptions, multi-role visibility, and tiered pricing per user group.
          </p>
        </div>

        {/* Excel Demo Export & Excel Import Trigger */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportDemo}
            className="py-2.5 px-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-2 transition-colors border border-gray-200"
          >
            <Download className="w-4 h-4 text-cyan-600" />
            <span>Export Drone Demo Excel (.xlsx)</span>
          </button>

          <label className="py-2.5 px-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Upload Drone Excel</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleExcelSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Excel Upload Preview Modal / Alert */}
      {excelFile && parsedRows.length > 0 && (
        <div className="bg-cyan-50/70 border border-cyan-200 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-600" />
                <span>Excel Spreadsheet Ready to Import: {excelFile.name}</span>
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {parsedRows.length} drones found with role pricing & specifications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setExcelFile(null);
                  setParsedRows([]);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExcelImport}
                disabled={importing}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-300 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                {importing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{importing ? 'Importing...' : `Confirm & Import (${parsedRows.length} Drones)`}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-52 overflow-y-auto bg-white rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                <tr>
                  <th className="py-2 px-3">Drone Name</th>
                  <th className="py-2 px-3">Model/Number</th>
                  <th className="py-2 px-3">Subcategory</th>
                  <th className="py-2 px-3">Normal Price</th>
                  <th className="py-2 px-3">Wholesale Price</th>
                  <th className="py-2 px-3">Agent Price</th>
                  <th className="py-2 px-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {parsedRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-sans font-semibold text-gray-900">{row.name}</td>
                    <td className="py-2 px-3 text-cyan-600">{row.model_number}</td>
                    <td className="py-2 px-3 text-gray-600">{row.subcategory}</td>
                    <td className="py-2 px-3 font-bold text-gray-900">{formatAud(row.price_cents)}</td>
                    <td className="py-2 px-3 text-blue-600">{formatAud(row.role_prices?.wholesale || 0)}</td>
                    <td className="py-2 px-3 text-indigo-600">{formatAud(row.role_prices?.agent || 0)}</td>
                    <td className="py-2 px-3">{row.stock_qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Drone Upload Form */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <Plane className="w-5 h-5 text-cyan-600" />
          <h3 className="text-lg font-bold text-gray-900">
            {editing ? `Edit Drone — ${editing.name}` : 'Single Drone Manual Upload Form'}
          </h3>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-auto px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Section 1: Basic Drone Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Drone Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. DJI Agras T100 Heavy-Lift Broadacre Spray Drone"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Drone Model / Serial Number *
              </label>
              <input
                type="text"
                required
                value={form.model_number}
                onChange={(e) => setForm({ ...form, model_number: e.target.value })}
                placeholder="e.g. DH-AG-T100 or AU-SER-8842"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Drone Sub-Category</label>
              <select
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-cyan-500"
              >
                {allSubs.map((sub, i) => (
                  <option key={i} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Units *</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Max Flight Time</label>
              <input
                type="text"
                value={form.flight_time}
                onChange={(e) => setForm({ ...form, flight_time: e.target.value })}
                placeholder="e.g. 55 or 25 Min Loaded"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Section 2: Role-based Visibility ("eita ki sokol user dekbe na sodo wholesale user dekbe...") */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>User Role Visibility (Multiple Select Allowed)</span>
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Select which customer tiers are allowed to view this drone on the storefront.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[
                { id: 'normal', label: 'Normal / Retail Users', desc: 'Public website visitors & retail customers' },
                { id: 'wholesale', label: 'Wholesale Users (ABN)', desc: 'Verified commercial dealers & contractors' },
                { id: 'agent', label: 'Service Agent Users', desc: 'Authorized regional flight service partners' },
              ].map((role) => {
                const isChecked = form.visibility_roles.includes(role.id);
                return (
                  <div
                    key={role.id}
                    onClick={() => toggleRole(role.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-cyan-50/70 border-cyan-400 text-cyan-900'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <div>
                      <div className="text-xs font-bold">{role.label}</div>
                      <div className="text-[10px] text-gray-500">{role.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Tiered Pricing per Role & Discount ("protek ta user er jonno price set korar option") */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Tiered Pricing & Discount System (AUD)</span>
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Set individual pricing for each user role and apply optional retail promotional discounts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Normal / Retail Price ($ AUD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price_normal}
                    onChange={(e) => handleNormalPriceChange(e.target.value)}
                    placeholder="48900.00"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-gray-900 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Wholesale Price ($ AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price_wholesale}
                    onChange={(e) => setForm({ ...form, price_wholesale: e.target.value })}
                    placeholder="43000.00"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-blue-700 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Service Agent Price ($ AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price_agent}
                    onChange={(e) => setForm({ ...form, price_agent: e.target.value })}
                    placeholder="39500.00"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-indigo-700 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Discount Option ("jodi discount dite cai dibe") */}
            <div className="pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Discount Option</label>
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-cyan-500"
                >
                  <option value="none">No Discount</option>
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed">Fixed Cash Discount ($ AUD)</option>
                </select>
              </div>

              {form.discount_type !== 'none' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {form.discount_type === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($ AUD)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    placeholder={form.discount_type === 'percentage' ? '10' : '2000'}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-rose-600 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              )}

              {form.discount_type !== 'none' && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono">
                  <span className="text-gray-500 block text-[10px]">Calculated Normal Sale Price:</span>
                  <span className="text-emerald-700 font-bold text-sm">
                    ${calculatedSalePrice.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Short Description & Full Description ("short description, ar full description alada vabe dibe") */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Short Description (Card Summary) *
              </label>
              <textarea
                required
                rows={3}
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                placeholder="Brief 1-2 sentence overview for cards and search results..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Technical Description *
              </label>
              <textarea
                required
                rows={3}
                value={form.full_description}
                onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                placeholder="Comprehensive technical specifications, avionics, motor specs, and payload capabilities..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Section 5: Image URL or Blank (for black placeholder "kali") */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Drone Image URL (Leave blank to show black placeholder)
            </label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="/images/hero-enterprise-drone.jpg or paste HTTPS image link (optional)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-cyan-500"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              If left blank, product card will display the pure black placeholder as requested.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-300 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : editing ? (
                <Save className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>
                {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Upload Drone to Catalog'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Drones Table with Delete */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Current Drones Fleet ({drones.length})
            </h3>
            <p className="text-xs text-gray-500">Live airframes available in store</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
              <tr>
                <th className="py-3 px-3">Image</th>
                <th className="py-3 px-3">Drone Name & Model</th>
                <th className="py-3 px-3">Subcategory</th>
                <th className="py-3 px-3">Normal Price</th>
                <th className="py-3 px-3">Wholesale Price</th>
                <th className="py-3 px-3">Agent Price</th>
                <th className="py-3 px-3">Visible To</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {drones.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black border border-gray-200 flex items-center justify-center">
                      {d.image_url ? (
                        <img src={d.image_url} alt={d.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[8px] font-mono text-gray-500 font-bold">KALI</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-gray-900">{d.name}</div>
                    <div className="font-mono text-[11px] text-cyan-700">{d.model_number || d.sku}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px]">
                      {d.subcategory}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-gray-900">
                    {formatAud(d.price_cents)}
                  </td>
                  <td className="py-3 px-3 font-mono text-blue-700 font-semibold">
                    {formatAud(d.role_prices?.wholesale || d.price_cents * 0.88)}
                  </td>
                  <td className="py-3 px-3 font-mono text-indigo-700 font-semibold">
                    {formatAud(d.role_prices?.agent || d.price_cents * 0.80)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {(d.visibility_roles || ['normal', 'wholesale', 'agent']).map((r, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600 font-mono capitalize">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={d.stock_qty <= 2 ? 'text-amber-600 font-bold' : 'text-gray-900'}>
                      {d.stock_qty} units
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(d)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                        title="Edit Drone"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDrone(d.id, d.name)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Drone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
