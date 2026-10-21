import React, { useState, useEffect } from 'react';
import { ordersApi, session, authApi } from '../services/api';
import {
  User, Package, LogOut, ShieldCheck, ShoppingBag, ArrowRight,
  Building2, CheckCircle2, AlertCircle, Clock, FileText, Truck
} from 'lucide-react';

const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Shipped: 'bg-sky-50 text-sky-700 border-sky-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const TIER_LABELS = {
  normal: 'Retail Customer',
  wholesale: 'Approved Wholesale Partner (ABN)',
  agent: 'Authorized Service Agent',
};

export const CustomerDashboard = ({ onNavigate }) => {
  const [user, setUser] = useState(session.getUser());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.mine();
      if (res.success) {
        setOrders(res.data || []);
        setError('');
      }
    } catch (err) {
      setError(
        err.status === 401
          ? 'Your session has expired. Please sign in again.'
          : 'Could not reach the DroneHub server. Please try again shortly.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session.isLoggedIn()) {
      onNavigate('auth');
      return;
    }
    loadOrders();
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    setUser(null);
    onNavigate('home');
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-sm text-slate-400">You need to sign in to view your account.</p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 pb-24">
      {/* Header */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 to-[#0F172A] px-4 sm:px-8 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <User className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">My Account</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {user.name} · {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 self-start"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Account tier */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Account Type
            </div>
            <div className="text-sm font-bold text-white mt-1.5">
              {TIER_LABELS[user.role] || 'Retail Customer'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Prices and products are tailored to this tier.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              Orders Placed
            </div>
            <div className="text-2xl font-black text-white mt-1.5 font-mono">{orders.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Across the Mackay hub</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              Contact
            </div>
            <div className="text-sm font-bold text-white mt-1.5">{user.phone || '—'}</div>
            <p className="text-[11px] text-slate-500 mt-1 truncate">{user.email}</p>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              Order History
            </h2>
            <button
              onClick={loadOrders}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="p-5 flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border-b border-rose-900/50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-10 text-center text-xs text-slate-500">Loading your orders…</div>
          ) : orders.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-700 mx-auto" />
              <p className="text-xs text-slate-400">You have not placed any orders yet.</p>
              <button
                onClick={() => onNavigate('shop')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                Browse the store
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {orders.map((order) => (
                <div key={order.id} className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-sm font-bold text-white">{order.order_number}</div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm font-black text-white font-mono">{order.total_formatted}</div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString('en-AU')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3 h-3" />
                      {order.shipping_method}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3 h-3" />
                      {order.item_count} item(s)
                    </span>
                    {order.has_document && (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Payment proof attached
                      </span>
                    )}
                  </div>

                  {order.items?.length > 0 && (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300">
                            {item.part_name} × {item.quantity}
                          </span>
                          <span className="font-mono text-slate-400">
                            ${Number(item.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
