// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Register from "./pages/Register";
import Login from "./pages/Login";

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import InventoryManagement from './pages/admin/InventoryManagement';

// ✅ Import AdminRoute
import AdminRoute from './components/AdminRoute';


export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* ✅ Navbar always visible */}
        <Navbar />

        {/* ✅ CartDrawer mounted globally so it can listen for toggle events */}
        <CartDrawer />

        <main className="container" style={{ paddingTop: 18 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:pid" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ✅ Protected Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/admin/inventory" element={<AdminRoute><InventoryManagement /></AdminRoute>} />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

