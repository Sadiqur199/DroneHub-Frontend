// DroneHab Australia — Centralized API Client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

const getHeaders = (isFormData = false) => {
  const headers = {};
  const token = localStorage.getItem('dh_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }
  return headers;
};

/**
 * Perform a request and normalise transport / HTTP errors into a rejected
 * promise carrying the server's message, so callers can surface it directly.
 */
const request = async (url, options = {}) => {
  const res = await fetch(url, options);

  let payload = null;
  try {
    payload = await res.json();
  } catch (e) {
    payload = null;
  }

  if (!res.ok) {
    const message = payload?.message || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

// ─────────────────────────────────────────────
// Session helpers
// ─────────────────────────────────────────────
export const session = {
  getUser: () => {
    try {
      const raw = localStorage.getItem('dh_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  isLoggedIn: () => !!localStorage.getItem('dh_token'),
  isAdmin: () => {
    const user = session.getUser();
    return !!user?.is_admin;
  },
  /** Storefront role: 'normal' | 'wholesale' | 'agent' */
  getRole: () => {
    const user = session.getUser();
    if (!user) return 'normal';
    if (user.role === 'wholesale' || user.is_wholesale || user.group_slug === 'wholesale') return 'wholesale';
    if (user.role === 'agent' || user.is_agent || user.group_slug === 'agent') return 'agent';
    return 'normal';
  },
  save: (token, user) => {
    localStorage.setItem('dh_token', token);
    localStorage.setItem('dh_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('dh-auth-changed', { detail: { token, user } }));
  },
  clear: () => {
    localStorage.removeItem('dh_token');
    localStorage.removeItem('dh_user');
    window.dispatchEvent(new CustomEvent('dh-auth-changed', { detail: { token: null, user: null } }));
  },
};

// ─────────────────────────────────────────────
// Authentication API
// ─────────────────────────────────────────────
export const authApi = {
  login: async (credentials) => {
    const res = await request(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    if (res?.success && res.token) session.save(res.token, res.user);
    return res;
  },

  register: async (userData) => {
    const res = await request(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    if (res?.success && res.token) session.save(res.token, res.user);
    return res;
  },

  me: async () => {
    if (!session.isLoggedIn()) return { success: false, user: null };
    return request(`${API_BASE_URL}/auth/me`, { headers: getHeaders() });
  },

  logout: async () => {
    try {
      if (session.isLoggedIn()) {
        await request(`${API_BASE_URL}/auth/logout`, { method: 'POST', headers: getHeaders() });
      }
    } catch (e) {
      // Token may already be invalid — clearing the session is enough.
    }
    session.clear();
  },

  /** Local-only sign out (no server round trip). */
  logoutLocal: () => session.clear(),
};

// ─────────────────────────────────────────────
// Products & Catalog API
// ─────────────────────────────────────────────
export const productsApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''))
    ).toString();
    return request(`${API_BASE_URL}/products${query ? `?${query}` : ''}`, {
      headers: getHeaders(),
    });
  },

  getById: async (id) => {
    return request(`${API_BASE_URL}/products/${id}`, { headers: getHeaders() });
  },

  create: async (formData) => {
    return request(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
  },

  update: async (id, formData) => {
    // PHP only parses multipart bodies for POST, so PUT/PATCH payloads would
    // arrive empty. Laravel's method spoofing handles the real verb.
    formData.append('_method', 'PUT');
    return request(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
  },

  delete: async (id) => {
    return request(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  importExcel: async (file, category) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', category);
    return request(`${API_BASE_URL}/admin/products/import`, {
      method: 'POST',
      headers: getHeaders(true),
      body: fd,
    });
  },
};

// ─────────────────────────────────────────────
// Categories API
// ─────────────────────────────────────────────
export const categoriesApi = {
  getAll: async () => request(`${API_BASE_URL}/categories`, { headers: getHeaders() }),

  create: async (payload) =>
    request(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }),

  update: async (id, payload) =>
    request(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }),

  remove: async (id) =>
    request(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }),

  addSubcategory: async (id, name) =>
    request(`${API_BASE_URL}/admin/categories/${id}/subcategories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name }),
    }),

  removeSubcategory: async (id, slug) =>
    request(`${API_BASE_URL}/admin/categories/${id}/subcategories/${slug}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }),
};

// ─────────────────────────────────────────────
// Tutorials & Flight Academy API
// ─────────────────────────────────────────────
export const tutorialsApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`${API_BASE_URL}/tutorials${query ? `?${query}` : ''}`, {
      headers: getHeaders(),
    });
  },

  create: async (formData) => {
    return request(`${API_BASE_URL}/admin/tutorials`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
  },

  delete: async (id) => {
    return request(`${API_BASE_URL}/admin/tutorials/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },
};

// ─────────────────────────────────────────────
// Checkout & Orders API
// ─────────────────────────────────────────────
export const ordersApi = {
  checkout: async (formData) => {
    return request(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
  },

  /** Orders belonging to the signed-in customer. */
  mine: async () => {
    return request(`${API_BASE_URL}/orders/mine`, { headers: getHeaders() });
  },

  getAll: async () => {
    return request(`${API_BASE_URL}/admin/orders`, { headers: getHeaders() });
  },

  updateStatus: async (orderId, status) => {
    return request(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
  },
};

// ─────────────────────────────────────────────
// Settings & Banner API
// ─────────────────────────────────────────────
export const settingsApi = {
  getBanner: async () => {
    return request(`${API_BASE_URL}/settings/banner`, { headers: getHeaders() });
  },

  getAll: async () => {
    return request(`${API_BASE_URL}/settings`, { headers: getHeaders() });
  },

  updateBanner: async (formData) => {
    return request(`${API_BASE_URL}/admin/settings/banner`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
  },
};
