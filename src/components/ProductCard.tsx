import { useState } from 'react';
import { Heart, ShoppingBag, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { cloudinaryStorage } from '@/lib/cloudinary/storage';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  platform: string;
  imageUrl: string;
  publicId?: string;
  rating: number;
  reviewCount: number;
  affiliateLink: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { toggleFavorite, toggleBag, favorites, bag, trackClick } = useAppContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  // State to track if the URL fails to load
  const [imageFailed, setImageFailed] = useState(false);

  // 🐛 DEVELOPER TOOL: Open your browser console (Right Click -> Inspect -> Console) 
  // to see exactly what image data is being passed to this card!
  console.log(`Data received for product "${product.title}":`, product);

  const isFav = favorites.includes(product.id);
  const inBag = bag.includes(product.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await toggleFavorite(product.id, true);

    if (!success && !user) {
      navigate('/login');
    }
  };

  const handleBagClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await toggleBag(product.id, true);

    if (!success && !user) {
      navigate('/login');
    }
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackClick(product.id, product.title, product.platform);
    window.open(product.affiliateLink, '_blank');
  };

  const platformColors: Record<string, string> = {
    Amazon: 'bg-orange-100 text-orange-700',
    Myntra: 'bg-pink-100 text-pink-700',
    Flipkart: 'bg-blue-100 text-blue-700',
    Ajio: 'bg-red-100 text-red-700',
    amazon: 'bg-orange-100 text-orange-700',
    myntra: 'bg-pink-100 text-pink-700',
    flipkart: 'bg-blue-100 text-blue-700',
    ajio: 'bg-red-100 text-red-700',
  };

  // Your exact original logic
  const finalImageUrl =
    product.publicId && product.publicId.trim() !== ''
      ? cloudinaryStorage.getOptimizedUrl(product.publicId, {
          width: 800,
          height: 1000,
          crop: 'fill',
          quality: 'auto',
        })
      : product.imageUrl;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col bg-white rounded-[2rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-zinc-50">
        
        {/* If we have a URL and it hasn't failed, try to show the image */}
        {finalImageUrl && !imageFailed ? (
          <img
            src={finalImageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageFailed(true)} // If image is broken, trigger the error state
          />
        ) : (
          /* If there is NO URL, or the URL is broken, show this message */
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-400 p-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">
              Image Error
            </span>
            <span className="text-[10px] uppercase text-zinc-400">
              Check Browser Console
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${
              platformColors[product.platform] || 'bg-zinc-100 text-zinc-700'
            }`}
          >
            {product.platform}
          </span>
        </div>

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
              isFav
                ? 'bg-black text-white'
                : 'bg-white/80 text-zinc-600 hover:bg-white hover:text-black shadow-sm'
            }`}
          >
            <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleBagClick}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
              inBag
                ? 'bg-black text-white'
                : 'bg-white/80 text-zinc-600 hover:bg-white hover:text-black shadow-sm'
            }`}
          >
            <ShoppingBag className="w-4 h-4" fill={inBag ? 'currentColor' : 'none'} />
          </button>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-4 h-4 fill-zinc-900 text-zinc-900" />
          <span className="text-sm font-semibold text-zinc-900">{product.rating}</span>
          <span className="text-xs text-zinc-400 font-medium">({product.reviewCount})</span>
        </div>

        <Link to={`/product/${product.id}`} className="block mb-1">
          <h3 className="font-serif font-semibold text-lg text-text truncate group-hover:underline underline-offset-4 decoration-1">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 font-medium leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-bold tracking-tight text-text">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          <button
            onClick={handleBuy}
            className="flex items-center gap-2 bg-text text-white px-5 py-2.5 rounded-full text-sm font-bold tracking-wide hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
          >
            BUY <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
