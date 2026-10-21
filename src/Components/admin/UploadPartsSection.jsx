import React, { useState, useEffect, useRef } from 'react';
import { productStore, categoryStore, DRONE_COMPONENT_SECTIONS } from '../../services/productStore';
import { formatAud } from '../../data/products';
import {
  Wrench, Upload, Download, Plus, Trash2, FileSpreadsheet,
  CheckCircle2, AlertCircle, ShieldCheck, Tag, DollarSign,
  Layers, Box, Plane
} from 'lucide-react';

export const UploadPartsSection = () => {
  const [parts, setParts] = useState([]);
  const [dronesList, setDronesList] = useState([]);
  const [partCategories, setPartCategories] = useState([]);
  const [notice, setNotice] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    sku: '',
    drone_name: 'DJI Agras T100',
    part_section: 'Propellers & Blades',
    subcategory: 'Propellers & Blades',
    price_normal: '',
    price_wholesale: '',
    price_agent: '',
    discount_type: 'none',
    discount_value: '',
    stock: 20,
    short_description: '',
    full_description: '',
    image_url: '',
    visibility_roles: ['normal', 'wholesale', 'agent'],
  });

  // Excel State
  const [excelFile, setExcelFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [parseError, setParseError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const reload = () => {
      const all = productStore.getAll();
      setParts(all.filter(p => p.category === 'parts'));
      setDronesList(productStore.getDroneList());

      const cats = categoryStore.getByType('part');
      setPartCategories(cats);
    };
    reload();

    const unsubP = productStore.subscribe(reload);
    const unsubC = categoryStore.subscribe(reload);
    return () => {
      unsubP();
      unsubC();
    };
  }, []);

  const triggerNotice = (msg, type = 'success') => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleNormalPriceChange = (val) => {
    const num = parseFloat(val) || 0;
    setForm(prev => ({
      ...prev,
      price_normal: val,
      price_wholesale: prev.price_wholesale === '' ? (num * 0.88).toFixed(2) : prev.price_wholesale,
      price_agent: prev.price_agent === '' ? (num * 0.80).toFixed(2) : prev.price_agent,
    }));
  };

  const toggleRole = (role) => {
    setForm(prev => {
      const exists = prev.visibility_roles.includes(role);
      let updated = [];
      if (exists) {
        updated = prev.visibility_roles.filter(r => r !== role);
        if (updated.length === 0) updated = [role];
      } else {
        updated = [...prev.visibility_roles, role];
      }
      return { ...prev, visibility_roles: updated };
    });
  };

  const normalPriceNum = parseFloat(form.price_normal) || 0;
  const discountValNum = parseFloat(form.discount_value) || 0;
  let calculatedSalePrice = normalPriceNum;
  if (form.discount_type === 'percentage' && discountValNum > 0) {
    calculatedSalePrice = Math.max(0, normalPriceNum * (1 - discountValNum / 100));
  } else if (form.discount_type === 'fixed' && discountValNum > 0) {
    calculatedSalePrice = Math.max(0, normalPriceNum - discountValNum);
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price_normal) {
      triggerNotice('Please provide part name and normal price.', 'error');
      return;
    }

    try {
      const normalCents = Math.round(normalPriceNum * 100);
      const wholesaleCents = Math.round((parseFloat(form.price_wholesale) || normalPriceNum * 0.88) * 100);
      const agentCents = Math.round((parseFloat(form.price_agent) || normalPriceNum * 0.80) * 100);
      const saleCents = Math.round(calculatedSalePrice * 100);

      const newPart = {
        name: form.name.trim(),
        model_number: form.sku.trim() || `DH-PRT-${Math.floor(1000 + Math.random() * 9000)}`,
        sku: form.sku.trim() || `DH-PRT-${Math.floor(1000 + Math.random() * 9000)}`,
        category: 'parts',
        subcategory: form.part_section,
        brand: 'DJI Genuine Spares',
        drone_name: form.drone_name,
        part_section: form.part_section,
        price_cents: normalCents,
        discount_type: form.discount_type,
        discount_value: discountValNum,
        sale_price_cents: saleCents,
        stock_qty: parseInt(form.stock, 10) || 10,
        short_description: form.short_description.trim(),
        full_description: form.full_description.trim() || form.short_description.trim(),
        visibility_roles: form.visibility_roles,
        role_prices: {
          normal: normalCents,
          wholesale: wholesaleCents,
          agent: agentCents,
        },
        image_url: form.image_url.trim(),
      };

      productStore.add(newPart);
      triggerNotice(`Part "${form.name}" uploaded successfully!`);

      // Reset
      setForm({
        name: '',
        sku: '',
        drone_name: dronesList[0]?.name || 'DJI Agras T100',
        part_section: 'Propellers & Blades',
        subcategory: 'Propellers & Blades',
        price_normal: '',
        price_wholesale: '',
        price_agent: '',
        discount_type: 'none',
        discount_value: '',
        stock: 20,
        short_description: '',
        full_description: '',
        image_url: '',
        visibility_roles: ['normal', 'wholesale', 'agent'],
      });
    } catch (err) {
      triggerNotice('Failed to upload part: ' + err.message, 'error');
    }
  };

  // Excel handlers
  const handleExportDemo = () => {
    try {
      productStore.exportCategoryTemplate('parts');
      triggerNotice('Downloaded Demo Genuine Parts Excel Template!');
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
      const parsed = await productStore.parseExcelFile(file, 'parts');
      setParsedRows(parsed);
      triggerNotice(`Parsed ${parsed.length} parts from Excel! Review preview and confirm import.`);
    } catch (err) {
      setParseError(err.message);
      triggerNotice(err.message, 'error');
    }
  };

  const handleConfirmExcelImport = () => {
    if (parsedRows.length === 0) return;
    try {
      productStore.addBatch(parsedRows);
      triggerNotice(`Imported ${parsedRows.length} parts successfully!`);
      setExcelFile(null);
      setParsedRows([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      triggerNotice('Import failed: ' + err.message, 'error');
    }
  };

  const handleDeletePart = (id, name) => {
    if (window.confirm(`Delete part "${name}" from store catalog?`)) {
      productStore.delete(id);
      triggerNotice(`Deleted "${name}"`);
    }
  };

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>Genuine Spare Parts Department</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Upload Drone Genuine Spare Parts
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 max-w-2xl">
            Select the compatible drone platform, specify the component section (propellers, nozzles, arm locks, etc.), set tiered role pricing, and batch upload via Excel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportDemo}
            className="py-2.5 px-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-2 transition-colors border border-gray-200"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Export Parts Demo Excel (.xlsx)</span>
          </button>

          <label className="py-2.5 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Upload Parts Excel</span>
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
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                <span>Excel Spreadsheet Ready to Import: {excelFile.name}</span>
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {parsedRows.length} parts found with drone linkages & component sections.
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
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Import ({parsedRows.length} Parts)</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-52 overflow-y-auto bg-white rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                <tr>
                  <th className="py-2 px-3">Part Name</th>
                  <th className="py-2 px-3">Part SKU</th>
                  <th className="py-2 px-3">Compatible Drone</th>
                  <th className="py-2 px-3">Component Section</th>
                  <th className="py-2 px-3">Normal Price</th>
                  <th className="py-2 px-3">Wholesale Price</th>
                  <th className="py-2 px-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {parsedRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-sans font-semibold text-gray-900">{row.name}</td>
                    <td className="py-2 px-3 text-amber-600">{row.sku}</td>
                    <td className="py-2 px-3 text-cyan-700 font-semibold">{row.drone_name || 'Universal'}</td>
                    <td className="py-2 px-3 text-gray-600">{row.part_section}</td>
                    <td className="py-2 px-3 font-bold text-gray-900">{formatAud(row.price_cents)}</td>
                    <td className="py-2 px-3 text-blue-600">{formatAud(row.role_prices?.wholesale || 0)}</td>
                    <td className="py-2 px-3">{row.stock_qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Part Upload Form */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <Wrench className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Single Spare Part Manual Upload Form
          </h3>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Section 1: Drone & Component Linkage */}
          <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-amber-600" />
                <span>Compatible Drone & Component Section Linkage</span>
              </h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Specify which drone this part belongs to and its mechanical/electrical section.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  1. Which Drone Does This Part Belong To? *
                </label>
                <select
                  value={form.drone_name}
                  onChange={(e) => setForm({ ...form, drone_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="Universal / All Drones">Universal / Multiple Airframes</option>
                  {dronesList.map((d, i) => (
                    <option key={i} value={d.name}>{d.name} ({d.model_number})</option>
                  ))}
                  {/* Default popular drones if list empty */}
                  {dronesList.length === 0 && (
                    <>
                      <option value="DJI Agras T100">DJI Agras T100 (100kg Heavy Lift)</option>
                      <option value="DJI Agras T50">DJI Agras T50 (50kg Spraying)</option>
                      <option value="DJI Matrice 350 RTK">DJI Matrice 350 RTK (Mining Survey)</option>
                      <option value="DJI Mavic 3 Enterprise / Thermal">DJI Mavic 3 Thermal</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  2. Drone Component Section (Propeller, Nozzle, etc.) *
                </label>
                <select
                  value={form.part_section}
                  onChange={(e) => setForm({ ...form, part_section: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-amber-500"
                >
                  {DRONE_COMPONENT_SECTIONS.map((sec, i) => (
                    <option key={i} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Part Name, SKU & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Part Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Agras T100 60-inch Carbon Coaxial Propeller Set"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Part Number / SKU *</label>
              <input
                type="text"
                required
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="DH-PRP-T100"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono text-gray-900 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Units *</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 3: Role-based Visibility */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>User Role Visibility (Multiple Select)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'normal', label: 'Normal / Retail Users' },
                { id: 'wholesale', label: 'Wholesale Users (ABN)' },
                { id: 'agent', label: 'Service Agent Users' },
              ].map((role) => {
                const isChecked = form.visibility_roles.includes(role.id);
                return (
                  <div
                    key={role.id}
                    onClick={() => toggleRole(role.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                      isChecked
                        ? 'bg-amber-50/70 border-amber-400 text-amber-900'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <input type="checkbox" checked={isChecked} onChange={() => {}} className="rounded text-amber-600" />
                    <span className="text-xs font-bold">{role.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Tiered Pricing per Role & Discount */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Tiered Role Pricing & Discount (AUD)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Normal / Retail Price ($ AUD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price_normal}
                    onChange={(e) => handleNormalPriceChange(e.target.value)}
                    placeholder="380.00"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-gray-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Wholesale Price ($ AUD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price_wholesale}
                    onChange={(e) => setForm({ ...form, price_wholesale: e.target.value })}
                    placeholder="320.00"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-blue-700 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Service Agent Price ($ AUD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price_agent}
                    onChange={(e) => setForm({ ...form, price_agent: e.target.value })}
                    placeholder="290.00"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-indigo-700 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Discount */}
            <div className="pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Discount Option</label>
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="none">No Discount</option>
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed">Fixed Cash Discount ($ AUD)</option>
                </select>
              </div>

              {form.discount_type !== 'none' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Discount Amount</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    placeholder="10"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-rose-600 focus:outline-hidden focus:border-amber-500"
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

          {/* Section 5: Short & Full Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Short Description *</label>
              <textarea
                required
                rows={3}
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                placeholder="Brief summary of this spare part..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Technical Description *</label>
              <textarea
                required
                rows={3}
                value={form.full_description}
                onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                placeholder="Material specifications, installation notes, and compatibility..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 6: Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Part Image URL (Leave blank for black placeholder)
            </label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="/images/drone-parts-accessories.jpg (optional)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Part to Catalog</span>
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Parts Table with Delete */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Current Spare Parts Catalog ({parts.length})
            </h3>
            <p className="text-xs text-gray-500">Live components linked to airframes</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
              <tr>
                <th className="py-3 px-3">Image</th>
                <th className="py-3 px-3">Part Name & SKU</th>
                <th className="py-3 px-3">Compatible Drone</th>
                <th className="py-3 px-3">Component Section</th>
                <th className="py-3 px-3">Normal Price</th>
                <th className="py-3 px-3">Wholesale Price</th>
                <th className="py-3 px-3">Agent Price</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {parts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black border border-gray-200 flex items-center justify-center">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[8px] font-mono text-gray-500 font-bold">KALI</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="font-mono text-[11px] text-amber-700">{p.sku}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-cyan-800">
                    {p.drone_name || 'Universal'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] border border-amber-200">
                      {p.part_section || p.subcategory}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-gray-900">
                    {formatAud(p.price_cents)}
                  </td>
                  <td className="py-3 px-3 font-mono text-blue-700 font-semibold">
                    {formatAud(p.role_prices?.wholesale || p.price_cents * 0.88)}
                  </td>
                  <td className="py-3 px-3 font-mono text-indigo-700 font-semibold">
                    {formatAud(p.role_prices?.agent || p.price_cents * 0.80)}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={p.stock_qty <= 5 ? 'text-amber-600 font-bold' : 'text-gray-900'}>
                      {p.stock_qty} in stock
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDeletePart(p.id, p.name)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Part"
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
    </div>
  );
};
