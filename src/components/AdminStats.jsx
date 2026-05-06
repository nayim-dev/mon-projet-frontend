import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminStats() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        Promise.all([
            api.get('/products'),
            api.get('/categories'),
            api.get('/orders'),
            api.get('/users'),
        ]).then(([products, categories, orders, users]) => {
            const totalRevenue = orders.data
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, o) => sum + parseFloat(o.total), 0);

            setStats({
                products: products.data.length,
                categories: categories.data.length,
                orders: orders.data.length,
                users: users.data.length,
                revenue: totalRevenue,
                pending: orders.data.filter(o => o.status === 'pending').length,
                delivered: orders.data.filter(o => o.status === 'delivered').length,
                cancelled: orders.data.filter(o => o.status === 'cancelled').length,
            });
        });
    }, []);

    if (!stats) return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
            ))}
        </div>
    );

    const cards = [
        { label: 'Produits', value: stats.products, icon: '📦', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Commandes', value: stats.orders, icon: '🛒', color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Utilisateurs', value: stats.users, icon: '👥', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Chiffre d\'affaires', value: `${stats.revenue.toFixed(0)} MAD`, icon: '💰', color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {cards.map(card => (
                    <div key={card.label} className="bg-white rounded-2xl shadow-sm p-6">
                        <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                            <span className="text-xl">{card.icon}</span>
                        </div>
                        <p className="text-gray-500 text-sm">{card.label}</p>
                        <p className={`text-2xl font-bold ${card.color} mt-1`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Statuts des commandes */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Statut des commandes</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        <p className="text-xs text-yellow-600 mt-1">⏳ En attente</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                        <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                        <p className="text-xs text-green-600 mt-1">📦 Livrées</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                        <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
                        <p className="text-xs text-red-500 mt-1">❌ Annulées</p>
                    </div>
                </div>
            </div>
        </div>
    );
}