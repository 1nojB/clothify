const API_GATEWAY = import.meta.env.VITE_API_GATEWAY || 'http://localhost:8084';

export const PRODUCT_API = import.meta.env.VITE_PRODUCT_API || `${API_GATEWAY}/product-service`;
export const USER_API = import.meta.env.VITE_USER_API || `${API_GATEWAY}/api/users`;
export const ORDER_API = import.meta.env.VITE_ORDER_API || `${API_GATEWAY}/api`;
export const INVENTORY_API = import.meta.env.VITE_INVENTORY_API || `${API_GATEWAY}/api`;

export const API_BASE = PRODUCT_API;
export const ORDER_API_BASE = ORDER_API;
export async function fetchAllProducts() {
  const res = await fetch(`${PRODUCT_API}/products`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function searchProductsByName(name) {
  const res = await fetch(`${PRODUCT_API}/products?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

export async function getProductById(pid) {
  const res = await fetch(`${PRODUCT_API}/products/${pid}`);
  if (res.status === 404) throw new Error('Product not found');
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
  return res.json();
}

export async function createProduct(productData) {
  const res = await fetch(`${PRODUCT_API}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error(`Failed to create product: ${res.status}`);
  return res.json();
}

export async function updateProduct(pid, productData) {
  const res = await fetch(`${PRODUCT_API}/products/${pid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error(`Failed to update product: ${res.status}`);
  return res.json();
}

export async function deleteProduct(pid) {
  const res = await fetch(`${PRODUCT_API}/products/${pid}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete product: ${res.status}`);
  return res.ok;
}

export async function fetchAllOrders() {
  const res = await fetch(`${ORDER_API}/orders`);
  if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
  return res.json();
}

export async function getOrderById(orderId) {
  const res = await fetch(`${ORDER_API}/orders/${orderId}`);
  if (res.status === 404) throw new Error('Order not found');
  if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`);
  return res.json();
}

export async function createOrder(orderData) {
  const res = await fetch(`${ORDER_API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error(`Failed to create order: ${res.status}`);
  return res.json();
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${ORDER_API}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update order status: ${res.status}`);
  return res.json();
}

export async function fetchAllUsers() {
  const res = await fetch(`${USER_API}`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
}

export async function getUserById(userId) {
  const res = await fetch(`${USER_API}/${userId}`);
  if (res.status === 404) throw new Error('User not found');
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
  return res.json();
}

export async function fetchAllInventory() {
  const res = await fetch(`${INVENTORY_API}/inventory`);
  if (!res.ok) throw new Error(`Failed to fetch inventory: ${res.status}`);
  return res.json();
}

export async function getInventoryByProductId(productId) {
  const res = await fetch(`${INVENTORY_API}/inventory/${productId}`);
  if (res.status === 404) throw new Error('Inventory not found');
  if (!res.ok) throw new Error(`Failed to fetch inventory: ${res.status}`);
  return res.json();
}

export async function updateInventory(productId, quantity) {
  const res = await fetch(`${INVENTORY_API}/inventory/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error(`Failed to update inventory: ${res.status}`);
  return res.json();
}