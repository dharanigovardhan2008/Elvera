import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import { productsService } from '@/lib/firebase/products';
import { Product } from '@/lib/firebase/schema';

export default function Favorites() {
  const { user } = useAuthContext();
  const { favorites } = useAppContext();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && favorites.length > 0) {
      loadFavoriteProducts();
    } else {
      setFavoriteProducts([]);
      setLoading(false);
    }
  }, [favorites, user]);

  const loadFavoriteProducts = async () => {
    try {
      setLoading(true);
      const products = await Promise.all(
        favorites.map((id) => productsService.getProductById(id))
      );
      setFavoriteProducts(products.filter((p) => p !== null) as Product[]);
    } catch (error) {
      console.error('Error loading favorite products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ IF NOT LOGGED IN
  if (!user) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-zinc-400" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4">Your Favorites</h1>
            <p className="text-zinc-600 mb-8 max-w-md">
              Please log in to save and view your favorite items.
            </p>
            <Link
              to="/login"
              className="px-8 py-4 bg-text text-white rounded-capsule text-sm font-bold tracking-widest hover:bg-zinc-800 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              LOG IN OR SIGN UP
            </Link>
          </div>
        </div>
      </motion.main>
    );
  }

  // ✅ LOADING STATE
  if (loading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text"></div>
          </div>
        </div>
      </motion.main>
    );
  }

  // ✅ NO FAVORITES
  if (favoriteProducts.length === 0) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-12">Your Favorites</h1>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">No favorites yet</h2>
            <p className="text-zinc-600 mb-8 max-w-md">
              Start adding items to your favorites by clicking the heart icon on products you love.
            </p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-text text-white rounded-capsule text-sm font-bold tracking-widest hover:bg-zinc-800 transition-all"
            >
              START SHOPPING
            </Link>
          </div>
        </div>
      </motion.main>
    );
  }

  // ✅ SHOW FAVORITES
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-4">Your Favorites</h1>
        <p className="text-zinc-600 mb-12">{favoriteProducts.length} saved items</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.title}
                  className="w-full h-64 object-cover"
                />
              </Link>
              <div className="p-4">
                <h3 className="font-serif font-bold text-lg mb-2">{product.title}</h3>
                <p className="text-zinc-600 text-sm mb-2">{product.category}</p>
                <p className="text-xl font-bold">₹{product.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
