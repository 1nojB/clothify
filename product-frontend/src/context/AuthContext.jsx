import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('auth-changed'));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-changed'));
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    // ✅ Check if user is admin
    const isAdmin = () => {
        return user && user.role === 'ADMIN';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
