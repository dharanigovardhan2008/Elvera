import { useState, useEffect } from 'react';
import { productsService } from '@/lib/firebase/products';
import { Product, ProductFilters } from '@/lib/firebase/schema';

export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let fetchedProducts: Product[];

      if (filters) {
        fetchedProducts = await productsService.filterProducts(filters);
      } else {
        fetchedProducts = await productsService.getAllProducts();
      }

      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refreshProducts,
  };
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await productsService.getProductById(productId);
        setProduct(fetchedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
  };
};

export const useFeaturedProducts = (limit: number = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await productsService.getFeaturedProducts(limit);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { products, loading };
};

export const useLatestProducts = (limit: number = 12) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await productsService.getLatestProducts(limit);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching latest products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, [limit]);

  return { products, loading };
};

export const useProductSearch = () => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const search = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setSearchTerm(term);
      const searchResults = await productsService.searchProducts(term);
      setResults(searchResults);
    } catch (err) {
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setSearchTerm('');
  };

  return {
    results,
    loading,
    searchTerm,
    search,
    clearSearch,
  };
};
