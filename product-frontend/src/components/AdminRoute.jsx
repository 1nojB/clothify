import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated()) {

        return <Navigate to="/login?redirect=/admin" replace />;
    }

    if (!isAdmin()) {

        alert('Access denied. Admin privileges required.');
        return <Navigate to="/" replace />;
    }


    return children;
}