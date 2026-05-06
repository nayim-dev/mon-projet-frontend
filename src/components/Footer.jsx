import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                    {/* Logo */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🛒</span>
                            <span className="font-bold text-white text-lg">IB-SHOP</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Votre destination shopping en ligne. Qualité, rapidité et satisfaction garanties.
                        </p>
                    </div>

                    {/* Liens */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Navigation</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-white transition">Accueil</Link></li>
                            <li><Link to="/cart" className="hover:text-white transition">Panier</Link></li>
                            <li><Link to="/my-orders" className="hover:text-white transition">Mes commandes</Link></li>
                            <li><Link to="/login" className="hover:text-white transition">Connexion</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>📧 contact@ibshop.ma</li>
                            <li>📞 +212 6 32 46 80 30</li>
                            <li>📍 El Jadida, Maroc</li>
                        </ul>
                        <div className="flex gap-3 mt-4">
                            <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition text-sm">f</a>
                            <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition text-sm">in</a>
                            <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition text-sm">ig</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 text-center text-xs">
                    © {new Date().getFullYear()} IB-shop. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}