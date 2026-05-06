import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const fetchCategories = () => api.get('/categories').then(res => setCategories(res.data));

    useEffect(() => { fetchCategories(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/categories/${editId}`, { name, description });
                showToast('✅ Catégorie modifiée');
            } else {
                await api.post('/categories', { name, description });
                showToast('✅ Catégorie ajoutée');
            }
            setName(''); setDescription(''); setEditId(null);
            fetchCategories();
        } catch { showToast('❌ Erreur lors de la sauvegarde'); }
    };

    const handleEdit = (cat) => { setEditId(cat.id); setName(cat.name); setDescription(cat.description || ''); };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette catégorie ?')) return;
        await api.delete(`/categories/${id}`);
        showToast('✅ Catégorie supprimée');
        fetchCategories();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">← Dashboard</Link>
                    <h1 className="font-bold text-gray-800 text-lg">Gestion des Catégories</h1>
                </div>
            </nav>

            {toast && <div className="fixed top-20 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm">{toast}</div>}

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Formulaire */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h2 className="font-semibold text-gray-800 mb-4">{editId ? 'Modifier' : 'Ajouter'} une catégorie</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <input
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Nom de la catégorie"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Description (optionnel)"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition">
                            {editId ? 'Modifier' : 'Ajouter'}
                        </button>
                        {editId && (
                            <button type="button" onClick={() => { setEditId(null); setName(''); setDescription(''); }} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm transition">
                                Annuler
                            </button>
                        )}
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nom</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-400">#{cat.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{cat.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{cat.description || '—'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleEdit(cat)} className="text-indigo-500 hover:text-indigo-700 text-sm font-medium mr-4">Modifier</button>
                                        <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Supprimer</button>
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