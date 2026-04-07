import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsService } from '@/lib/firebase/products';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productsService.getAllProducts();

        const formatted = data.map((product: any) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          category:
            product.category?.charAt(0).toUpperCase() + product.category?.slice(1),
          price: product.price,
          platform:
            product.platform?.charAt(0).toUpperCase() + product.platform?.slice(1),
          affiliateLink: product.affiliateLink,
          imageUrl: product.images?.[0]?.url || '',
          rating: product.rating || 4.5,
          reviewCount: product.reviews || 0,
        }));

        setProducts(formatted);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (initialCategory !== activeCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = ['Shirts', 'Pants', 'Jeans', 'Trousers', 'Hoodies', 'Oversized-tshirts'];
  const platforms = ['Amazon', 'Flipkart', 'Myntra', 'Ajio'];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (platformFilter !== 'All') {
      result = result.filter((p) => p.platform === platformFilter);
    }

    if (priceFilter !== 'All') {
      if (priceFilter === 'Under ₹1000') result = result.filter((p) => p.price < 1000);
      else if (priceFilter === 'Under ₹2000') result = result.filter((p) => p.price < 2000);
      else if (priceFilter === 'Above ₹2000') result = result.filter((p) => p.price >= 2000);
    }

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'Top Rated') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [activeCategory, priceFilter, platformFilter, sortBy, products]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-text mb-4">
            {activeCategory === 'All' ? 'Complete Collection' : activeCategory}
          </h1>
          <p className="text-zinc-500 font-medium">Showing {filteredProducts.length} premium pieces</p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 rounded-capsule font-bold text-sm tracking-widest text-text hover:bg-zinc-200 transition-colors w-full md:w-auto"
        >
          <Filter className="w-4 h-4" /> FILTERS
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12 bg-white border border-zinc-200 rounded-[2rem] shadow-sm p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-xs tracking-widest text-zinc-400 uppercase">Category</h3>
                <div className="flex flex-col gap-2">
                  {['All', ...categories].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setSearchParams({ category: cat });
                      }}
                      className={`text-left text-sm font-medium transition-colors ${
                        activeCategory === cat ? 'text-text font-bold' : 'text-zinc-500 hover:text-text'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-xs tracking-widest text-zinc-400 uppercase">Price Range</h3>
                <div className="flex flex-col gap-2">
                  {['All', 'Under ₹1000', 'Under ₹2000', 'Above ₹2000'].map((price) => (
                    <button
                      key={price}
                      onClick={() => setPriceFilter(price)}
                      className={`text-left text-sm font-medium transition-colors ${
                        priceFilter === price ? 'text-text font-bold' : 'text-zinc-500 hover:text-text'
                      }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-xs tracking-widest text-zinc-400 uppercase">Platform</h3>
                <div className="flex flex-wrap gap-2">
                  {['All', ...platforms].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setPlatformFilter(platform)}
                      className={`px-4 py-2 rounded-capsule text-xs font-bold transition-all ${
                        platformFilter === platform
                          ? 'bg-text text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-xs tracking-widest text-zinc-400 uppercase">Sort By</h3>
                <div className="flex flex-col gap-2">
                  {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Top Rated'].map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`text-left text-sm font-medium transition-colors ${
                        sortBy === sort ? 'text-text font-bold' : 'text-zinc-500 hover:text-text'
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="py-32 text-center flex flex-col items-center">
          <Sparkles className="w-12 h-12 text-zinc-300 mb-6" />
          <h2 className="text-2xl font-serif font-bold text-text mb-2">No items found</h2>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">
            We couldn't find any products matching your current filters. Try adjusting your selections.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setPriceFilter('All');
              setPlatformFilter('All');
              setSortBy('Recommended');
            }}
            className="px-8 py-3 bg-text text-white rounded-capsule font-bold text-sm hover:bg-zinc-800 transition-colors"
          >
            CLEAR FILTERS
          </button>
        </div>
      )}
    </motion.main>
  );
}
