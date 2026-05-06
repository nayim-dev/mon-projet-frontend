import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminStats from '../../components/AdminStats';


export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const cards = [
        { title: 'Produits', icon: '📦', link: '/admin/products', color: 'from-indigo-500 to-indigo-600', desc: 'Gérer le catalogue' },
        { title: 'Catégories', icon: '🗂️', link: '/admin/categories', color: 'from-purple-500 to-purple-600', desc: 'Organiser les produits' },
        { title: 'Commandes', icon: '🛒', link: '/admin/orders', color: 'from-amber-500 to-amber-600', desc: 'Suivre les commandes' },
        { title: 'Utilisateurs', icon: '👥', link: '/admin/users', color: 'from-emerald-500 to-emerald-600', desc: 'Gérer les comptes' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar Admin */}
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⚙️</span>
                        <span className="font-bold text-xl text-gray-800">Admin Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm text-indigo-600 hover:underline">Voir la boutique</Link>
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-sm">{user?.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-gray-600">{user?.name}</span>
                        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 transition">Déconnexion</button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Bonjour, {user?.name} 👋</h1>
                    <p className="text-gray-500 text-sm mt-1">Gérez votre boutique depuis ce tableau de bord</p>
                </div>

                <AdminStats />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map(card => (
                        <Link
                            key={card.title}
                            to={card.link}
                            className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-6 shadow-sm hover:shadow-md transition hover:-translate-y-1`}
                        >
                            <span className="text-4xl">{card.icon}</span>
                            <h3 className="font-bold text-lg mt-4">{card.title}</h3>
                            <p className="text-white/70 text-sm mt-1">{card.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}