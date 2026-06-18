import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Auto-attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const sendOTP = (phone) => API.post('/auth/send-otp', { phone });
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getProductRecs = (id) => API.get(`/products/${id}/recommendations`);
export const rateProduct = (id, rating) => API.post(`/products/${id}/rate`, { rating });

// Orders
export const placeOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const cancelOrder = (id) => API.post(`/orders/${id}/cancel`);
export const fileComplaint = (id, data) => API.post(`/orders/${id}/complaint`, data);
export const rateOrder = (id, data) => API.post(`/orders/${id}/rate`, data);

// Admin
export const adminLogin = (password) => API.post('/admin/login', { password });
export const getAdminStats = () => API.get('/admin/stats');
export const getAnalytics = () => API.get('/admin/analytics');
export const getAdminOrders = (params) => API.get('/admin/orders', { params });
export const updateOrder = (id, data) => API.put(`/admin/orders/${id}`, data);
export const getAdminUsers = () => API.get('/admin/users');
export const banUser = (id, isBanned) => API.put(`/admin/users/${id}/ban`, { isBanned });
export const addProduct = (data) => API.post('/admin/products', data);
export const updateProduct = (id, data) => API.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/admin/products/${id}`);
export const getComplaints = () => API.get('/admin/complaints');
export const resolveComplaint = (orderId, adminReply) => API.put(`/admin/complaints/${orderId}/resolve`, { adminReply });
export const getDemandForecast = () => API.get('/admin/demand-forecast');

// AI
export const sendAIMessage = (prompt, history) => API.post('/ai/chat', { prompt, history });
export const getAIRecommendations = () => API.get('/ai/recommendations');
export const detectFreshness = () => API.post('/ai/detect-freshness');

export default API;
