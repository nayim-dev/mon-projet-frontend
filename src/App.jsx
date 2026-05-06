import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';

// Pages user
import Cart from './pages/user/Cart';
import MyOrders from './pages/user/MyOrders';

// Pages admin
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';
import NotFound from './pages/NotFound';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products/:id" element={<ProductDetail />} />

                    {/* Routes user connecté */}
                    <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                    <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />

                    {/* Routes admin */}
                    <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
                    <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
