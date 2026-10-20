// DroneHub Australia — Centralized API Client
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

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

// ─────────────────────────────────────────────
// Authentication API
// ─────────────────────────────────────────────
export const authApi = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  getMe: async (email) => {
    const res = await fetch(`${API_BASE_URL}/auth/me?email=${encodeURIComponent(email)}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  logout: () => {
    localStorage.removeItem('dh_token');
    localStorage.removeItem('dh_user');
  },
};

// ─────────────────────────────────────────────
// Products & Catalog API
// ─────────────────────────────────────────────
export const productsApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products?${query}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  create: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },
};

// ─────────────────────────────────────────────
// Tutorials & Flight Academy API
// ─────────────────────────────────────────────
export const tutorialsApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/tutorials?${query}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  create: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/admin/tutorials`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/tutorials/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },
};

// ─────────────────────────────────────────────
// Checkout & Orders API
// ─────────────────────────────────────────────
export const ordersApi = {
  checkout: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return res.json();
  },

  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/orders`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  updateStatus: async (orderId, status) => {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
};

// ─────────────────────────────────────────────
// Settings & Banner API
// ─────────────────────────────────────────────
export const settingsApi = {
  getBanner: async () => {
    const res = await fetch(`${API_BASE_URL}/settings/banner`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  updateBanner: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/admin/settings/banner`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return res.json();
  },
};
