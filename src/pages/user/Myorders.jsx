import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

const statusConfig = {
    pending:   { label: 'En attente', bg: 'bg-yellow-50', text: 'text-yellow-600', icon: '⏳' },
    confirmed: { label: 'Confirmée',  bg: 'bg-blue-50',   text: 'text-blue-600',   icon: '✅' },
    delivered: { label: 'Livrée',     bg: 'bg-green-50',  text: 'text-green-600',  icon: '📦' },
    cancelled: { label: 'Annulée',    bg: 'bg-red-50',    text: 'text-red-500',    icon: '❌' },
};

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    useEffect(() => {
        api.get('/orders/my').then(res => setOrders(res.data));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar cartCount={cart.length} />

            <div className="max-w-3xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Commandes</h2>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-5xl mb-4">📋</p>
                        <p className="text-gray-500">Vous n'avez pas encore de commandes</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => {
                            const s = statusConfig[order.status] || statusConfig.pending;
                            return (
                                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50">
                                        <div>
                                            <p className="font-semibold text-gray-800">Commande #{order.id}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <span className={`${s.bg} ${s.text} text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1`}>
                                            {s.icon} {s.label}
                                        </span>
                                    </div>

                                    <div className="px-6 py-4 space-y-2">
                                        {order.items?.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                                <span>📦 {item.product?.name} × {item.quantity}</span>
                                                <span>{(item.unit_price * item.quantity).toFixed(2)} MAD</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="px-6 py-4 bg-gray-50 flex justify-end">
                                        <p className="font-bold text-indigo-600">Total : {order.total} MAD</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}