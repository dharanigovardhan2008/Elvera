import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { productsService } from '@/lib/firebase/products';
import { Product } from '@/lib/firebase/schema';

export default function Favorites() {
  const { user } = useAuthContext();
  const { favorites, toggleFavorite } = useAppContext();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Favorites IDs:', favorites); // Debug log
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
      const validProducts = products.filter((p) => p !== null) as Product[];
      console.log('Loaded products:', validProducts); // Debug log
      setFavoriteProducts(validProducts);
    } catch (error) {
      console.error('Error loading favorite products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    await toggleFavorite(productId, false); // Don't require login (already logged in)
  };

  // ✅ IF NOT LOGGED IN
  if (!user) {
    return (
      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 border border-zinc-200">
              <Heart className="w-10 h-10 text-zinc-400" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4 text-text">Your Favorites</h1>
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-12 text-text">Your Favorites</h1>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 border border-zinc-200">
              <Heart className="w-10 h-10 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4 text-text">No favorites yet</h2>
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-text mb-2">Your Favorites</h1>
            <p className="text-zinc-600">{favoriteProducts.length} saved items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(product.id)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors border border-zinc-200"
              >
                <X className="w-4 h-4 text-zinc-600 group-hover:text-red-600" />
              </button>

              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden bg-zinc-50">
                  <img
                    src={product.images?.[0]?.url || '/placeholder.jpg'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-lg mb-2 text-text line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-zinc-600 text-sm mb-3 capitalize">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-text">
                      ₹{product.price?.toLocaleString()}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-zinc-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
