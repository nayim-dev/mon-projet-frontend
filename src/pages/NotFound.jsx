import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-8xl font-bold text-indigo-200 mb-4">404</p>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Page introuvable</h1>
                <p className="text-gray-500 mb-8">La page que vous cherchez n'existe pas ou a été déplacée.</p>
                <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}