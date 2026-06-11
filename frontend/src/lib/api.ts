const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("tolumak-auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.token || null;
    }
  } catch {}
  return null;
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  const url = buildUrl(path, params);
  const token = await getToken();

  const isFormData = fetchOptions.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, { ...fetchOptions, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<T>(path, { method: "GET", params }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PUT", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};

export const authApi = {
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  register: (data: { name: string; email: string; password: string }) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  refresh: (token: string) => api.post("/auth/refresh", { refreshToken: token }),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data: FormData | Record<string, unknown>) => api.put("/auth/profile", data),
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data: { token: string; password: string }) => api.post("/auth/reset-password", data),
};

export const productsApi = {
  getProducts: (filters?: Record<string, string | number | boolean | undefined>) =>
    api.get("/products", filters),
  getProduct: (slug: string) => api.get(`/products/${slug}`),
  getFeatured: () => api.get("/products/featured"),
  getNewArrivals: (limit?: number) => api.get("/products/new-arrivals", { limit }),
  getBestSellers: (limit?: number) => api.get("/products/best-sellers", { limit }),
  getSale: (limit?: number) => api.get("/products/sale", { limit }),
  getRelated: (slug: string) => api.get("/products", { limit: 4 }),
  search: (query: string) => api.get("/products/search", { q: query }),
};

export const categoriesApi = {
  getCategories: () => api.get("/categories"),
  getCategory: (slug: string) => api.get(`/categories/${slug}`),
};

export const brandsApi = {
  getBrands: () => api.get("/brands"),
};

export const cartApi = {
  getCart: () => api.get("/cart"),
  addToCart: (data: { productId: string; quantity: number; size?: string; color?: string }) =>
    api.post("/cart", data),
  updateCartItem: (itemId: string, data: { quantity: number }) =>
    api.put(`/cart/${itemId}`, data),
  removeCartItem: (itemId: string) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete("/cart"),
  applyCoupon: (code: string) => api.post("/cart/coupon", { code }),
  removeCoupon: () => api.delete("/cart/coupon"),
};

export const wishlistApi = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (productId: string) => api.post("/wishlist/items", { productId }),
  removeFromWishlist: (productId: string) => api.delete(`/wishlist/items/${productId}`),
};

export const ordersApi = {
  createOrder: (data: Record<string, unknown>) => api.post("/orders", data),
  getMyOrders: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get("/orders/my-orders", params),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`),
};

export const reviewsApi = {
  getProductReviews: (productId: string, params?: Record<string, string | number | boolean | undefined>) =>
    api.get(`/reviews/product/${productId}`, params),
  createReview: (data: { productId: string; rating: number; comment: string; images?: string[] }) =>
    api.post("/reviews", data),
};

export const paymentsApi = {
  initializePaystack: (data: { orderId: string; amount: number; email: string }) =>
    api.post("/payments/paystack/initialize", data),
  initializeFlutterwave: (data: { orderId: string; amount: number; email: string }) =>
    api.post("/payments/flutterwave/initialize", data),
};

export const uploadsApi = {
  uploadImage: (data: FormData) => api.post("/uploads/image", data),
  uploadImages: (data: FormData) => api.post("/uploads/images", data),
  deleteImage: (publicId: string) => api.delete(`/uploads/image/${publicId}`),
};

export const adminApi = {
  getStats: () => api.get("/admin/dashboard"),
  getSales: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get("/admin/dashboard/sales-chart", params),
  getProducts: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get("/admin/products", params),
  createProduct: (data: Record<string, unknown>) => api.post("/admin/products", data),
  updateProduct: (id: string, data: Record<string, unknown>) => api.patch(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  getCategories: () => api.get("/admin/categories"),
  createCategory: (data: FormData) => api.post("/admin/categories", data),
  updateCategory: (id: string, data: FormData) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),
  getBrands: () => api.get("/admin/brands").catch(() => ({ data: [] })),
  createBrand: (data: FormData) => api.post("/admin/brands", data),
  updateBrand: (id: string, data: FormData) => api.put(`/admin/brands/${id}`, data),
  deleteBrand: (id: string) => api.delete(`/admin/brands/${id}`),
  getOrders: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get("/admin/orders", params),
  getOrder: (id: string) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => api.put(`/admin/orders/${id}/status`, { status }),
  getCustomers: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get("/admin/customers", params),
  getCustomer: (id: string) => api.get(`/admin/customers/${id}`),
  getCoupons: () => api.get("/admin/coupons"),
  createCoupon: (data: Record<string, unknown>) => api.post("/admin/coupons", data),
  updateCoupon: (id: string, data: Record<string, unknown>) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id: string) => api.delete(`/admin/coupons/${id}`),
  getReviews: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get("/admin/reviews", params).catch(() => ({ data: [] })),
  approveReview: (id: string) => api.patch(`/admin/reviews/${id}/approve`),
  deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`).catch(() => ({})),
  getBanners: () => api.get("/admin/banners").catch(() => ({ data: [] })),
  createBanner: (data: FormData) => api.post("/admin/banners", data).catch(() => ({})),
  updateBanner: (id: string, data: FormData) => api.put(`/admin/banners/${id}`, data).catch(() => ({})),
  deleteBanner: (id: string) => api.delete(`/admin/banners/${id}`).catch(() => ({})),
  getSubscribers: () => api.get("/admin/newsletter/subscribers").catch(() => ({ data: [] })),
  deleteSubscriber: (id: string) => api.delete(`/admin/subscribers/${id}`).catch(() => ({})),
  getSettings: () => api.get("/admin/settings").catch(() => ({ data: null })),
  updateSettings: (data: Record<string, unknown>) => api.put("/admin/settings", data).catch(() => ({})),
};

export const newsletterApi = {
  subscribe: (email: string) => api.post("/newsletter/subscribe", { email }),
  unsubscribe: (email: string) => api.post("/newsletter/unsubscribe", { email }),
};

export const contactApi = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post("/contact", data),
};
