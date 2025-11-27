// src/pages/Register.jsx
import React, { useState } from "react";
import { registerUser, saveUserLocally } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function onSubmit(e) {
    e.preventDefault();

    // basic validations
    if (!form.name.trim()) return setError("Name is required");
    if (!form.email.includes("@")) return setError("Valid email required");
    if (form.password.length < 4)
      return setError("Password must be at least 4 characters");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);
    try {
      const data = await registerUser(form);
      if (data?.status === "success" && data.user) {
        saveUserLocally(data.user);
        window.dispatchEvent(new Event("auth-changed"));
        nav("/", { replace: true });
      } else if (data?.status === "error") {
        setError(data.message || "Registration failed");
      } else if (data?.id) {
        saveUserLocally(data);
        nav("/", { replace: true });
      } else {
        setError("Unexpected response from server");
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
          <h2 className="auth-title">Create your Clothify account</h2>
          <p className="auth-sub">
            Join our community and start shopping in style!
          </p>
        </div>

        <form onSubmit={onSubmit} className="auth-form" noValidate>
          <label className="field">
            <span className="field-label">Full Name</span>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="John Doe"
              className="field-input"
            />
          </label>

          <label className="field">
            <span className="field-label">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              className="field-input"
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              className="field-input"
            />
          </label>

          <label className="field">
            <span className="field-label">Confirm Password</span>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="••••••••"
              className="field-input"
            />
          </label>

          {error && <div className="error auth-error">{error}</div>}

          <div className="auth-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => (window.location.href = "/login")}
            >
              Already have an account
            </button>
          </div>

          <div className="auth-footer">
            <a href="/help" className="link muted">
              Need help?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

