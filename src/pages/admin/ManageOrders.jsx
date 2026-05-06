import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const statusConfig = {
    pending:   { label: 'En attente', bg: 'bg-yellow-50', text: 'text-yellow-600', icon: '⏳' },
    confirmed: { label: 'Confirmée',  bg: 'bg-blue-50',   text: 'text-blue-600',   icon: '✅' },
    delivered: { label: 'Livrée',     bg: 'bg-green-50',  text: 'text-green-600',  icon: '📦' },
    cancelled: { label: 'Annulée',    bg: 'bg-red-50',    text: 'text-red-500',    icon: '❌' },
};

export default function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    useEffect(() => { api.get('/orders').then(res => setOrders(res.data)); }, []);

    const handleStatus = async (id, status) => {
        await api.put(`/orders/${id}/status`, { status });
        showToast('✅ Statut mis à jour — notification envoyée au client !');
        const res = await api.get('/orders');
        setOrders(res.data);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">← Dashboard</Link>
                    <h1 className="font-bold text-gray-800 text-lg">Gestion des Commandes</h1>
                </div>
            </nav>

            {toast && <div className="fixed top-20 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm">{toast}</div>}

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-5xl mb-3">📋</p>
                        <p className="text-gray-500">Aucune commande pour l'instant</p>
                    </div>
                ) : orders.map(order => {
                    const s = statusConfig[order.status] || statusConfig.pending;
                    return (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="flex flex-wrap justify-between items-center px-6 py-4 border-b border-gray-50 gap-3">
                                <div>
                                    <p className="font-semibold text-gray-800">Commande #{order.id}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        👤 {order.user?.name} — {order.user?.email}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`${s.bg} ${s.text} text-xs font-semibold px-3 py-1.5 rounded-full`}>
                                        {s.icon} {s.label}
                                    </span>
                                    <select
                                        value={order.status}
                                        onChange={e => handleStatus(order.id, e.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    >
                                        {Object.entries(statusConfig).map(([val, { label }]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="px-6 py-4 space-y-2">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                        <span>📦 {item.product?.name} × {item.quantity}</span>
                                        <span>{(item.unit_price * item.quantity).toFixed(2)} MAD</span>
                                    </div>
                                ))}
                            </div>

                            <div className="px-6 py-3 bg-gray-50 flex justify-end">
                                <p className="font-bold text-indigo-600">Total : {order.total} MAD</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}