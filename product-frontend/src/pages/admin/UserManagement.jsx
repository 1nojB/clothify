import React, { useState, useEffect } from 'react';
import { fetchAllUsers } from '../../api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to load users:', err);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1>User Management</h1>
                    <p className="admin-subtitle">View all registered customers</p>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Registered</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: 24 }}>Loading...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: 24 }}>No users found</td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id || user.userId}>
                                    <td>{user.id || user.userId}</td>
                                    <td>{user.name || '—'}</td>
                                    <td>{user.email || '—'}</td>
                                    <td>{user.phone || '—'}</td>
                                    <td>{user.address || '—'}</td>
                                    <td>{user.createdAt || user.registeredDate || '—'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="stat-mini" style={{ marginTop: 24 }}>
                <div className="stat-mini-label">Total Registered Users</div>
                <div className="stat-mini-value">{users.length}</div>
            </div>
        </div>
    );
}
