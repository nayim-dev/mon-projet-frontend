import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Navbar({ cartCount = 0 }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef(null);

    const unread = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        if (user && user.role !== 'admin') {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotif(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch {}
    };

    const handleMarkAllRead = async () => {
        await api.put('/notifications/read-all');
        fetchNotifications();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl">🛒</span>
                        <span className="font-bold text-xl text-indigo-600">IB-SHOP</span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                        Dashboard
                                    </Link>
                                )}

                                {user.role !== 'admin' && (
                                    <>
                                        {/* Panier */}
                                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition">
                                            <span className="text-xl">🛒</span>
                                            {cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>

                                        {/* Mes commandes */}
                                        <Link to="/my-orders" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                                            Mes commandes
                                        </Link>

                                        {/* Notifications */}
                                        <div className="relative" ref={notifRef}>
                                            <button
                                                onClick={() => setShowNotif(!showNotif)}
                                                className="relative p-2 text-gray-600 hover:text-indigo-600 transition"
                                            >
                                                <span className="text-xl">🔔</span>
                                                {unread > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        {unread}
                                                    </span>
                                                )}
                                            </button>

                                            {showNotif && (
                                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                                    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                                                        <span className="font-semibold text-gray-800">Notifications</span>
                                                        {unread > 0 && (
                                                            <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 hover:underline">
                                                                Tout marquer lu
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="max-h-72 overflow-y-auto">
                                                        {notifications.length === 0 ? (
                                                            <p className="text-center text-gray-400 text-sm py-6">Aucune notification</p>
                                                        ) : (
                                                            notifications.map(n => (
                                                                <div key={n.id} className={`px-4 py-3 border-b border-gray-50 ${!n.is_read ? 'bg-indigo-50' : ''}`}>
                                                                    <p className="text-sm text-gray-700">{n.message}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                        {new Date(n.created_at).toLocaleDateString('fr-FR')}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* User info + logout */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-semibold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-600 hidden sm:block">{user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-gray-500 hover:text-red-500 transition"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                                    Connexion
                                </Link>
                                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}