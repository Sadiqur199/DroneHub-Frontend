import React, { useState } from 'react';
import { formatAud, calculateGst, COMPANY_INFO } from '../data/products';
import { ordersApi, session } from '../services/api';
import { 
  Trash2, Plus, Minus, ShoppingBag, Truck, ShieldCheck, 
  ArrowRight, CheckCircle2, ChevronRight, ArrowLeft, Upload, FileText, AlertCircle, Clock 
} from 'lucide-react';

export const Cart = ({ cart, onUpdateQty, onRemoveItem, onClearCart, onNavigate }) => {
  const [shippingMethod, setShippingMethod] = useState('startrack');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    po_number: '',
    address: '',
    notes: '',
  });

  const [documentFile, setDocumentFile] = useState(null);

  // Auto-fill form if user is already logged in
  React.useEffect(() => {
    const u = session.getUser();
    if (u) {
      setFormData(prev => ({
        ...prev,
        name: u.name || prev.name,
        email: u.email || prev.email,
        phone: u.phone || prev.phone,
      }));
    }
  }, []);

  // Calculate Subtotal
  const subtotalCents = cart.reduce((sum, item) => sum + (item.price_cents * item.qty), 0);

  // Shipping
  let shippingCents = 0;
  if (shippingMethod === 'standard') {
    shippingCents = subtotalCents > 50000 ? 0 : 2500; // Free over $500 AUD
  } else if (shippingMethod === 'startrack') {
    shippingCents = 6500; // $65.00 AUD Express Air Freight + Signature
  } else {
    shippingCents = 0; // Free pickup in Mackay
  }

  const grandTotalCents = subtotalCents + shippingCents;
  const gstCents = calculateGst(grandTotalCents);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    // Checkout requires a signed-in account so the order is tied to a customer.
    if (!session.isLoggedIn()) {
      setErrorMsg('Please sign in before placing an order.');
      onNavigate('auth');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setErrorMsg('Please complete all required customer information fields.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('address', formData.address);
      payload.append('company', formData.company || '');
      payload.append('po_number', formData.po_number || '');
      payload.append('shipping_method', shippingMethod);
      payload.append('notes', formData.notes || '');
      payload.append('items', JSON.stringify(cart));

      if (documentFile) {
        payload.append('document', documentFile);
      }

      const res = await ordersApi.checkout(payload);

      if (res.success) {
        setOrderResult(res);
        onClearCart();
      } else {
        setErrorMsg(res.message || 'Failed to submit order. Please check inputs.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg(
        err.status === 401
          ? 'Your session has expired. Please sign in again.'
          : err.message || 'Network error connecting to backend API. Please retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#0F172A] text-slate-100 min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 shadow-xl backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
              Shopping Cart & Checkout
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Order Review & Australian Tax Invoice Submission
            </h1>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Shopping
          </button>
        </div>

        {orderResult ? (
          <div className="p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-2xl mx-auto border border-emerald-300 bg-white shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Order Received & Mackay Hub Stock Allocated
              </span>
              <h2 className="text-3xl font-bold text-gray-900">
                Order Confirmed: {orderResult.order_number}
              </h2>
            </div>

            <div className="p-5 rounded-2xl text-xs font-mono text-gray-700 space-y-2 text-left bg-gray-50 border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span>
                <span className="text-gray-900 font-bold">{orderResult.data.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-800">{orderResult.data.customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Charged (AUD):</span>
                <span className="text-gray-900 font-bold">{orderResult.data.total_charged}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Includes 10% Australian GST:</span>
                <span>{orderResult.data.gst_included}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Seller ABN:</span>
                <span className="text-gray-800">{COMPANY_INFO.abn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fulfillment Hub:</span>
                <span className="text-gray-800">Mackay Airport Industrial Park, QLD</span>
              </div>
              {orderResult.data.document_url && (
                <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center text-blue-600">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Uploaded Document:
                  </span>
                  <a
                    href={orderResult.data.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline hover:text-blue-800"
                  >
                    View Document File
                  </a>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Your order has been recorded in the central database. Our workshop operations lead will review your document and dispatch via StarTrack Express.
            </p>

            <button
              onClick={() => {
                setOrderResult(null);
                onNavigate('products');
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Return to Fleet Catalog
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="py-20 rounded-3xl text-center text-gray-500 space-y-4 border border-dashed border-gray-200 bg-white">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">Your Cart is Currently Empty</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Explore commercial drones, high-capacity flight batteries, and certified OEM spare parts.
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items & Customer Info Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Cart Items List */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center justify-between border-b border-gray-100 pb-3">
                  <span>Ordered Hardware ({cart.length} items)</span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    Clear Cart
                  </button>
                </h3>

                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image_url || '/drone.png'}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-contain bg-gray-50 border border-gray-200 p-1 shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/drone.png';
                          }}
                        />
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                          <p className="text-xs font-mono text-gray-500 mt-0.5">
                            SKU: {item.sku || 'DH-PART'} • {formatAud(item.price_cents)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Qty controls */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="p-1.5 hover:bg-gray-200 text-gray-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-800">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="p-1.5 hover:bg-gray-200 text-gray-600"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <span className="text-sm font-bold text-gray-900">
                            {formatAud(item.price_cents * item.qty)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information & Document Upload Form */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                  <span>Customer & Delivery Information</span>
                  <span className="text-xs text-gray-400 font-normal">* Required fields</span>
                </h3>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Lachlan Smith"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. lachlan@agri-fleet.com.au"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 0412 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Company / ABN (Optional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Central QLD Agronomics (ABN 51 824...)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Delivery Address (Street, Suburb, State, Postcode) *
                    </label>
                    <textarea
                      name="address"
                      required
                      rows="2"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. 14 Airport Industrial Way, Paget QLD 4740"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    ></textarea>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Purchase Order / Reference Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="po_number"
                      value={formData.po_number}
                      onChange={handleInputChange}
                      placeholder="e.g. PO-2026-8819"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* ========================================================= */}
                {/* DOCUMENT UPLOAD SECTION (PDF, JPG, PNG, DOCX) */}
                {/* ========================================================= */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Upload Supporting Document (Optional)</span>
                    </label>
                    <span className="text-[11px] text-gray-400">PDF, JPG, PNG, DOCX (Max 20MB)</span>
                  </div>

                  <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-5 text-center transition-colors bg-gray-50/50">
                    <input
                      type="file"
                      id="doc-upload"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.zip"
                      className="hidden"
                    />
                    <label htmlFor="doc-upload" className="cursor-pointer space-y-2 block">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        {documentFile ? (
                          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{documentFile.name} ({(documentFile.size / 1024).toFixed(1)} KB)</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs font-semibold text-gray-700">
                              Click to attach CASA ReOC certification, ID proof, or purchase requisition
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              This file will be securely sent to our Mackay operations team with your order.
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary & Checkout Submission */}
            <div className="lg:col-span-5 space-y-6">
              {/* Shipping Options */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Australian Shipping Options</span>
                </h3>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('startrack')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === 'startrack'
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-gray-900">StarTrack Express Air Freight</div>
                      <div className="text-[11px] text-gray-500">1-2 Days • Air Cargo + Signature on Delivery</div>
                    </div>
                    <span className="text-xs font-bold text-gray-900">$65.00 AUD</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-gray-900">Australia Post Standard Freight</div>
                      <div className="text-[11px] text-gray-500">3-5 Days • Free on orders over $500 AUD</div>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {subtotalCents > 50000 ? 'FREE' : '$25.00 AUD'}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('pickup')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === 'pickup'
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-gray-900">Mackay Workshop Pickup</div>
                      <div className="text-[11px] text-gray-500">Gordon & Gregory St, Mackay QLD 4740</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">FREE</span>
                  </label>
                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Australian Tax Summary
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatAud(subtotalCents)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Freight</span>
                    <span className="font-semibold text-gray-900">
                      {shippingCents === 0 ? 'FREE' : formatAud(shippingCents)}
                    </span>
                  </div>

                  <div className="flex justify-between text-emerald-700 font-semibold pt-2 border-t border-gray-100">
                    <span>Includes 10% Australian GST</span>
                    <span>{formatAud(gstCents)}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total Order Cost (AUD)</span>
                    <span className="text-blue-600">{formatAud(grandTotalCents)}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.01]"
                >
                  {submitting ? (
                    <span>Allocating Stock & Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Order & Generate Tax Invoice</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-[11px] text-gray-400 text-center space-y-1">
                  <p>Certified Australian Merchant • ABN {COMPANY_INFO.abn}</p>
                  <p>Encrypted API connection to Mackay fulfillment engine.</p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
