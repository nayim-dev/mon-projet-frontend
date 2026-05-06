import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Chargement...</div>;
    return user ? children : <Navigate to="/login" />;
};

export const AdminRoute = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();
    if (loading) return <div>Chargement...</div>;
    if (!user) return <Navigate to="/login" />;
    if (!isAdmin()) return <Navigate to="/" />;
    return children;
};