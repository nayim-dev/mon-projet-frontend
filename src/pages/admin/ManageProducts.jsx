import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const IMAGE_BASE = 'http://127.0.0.1:8000/storage/';

export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
    const [imageFile, setImageFile] = useState(null);
    const [editId, setEditId] = useState(null);
    const [toast, setToast] = useState('');
    const [showForm, setShowForm] = useState(false);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const fetchAll = () => {
        api.get('/products').then(res => setProducts(res.data));
        api.get('/categories').then(res => setCategories(res.data));
    };

    useEffect(() => { fetchAll(); }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, val]) => { if (val) formData.append(key, val); });
            if (imageFile) formData.append('image', imageFile);

            if (editId) {
                 await api.post(`/products/${editId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    showToast('✅ Produit modifié');
               
                
            } else {
                await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                showToast('✅ Produit ajouté');
            }
            setForm({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
            setImageFile(null); setEditId(null); setShowForm(false);
            fetchAll();
        } catch { showToast('❌ Erreur lors de la sauvegarde'); }
    };

    const handleEdit = (p) => {
        setEditId(p.id);
        setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, category_id: p.category_id, image_url: p.image?.startsWith('http') ? p.image : '' });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce produit ?')) return;
        await api.delete(`/products/${id}`);
        showToast('✅ Produit supprimé');
        fetchAll();
    };

    const getImage = (p) => {
        if (!p.image) return null;
        if (p.image.startsWith('http')) return p.image;
        return IMAGE_BASE + p.image;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">← Dashboard</Link>
                        <h1 className="font-bold text-gray-800 text-lg">Gestion des Produits</h1>
                    </div>
                    <button
                        onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' }); }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                    >
                        + Nouveau produit
                    </button>
                </div>
            </nav>

            {toast && <div className="fixed top-20 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm">{toast}</div>}

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Formulaire */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                        <h2 className="font-semibold text-gray-800 mb-4">{editId ? 'Modifier' : 'Ajouter'} un produit</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" name="name" placeholder="Nom du produit" value={form.name} onChange={handleChange} required />
                            <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" name="category_id" value={form.category_id} onChange={handleChange} required>
                                <option value="">Choisir une catégorie</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <input className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" name="price" type="number" placeholder="Prix (MAD)" value={form.price} onChange={handleChange} required />
                            <input className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
                            <input className="sm:col-span-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" name="description" placeholder="Description" value={form.description} onChange={handleChange} />

                            {/* Image */}
                            <div className="sm:col-span-2 space-y-2">
                                <p className="text-sm font-medium text-gray-700">Image du produit</p>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" name="image_url" placeholder="URL d'image (https://...)" value={form.image_url} onChange={handleChange} />
                                <p className="text-xs text-gray-400 text-center">— ou —</p>
                                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
                            </div>

                            <div className="sm:col-span-2 flex gap-3">
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition">
                                    {editId ? 'Modifier' : 'Ajouter'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm transition">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Grille produits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map(p => (
                        <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
                            <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
                                {getImage(p) ? (
                                    <img src={getImage(p)} alt={p.name} className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-4xl">📦</span>
                                )}
                            </div>
                            <div className="p-4">
                                <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full">{p.category?.name}</span>
                                <h3 className="font-semibold text-gray-800 mt-2 truncate">{p.name}</h3>
                                <div className="flex justify-between items-center mt-2 mb-4">
                                    <span className="text-indigo-600 font-bold">{p.price} MAD</span>
                                    <span className="text-xs text-gray-400">Stock: {p.stock}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(p)} className="flex-1 text-sm py-2 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
                                        ✏️ Modifier
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="flex-1 text-sm py-2 border border-red-100 text-red-400 rounded-lg hover:bg-red-50 transition">
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}