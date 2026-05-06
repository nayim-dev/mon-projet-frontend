import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

const IMAGE_BASE = 'http://127.0.0.1:8000/storage/';

export default function Cart() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
    const [toast, setToast] = useState('');
    const [loading, setLoading] = useState(false);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        const newCart = cart.map(i => i.id === id ? { ...i, quantity } : i);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeItem = (id) => {
        const newCart = cart.filter(i => i.id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleOrder = async () => {
        if (!user) return navigate('/login');
        if (cart.length === 0) return showToast('Votre panier est vide !');
        setLoading(true);
        try {
            const items = cart.map(i => ({
                product_id: i.id,
                quantity: i.quantity,
                unit_price: i.price,
            }));
            await api.post('/orders', { items });
            localStorage.removeItem('cart');
            setCart([]);
            showToast('✅ Commande passée avec succès !');
            setTimeout(() => navigate('/my-orders'), 1500);
        } catch {
            showToast('Erreur lors de la commande.');
        } finally {
            setLoading(false);
        }
    };

    const getImage = (item) => {
        if (!item.image) return null;
        if (item.image.startsWith('http')) return item.image;
        return IMAGE_BASE + item.image;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar cartCount={cart.length} />

            {toast && (
                <div className="fixed top-20 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm">
                    {toast}
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mon Panier</h2>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-5xl mb-4">🛒</p>
                        <p className="text-gray-500 mb-6">Votre panier est vide</p>
                        <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                            Continuer les achats
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                                <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {getImage(item) ? (
                                        <img src={getImage(item)} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">📦</span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-indigo-600 font-medium text-sm">{item.price} MAD</p>
                                </div>

                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600">−</button>
                                    <span className="px-3 py-1 font-semibold text-sm">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600">+</button>
                                </div>

                                <p className="font-bold text-gray-800 w-24 text-right">{(item.price * item.quantity).toFixed(2)} MAD</p>

                                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition text-xl">✕</button>
                            </div>
                        ))}

                        {/* Total */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
                            <div>
                                <p className="text-gray-500 text-sm">Total</p>
                                <p className="text-2xl font-bold text-indigo-600">{total.toFixed(2)} MAD</p>
                            </div>
                            <button
                                onClick={handleOrder}
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition"
                            >
                                {loading ? 'Traitement...' : 'Confirmer la commande'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}