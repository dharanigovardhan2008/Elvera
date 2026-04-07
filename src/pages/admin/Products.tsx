import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsService } from '@/lib/firebase/products';

interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  platform: string;
  affiliateLink: string;
  images?: { url: string; publicId: string }[];
  featured?: boolean;
  inStock?: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAllProducts();
      setProducts(data as ProductItem[]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Are you sure you want to delete this product?');
    if (!ok) return;

    try {
      const success = await productsService.deleteProduct(id);
      if (success) {
        toast.success('Product deleted');
        await loadProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error(error);
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text">Products</h1>
          <p className="text-zinc-500 mt-1">Manage all products listed on ELVERA</p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-2xl font-medium hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-zinc-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-zinc-500 mb-4">No products added yet</p>
            <Link
              to="/admin/products/add"
              className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-2xl font-medium hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="w-full md:w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text truncate">{product.title}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2">{product.description}</p>

                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 capitalize">
                      {product.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 capitalize">
                      {product.platform}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                      ₹{product.price}
                    </span>
                    {product.featured ? (
                      <span className="px-3 py-1 rounded-full bg-black text-white">
                        Featured
                      </span>
                    ) : null}
                    {product.inStock ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl border border-zinc-200 hover:bg-zinc-50"
                    title="Open affiliate link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="p-3 rounded-2xl border border-zinc-200 hover:bg-zinc-50"
                    title="Edit product"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-3 rounded-2xl border border-zinc-200 hover:bg-red-50 text-red-600"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
