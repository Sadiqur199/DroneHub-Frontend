import React, { useState, useEffect } from 'react';
import { categoryStore } from '../../services/productStore';
import {
  FolderTree, Plus, Trash2, Tag, Layers, CheckCircle2,
  AlertCircle, ChevronRight, X, Sparkles, Box
} from 'lucide-react';

export const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [activeType, setActiveType] = useState('drone'); // 'drone', 'part', 'accessory', 'combo'
  const [notice, setNotice] = useState(null);

  // New Category Form
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Subcategory Input per category
  const [subInputMap, setSubInputMap] = useState({});

  useEffect(() => {
    setCategories(categoryStore.getAll());
    const unsub = categoryStore.subscribe((updated) => setCategories(updated));
    return unsub;
  }, []);

  const triggerNotice = (msg, type = 'success') => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      categoryStore.addCategory({
        name: newCatName.trim(),
        type: activeType,
        description: newCatDesc.trim()
      });
      setNewCatName('');
      setNewCatDesc('');
      setShowAddCat(false);
      triggerNotice(`Added category "${newCatName.trim()}" successfully!`);
    } catch (err) {
      triggerNotice('Failed to add category: ' + err.message, 'error');
    }
  };

  const handleDeleteCategory = (catId, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}" and its subcategories?`)) {
      categoryStore.deleteCategory(catId);
      triggerNotice(`Category "${catName}" deleted.`);
    }
  };

  const handleAddSubcategory = (catId) => {
    const subName = subInputMap[catId]?.trim();
    if (!subName) return;

    categoryStore.addSubcategory(catId, subName);
    setSubInputMap(prev => ({ ...prev, [catId]: '' }));
    triggerNotice(`Added subcategory "${subName}"!`);
  };

  const handleDeleteSubcategory = (catId, subName) => {
    if (window.confirm(`Remove subcategory "${subName}"?`)) {
      categoryStore.deleteSubcategory(catId, subName);
      triggerNotice(`Subcategory "${subName}" removed.`);
    }
  };

  const TYPE_TABS = [
    { id: 'drone', label: 'Commercial Drones', color: 'text-cyan-400', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    { id: 'part', label: 'Genuine Spare Parts', color: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { id: 'accessory', label: 'Accessories & Payloads', color: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { id: 'combo', label: 'Turnkey Combos', color: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  ];

  const filteredCategories = categories.filter(c => c.type === activeType);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-8 shadow-xs">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Catalog Taxonomy Manager</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Categories & Sub-Categories Manager
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Admin can add, edit, and organize product categories and nested sub-categories. Added categories will appear immediately in the product upload forms and Shop sidebar filters.
          </p>
        </div>

        <button
          onClick={() => setShowAddCat(!showAddCat)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddCat ? 'Close Form' : 'Add New Category'}</span>
        </button>
      </div>

      {/* Add Category Form Modal/Dropdown */}
      {showAddCat && (
        <form onSubmit={handleAddCategory} className="bg-gray-50/80 rounded-2xl border border-gray-200 p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Create New {TYPE_TABS.find(t => t.id === activeType)?.label} Category</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddCat(false)}
              className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Broadacre Spray Drones or Carbon Props"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Product Type</label>
              <select
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-blue-500"
              >
                {TYPE_TABS.map(tab => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief summary of what hardware belongs here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddCat(false)}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Type Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
        {TYPE_TABS.map((tab) => {
          const isActive = activeType === tab.id;
          const count = categories.filter(c => c.type === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List of Categories in Active Type */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No categories defined for this type yet. Click "Add New Category" above to create one.
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 hover:border-gray-300 transition-all shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-gray-900">{cat.name}</h4>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                      slug: {cat.slug}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Nested Subcategories List */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sub-Categories ({cat.subcategories?.length || 0})</span>
                  </span>
                </div>

                {/* Subcategory Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {(cat.subcategories || []).map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 text-xs font-medium text-gray-800 border border-gray-200"
                    >
                      <span>{sub}</span>
                      <button
                        onClick={() => handleDeleteSubcategory(cat.id, sub)}
                        className="text-gray-400 hover:text-rose-600 p-0.5 rounded"
                        title="Remove Subcategory"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Add Subcategory Inline Input */}
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={subInputMap[cat.id] || ''}
                      onChange={(e) => setSubInputMap({ ...subInputMap, [cat.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubcategory(cat.id);
                        }
                      }}
                      placeholder="+ Add subcategory..."
                      className="px-2.5 py-1 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-blue-500 w-40"
                    />
                    <button
                      onClick={() => handleAddSubcategory(cat.id)}
                      className="p-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                      title="Add"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
