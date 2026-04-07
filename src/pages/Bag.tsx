import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, ExternalLink } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { productsService } from '@/lib/firebase/products';
import { Product } from '@/lib/firebase/schema';

export default function Bag() {
  const { user } = useAuthContext();
  const { bag, toggleBag } = useAppContext();
  const [bagProducts, setBagProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Bag IDs:', bag); // Debug log
    if (user && bag.length > 0) {
      loadBagProducts();
    } else {
      setBagProducts([]);
      setLoading(false);
    }
  }, [bag, user]);

  const loadBagProducts = async () => {
    try {
      setLoading(true);
      const products = await Promise.all(
        bag.map((id) => productsService.getProductById(id))
      );
      const validProducts = products.filter((p) => p !== null) as Product[];
      console.log('Loaded bag products:', validProducts); // Debug log
      setBagProducts(validProducts);
    } catch (error) {
      console.error('Error loading bag products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    await toggleBag(productId, false); // Don't require login
  };

  const total = bagProducts.reduce((sum, product) => sum + (product.price || 0), 0);
  const savings = bagProducts.reduce(
    (sum, product) => sum + ((product.originalPrice || product.price) - product.price),
    0
  );

  // ✅ IF NOT LOGGED IN
  if (!user) {
    return (
      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 border border-zinc-200">
              <ShoppingBag className="w-10 h-10 text-zinc-400" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4 text-text">Your Bag</h1>
            <p className="text-zinc-600 mb-8 max-w-md">
              Please log in to save and view items in your bag.
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

  // ✅ BAG IS EMPTY
  if (bagProducts.length === 0) {
    return (
      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-12 text-text">Your Bag</h1>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 border border-zinc-200">
              <ShoppingBag className="w-10 h-10 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4 text-text">Your bag is empty</h2>
            <p className="text-zinc-600 mb-8 max-w-md">
              Add items to your bag and they'll appear here.
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

  // ✅ SHOW BAG ITEMS
  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-4 text-text">Your Bag</h1>
        <p className="text-zinc-600 mb-12">{bagProducts.length} items</p>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Bag Items */}
          <div className="lg:col-span-2 space-y-6">
            {bagProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-6 bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <Link to={`/product/${product.id}`} className="flex-shrink-0">
                  <img
                    src={product.images?.[0]?.url || '/placeholder.jpg'}
                    alt={product.title}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-serif font-bold text-lg mb-2 text-text hover:text-zinc-700 transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-zinc-600 mb-4 capitalize">{product.category}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <p className="text-2xl font-bold text-text">₹{product.price?.toLocaleString()}</p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-zinc-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-text hover:underline"
                  >
                    Buy on {product.platform} <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="flex-shrink-0 p-2 hover:bg-red-50 rounded-full h-fit transition-colors"
                  title="Remove from bag"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sticky top-32">
              <h2 className="font-serif font-bold text-xl mb-6 text-text">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Subtotal</span>
                  <span className="font-medium">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Items</span>
                  <span>{bagProducts.length}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You Save</span>
                    <span className="font-medium">₹{savings.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-zinc-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 text-center mb-4">
                This is an affiliate site. Products are sold by partner platforms.
              </p>
              <p className="text-xs text-zinc-400 text-center">
                Click on products to purchase from {bagProducts[0]?.platform || 'partner sites'}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
