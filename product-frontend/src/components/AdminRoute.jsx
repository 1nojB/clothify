import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated()) {
        // Not logged in, redirect to login
        return <Navigate to="/login?redirect=/admin" replace />;
    }

    if (!isAdmin()) {
        // Logged in but not admin, redirect to home
        alert('Access denied. Admin privileges required.');
        return <Navigate to="/" replace />;
    }

    // User is admin, allow access
    return children;
}