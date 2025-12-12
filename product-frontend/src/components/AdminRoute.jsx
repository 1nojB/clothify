import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated()) {
<<<<<<< HEAD

=======
>>>>>>> 34141186933c2f6d59c51097719d2d5a3de5c2d7
        return <Navigate to="/login?redirect=/admin" replace />;
    }

    if (!isAdmin()) {
<<<<<<< HEAD

=======
>>>>>>> 34141186933c2f6d59c51097719d2d5a3de5c2d7
        alert('Access denied. Admin privileges required.');
        return <Navigate to="/" replace />;
    }

<<<<<<< HEAD

=======
>>>>>>> 34141186933c2f6d59c51097719d2d5a3de5c2d7
    return children;
}