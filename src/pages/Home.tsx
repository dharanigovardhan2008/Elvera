import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ComboCard from '../components/ComboCard';
import { productsService } from '@/lib/firebase/products';
import { combosService } from '@/lib/firebase/combos';

const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const categories = ['Shirts', 'Pants', 'Jeans', 'Trousers'];

export default function Home() {
  // ---------------------------------------------------------
  // 🛑 BACKEND & LOGIC: 100% UNTOUCHED
  // ---------------------------------------------------------
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [featuredCombos, setFeaturedCombos] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await productsService.getAllProducts();
        const combos = await combosService.getAllCombos();

        const formattedProducts = products.slice(0, 4).map((product: any) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          platform:
            product.platform?.charAt(0).toUpperCase() + product.platform?.slice(1),
          imageUrl: product.images?.[0]?.url || '',
          publicId: product.images?.[0]?.publicId || '',
          rating: product.rating || 4.5,
          reviewCount: product.reviews || 0,
          affiliateLink: product.affiliateLink,
        }));

        const formattedCombos = combos.slice(0, 2).map((combo: any) => ({
          ...combo,
          imageUrl: combo.images?.[0]?.url || '',
        }));

        setFeaturedProducts(formattedProducts);
        setFeaturedCombos(formattedCombos);
      } catch (error) {
        console.error('Error loading home data:', error);
      }
    };

    loadData();
  }, []);
  // ---------------------------------------------------------

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="min-h-screen pt-24 pb-20 overflow-hidden"
    >
      {/* 
        ✅ HERO SECTION UI FIXES ONLY
        Removed the dark background image and replaced white-on-white text 
        with high-contrast dark gray/black text for perfect visibility. 
      */}
      <section className="relative px-6 lg:px-12 max-w-7xl mx-auto mb-32 h-[80vh] min-h-[600px] flex flex-col justify-center">
        {/* Clean, minimalist white background container */}
        <div className="absolute inset-0 rounded-[3rem] overflow-hidden -z-10 bg-white shadow-[0_4px_40px_rgb(0,0,0,0.03)] border border-zinc-100">
           <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white"></div>
        </div>

        <motion.div variants={fadeUp} className="relative z-10 flex flex-col items-center text-center px-4">
          <span className="mb-6 px-6 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-bold tracking-[0.2em] uppercase">
            Curated Menswear
          </span>
          
          {/* Changed 'text-white' to 'text-zinc-900' (Black) */}
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif font-semibold text-zinc-900 tracking-widest leading-none mb-6 text-balance">
            ELVERA
          </h1>
          
          {/* Changed 'text-zinc-200' to 'text-zinc-500' (Readable Medium Gray) */}
          <p className="text-lg md:text-2xl text-zinc-500 font-medium tracking-wide max-w-2xl mb-12 text-balance">
            Dress like no one else. The finest curation of premium fashion from trusted platforms.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Primary Button: Solid Black with White Text */}
            <Link
              to="/shop"
              className="group px-10 py-5 bg-zinc-900 text-white rounded-full text-sm font-bold tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              SHOP COLLECTION
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* Secondary Button: White background with clean gray border */}
            <Link
              to="/combos"
              className="group px-10 py-5 bg-white text-zinc-900 border border-zinc-200 rounded-full text-sm font-bold tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-3"
            >
              VIEW OUTFITS
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------
          EVERYTHING BELOW THIS LINE IS 100% YOUR ORIGINAL UI CODE
          --------------------------------------------------------- */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto mb-32">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-3 text-zinc-500 mb-4 font-bold tracking-widest text-xs uppercase">
              <Sparkles className="w-4 h-4" /> Discover
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-text">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-bold tracking-widest text-text hover:text-zinc-500 transition-colors uppercase"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {categories.map((cat, idx) => (
            <motion.div key={cat} variants={fadeUp}>
              <Link
                to={`/shop?category=${cat}`}
                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden block bg-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-zinc-100"
              >
                <img
                  src={`https://images.unsplash.com/photo-${['1596755094514-f87e34085b2c', '1624378439575-d8705ad7ae80', '1542272454315-4c01d7abdf4a', '1556821840-3a63f95609a7'][idx]}?auto=format&fit=crop&q=80&w=800`}
                  alt={cat}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity group-hover:opacity-90"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{cat}</h3>
                  <span className="text-xs font-bold tracking-widest text-white/70 uppercase group-hover:text-white transition-colors">
                    Explore <ArrowRight className="w-3 h-3 inline-block ml-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto mb-32">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12 px-2 md:px-8"
        >
          <div>
            <div className="flex items-center gap-3 text-zinc-500 mb-4 font-bold tracking-widest text-xs uppercase">
              <TrendingUp className="w-4 h-4" /> Trending
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-text">
              Best Picks This Week
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-bold tracking-widest text-text hover:text-zinc-500 transition-colors uppercase"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-2 md:px-8"
        >
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={fadeUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto mb-20 bg-zinc-900 rounded-[3rem] py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-16 px-4"
          >
            <span className="mb-6 px-6 py-2 rounded-capsule bg-white/10 text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/10">
              Style Guide
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
              Complete The Look
            </h2>
            <p className="text-lg text-zinc-400 font-medium max-w-2xl text-balance">
              Hand-picked, fully styled outfits. Shop the entire look across multiple platforms with a single click.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 md:px-12"
          >
            {featuredCombos.map((combo) => (
              <motion.div key={combo.id} variants={fadeUp}>
                <ComboCard combo={combo} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-16 text-center">
            <Link
              to="/combos"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-text rounded-capsule text-sm font-bold tracking-widest hover:bg-zinc-100 transition-all shadow-xl group"
            >
              EXPLORE ALL OUTFITS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
