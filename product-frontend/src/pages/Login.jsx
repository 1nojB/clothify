// src/pages/Login.jsx
import React, { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Please fill email and password");
    setLoading(true);
    try {
      const data = await loginUser({ email: form.email, password: form.password });

      if (data?.status === "success" && data.user) {
        login(data.user);
        const redirect = new URLSearchParams(loc.search).get("redirect") || "/";
        nav(redirect, { replace: true });
      } else if (data?.status === "error") {
        setError(data.message || "Login failed");
      } else if (data?.id) {
        login(data);
        nav("/", { replace: true });
      } else {
        setError("Unexpected server response");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Sign in to Clothify</h2>
          <p className="auth-sub">Welcome back — enter your details to continue.</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form" noValidate>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              type="email"
              className="field-input"
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              type="password"
              className="field-input"
              autoComplete="current-password"
            />
          </label>

          {error && <div className="error auth-error">{error}</div>}

          <div className="auth-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => (window.location.href = "/register")}
            >
              Create account
            </button>
          </div>

          <div className="auth-footer">
            <a href="/forgot-password" className="link">Forgot password?</a>
            <span className="muted"> • </span>
            <a href="/help" className="link muted">Need help?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

