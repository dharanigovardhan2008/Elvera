import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, ExternalLink, ChevronLeft, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);
  const { toggleFavorite, toggleBag, favorites, bag, trackClick } = useAppContext();

  if (!product) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-serif font-bold text-text mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-zinc-500 hover:text-text underline underline-offset-4">Return to Shop</Link>
      </div>
    );
  }

  const isFav = favorites.includes(product.id);
  const inBag = bag.includes(product.id);

  const handleBuy = () => {
    trackClick(product.id, product.platform);
    window.open(product.affiliateLink, '_blank');
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto"
    >
      <Link to="/shop" className="inline-flex items-center gap-2 text-zinc-500 hover:text-text font-bold text-xs uppercase tracking-widest mb-12 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-zinc-100 shadow-[0_20px_60px_rgb(0,0,0,0.08)]">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 flex flex-col gap-3">
            <button 
              onClick={() => toggleFavorite(product.id)}
              className={`p-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl border border-white/20 ${isFav ? 'bg-black text-white' : 'bg-white/80 text-zinc-600 hover:bg-white hover:text-black hover:scale-105'}`}
            >
              <Heart className="w-6 h-6" fill={isFav ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => toggleBag(product.id)}
              className={`p-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl border border-white/20 ${inBag ? 'bg-black text-white' : 'bg-white/80 text-zinc-600 hover:bg-white hover:text-black hover:scale-105'}`}
            >
              <ShoppingBag className="w-6 h-6" fill={inBag ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1.5 rounded-capsule bg-zinc-100 text-zinc-800 text-xs font-bold tracking-widest uppercase">
              {product.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold text-zinc-900 bg-zinc-50 px-3 py-1 rounded-capsule border border-zinc-200">
              <Star className="w-4 h-4 fill-zinc-900" /> {product.rating} <span className="text-zinc-400 font-medium">({product.reviewCount})</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold text-text mb-6 leading-tight text-balance">
            {product.title}
          </h1>
          
          <p className="text-lg text-zinc-500 mb-10 leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100 mb-10">
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Available on {product.platform}</p>
            <div className="flex items-end justify-between mb-8">
              <span className="text-5xl font-bold tracking-tighter text-text">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-capsule">
                <ShieldCheck className="w-4 h-4" /> Trusted Platform
              </span>
            </div>
            
            <button 
              onClick={handleBuy}
              className="w-full flex items-center justify-center gap-3 bg-text text-white px-8 py-5 rounded-capsule text-sm font-bold tracking-widest hover:bg-zinc-800 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)]"
            >
              BUY FROM {product.platform.toUpperCase()} <ExternalLink className="w-5 h-5" />
            </button>
            <p className="text-center text-xs font-medium text-zinc-400 mt-6 tracking-wide text-balance">
              By clicking this button, you will be redirected to the platform to securely complete your purchase. We do not handle your payment details.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-sm tracking-widest uppercase text-zinc-400 mb-4">Size Guide</h3>
            <div className="flex flex-wrap gap-3">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <div key={size} className="w-14 h-14 rounded-full border border-zinc-200 flex items-center justify-center font-bold text-zinc-400 bg-white">
                  {size}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 font-medium tracking-wide">Sizes shown above are typically available. Please confirm actual availability on the partner platform.</p>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
