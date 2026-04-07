import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Combos from './pages/Combos';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Bag from './pages/Bag';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';  // ✅ NEW
import AdminCombos from './pages/admin/Combos';
import AdminAnalytics from './pages/admin/Analytics';
import AdminUsers from './pages/admin/Users';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shoes" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/combos" element={<Combos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/bag" element={<Bag />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AddProduct />} />  {/* ✅ NEW */}
          <Route path="combos" element={<AdminCombos />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">
              <AnimatedRoutes />
            </div>
            <Footer />
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#111111',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '16px 24px',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                fontSize: '14px',
              },
            }}
          />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
