import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const IMAGE_BASE = 'http://127.0.0.1:8000/storage/';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
    const [toast, setToast] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        api.get(`/products/${id}`).then(res => setProduct(res.data));
    }, [id]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const addToCart = () => {
        if (!user) { navigate('/login'); return; }
        const existing = cart.find(i => i.id === product.id);
        const newCart = existing
            ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
            : [...cart, { ...product, quantity }];
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        showToast('✅ Produit ajouté au panier !');
    };

    const getImage = (product) => {
        if (!product.image) return null;
        if (product.image.startsWith('http')) return product.image;
        return IMAGE_BASE + product.image;
    };

    if (!product) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar cartCount={cart.length} />
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar cartCount={cart.length} />

            {toast && (
                <div className="fixed top-20 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm">
                    {toast}
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 py-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 text-sm font-medium">
                    ← Retour
                </button>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image */}
                        <div className="h-80 md:h-auto bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
                            {getImage(product) ? (
                                <img src={getImage(product)} alt={product.name} className="h-full w-full object-contain" />
                            ) : (
                                <span className="text-8xl">📦</span>
                            )}
                        </div>

                        {/* Infos */}
                        <div className="p-8 flex flex-col justify-between">
                            <div>
                                <span className="text-xs text-indigo-500 font-medium bg-indigo-50 px-3 py-1 rounded-full">
                                    {product.category?.name}
                                </span>
                                <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-2">{product.name}</h1>
                                <p className="text-gray-500 text-sm mb-6">{product.description}</p>

                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-3xl font-bold text-indigo-600">{product.price} MAD</span>
                                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                        {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                                    </span>
                                </div>

                                {/* Quantité */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-sm text-gray-600 font-medium">Quantité :</span>
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition">−</button>
                                        <span className="px-4 py-2 font-semibold text-gray-800">{quantity}</span>
                                        <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition">+</button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={addToCart}
                                disabled={product.stock === 0}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
                            >
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}