const API_GATEWAY = import.meta.env.VITE_API_GATEWAY || "http://localhost:8084";
const BASE = import.meta.env.VITE_API_BASE || `${API_GATEWAY}/api/users`;

export async function registerUser(payload) {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function loginUser(payload) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

const STORAGE_KEY = "clothify_user_v1";

export function saveUserLocally(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getLocalUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function clearLocalUser() {
  localStorage.removeItem(STORAGE_KEY);
}
