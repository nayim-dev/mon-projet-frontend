import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SkeletonCard from '../components/SkeletonCard';

const IMAGE_BASE = 'http://127.0.0.1:8000/storage/';

export default function Home() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
    const [toast, setToast] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        Promise.all([
            api.get('/products'),
            api.get('/categories'),
        ]).then(([prodRes, catRes]) => {
            setProducts(prodRes.data);
            setCategories(catRes.data);
            setLoading(false);
        });
    }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const addToCart = (product) => {
        if (!user) { showToast('🔒 Connectez-vous pour ajouter au panier'); return; }
        const existing = cart.find(i => i.id === product.id);
        const newCart = existing
            ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...cart, { ...product, quantity: 1 }];
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        showToast('✅ Produit ajouté au panier !');
    };

    const getImage = (product) => {
        if (!product.image) return null;
        if (product.image.startsWith('http')) return product.image;
        return IMAGE_BASE + product.image;
    };

    // Filtrage
    let filtered = products.filter(p => {
        const matchCat = selectedCategory ? p.category_id === parseInt(selectedCategory) : true;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchMin = minPrice ? p.price >= parseFloat(minPrice) : true;
        const matchMax = maxPrice ? p.price <= parseFloat(maxPrice) : true;
        return matchCat && matchSearch && matchMin && matchMax;
    });

    // Tri
    if (sortBy === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'newest') filtered = [...filtered].sort((a, b) => b.id - a.id);

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar cartCount={cart.length} />

            {/* Toast */}
            {toast && (
                <div className="fixed top-20 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm animate-bounce">
                    {toast}
                </div>
            )}

            {/* Hero */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">Bienvenue sur Ma Boutique 🛒</h1>
                    <p className="text-indigo-100 text-xl mb-8">Découvrez nos produits de qualité au meilleur prix</p>
                    <div className="relative max-w-lg mx-auto">
                        <input
                            type="text"
                            placeholder="🔍 Rechercher un produit..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="w-full px-6 py-4 rounded-2xl text-gray-800 text-sm focus:outline-none shadow-xl"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
                {/* Filtres */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
                    {/* Catégories */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === '' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50'}`}
                        >
                            Tous
                        </button>
                        {categories.map(c => (
                            <button
                                key={c.id}
                                onClick={() => handleCategoryChange(c.id.toString())}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === c.id.toString() ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50'}`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>

                    {/* Tri */}
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="default">Trier par défaut</option>
                        <option value="price_asc">Prix croissant</option>
                        <option value="price_desc">Prix décroissant</option>
                        <option value="name">Nom A-Z</option>
                        <option value="newest">Plus récents</option>
                    </select>
                </div>

                {/* Filtre prix */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
                    <span className="text-sm font-medium text-gray-600">Filtrer par prix :</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min (MAD)"
                            value={minPrice}
                            onChange={e => { setMinPrice(e.target.value); setCurrentPage(1); }}
                            className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <span className="text-gray-400">—</span>
                        <input
                            type="number"
                            placeholder="Max (MAD)"
                            value={maxPrice}
                            onChange={e => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                            className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {(minPrice || maxPrice) && (
                            <button
                                onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                                className="text-xs text-red-400 hover:text-red-600 transition"
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>
                    <span className="text-sm text-gray-400 ml-auto">{filtered.length} produit(s) trouvé(s)</span>
                </div>

                {/* Grille produits */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : paginated.length === 0 ? (
                        <div className="col-span-4 text-center py-20 text-gray-400">
                            <p className="text-5xl mb-3">🔍</p>
                            <p className="font-medium">Aucun produit trouvé</p>
                            <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
                        </div>
                    ) : (
                        paginated.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1">
                                {/* Image */}
                                <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
                                    {getImage(product) ? (
                                        <img
                                            src={getImage(product)}
                                            alt={product.name}
                                            className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                                        />
                                    ) : (
                                        <span className="text-5xl">📦</span>
                                    )}
                                    {product.stock <= 5 && product.stock > 0 && (
                                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                            Plus que {product.stock} !
                                        </span>
                                    )}
                                    {product.stock === 0 && (
                                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                            Rupture
                                        </span>
                                    )}
                                    {product.id % 3 === 0 && (
                                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                            Nouveau
                                        </span>
                                    )}
                                </div>

                                {/* Infos */}
                                <div className="p-4">
                                    <span className="text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-1 rounded-full">
                                        {product.category?.name}
                                    </span>
                                    <h3 className="font-semibold text-gray-800 mt-2 mb-1 truncate">{product.name}</h3>
                                    <p className="text-indigo-600 font-bold text-lg">{product.price} MAD</p>
                                    <p className="text-xs text-gray-400 mb-3">Stock : {product.stock}</p>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/products/${product.id}`}
                                            className="flex-1 text-center text-xs font-medium py-2 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                                        >
                                            Détails
                                        </Link>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                            className="flex-1 text-xs font-medium py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                                        >
                                            + Panier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mb-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-indigo-50 disabled:opacity-40 transition"
                        >
                            ← Précédent
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl text-sm font-medium transition ${currentPage === page ? 'bg-indigo-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-indigo-50'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-indigo-50 disabled:opacity-40 transition"
                        >
                            Suivant →
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}