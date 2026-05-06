import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function ManageUsers() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const fetchUsers = () => api.get('/users').then(res => setUsers(res.data));

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id) => {
        if (id === currentUser.id) return showToast('❌ Vous ne pouvez pas supprimer votre propre compte');
        if (!confirm('Supprimer cet utilisateur ?')) return;
        await api.delete(`/users/${id}`);
        showToast('✅ Utilisateur supprimé');
        fetchUsers();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">← Dashboard</Link>
                    <h1 className="font-bold text-gray-800 text-lg">Gestion des Utilisateurs</h1>
                </div>
            </nav>

            {toast && <div className="fixed top-20 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm">{toast}</div>}

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Utilisateur</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rôle</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-indigo-600 font-semibold text-sm">{u.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <span className="font-medium text-gray-800 text-sm">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {u.role === 'admin' ? '⚙️ Admin' : '👤 User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            disabled={u.id === currentUser.id}
                                            className="text-red-400 hover:text-red-600 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}