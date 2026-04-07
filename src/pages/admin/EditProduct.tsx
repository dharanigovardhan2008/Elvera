import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsService } from '@/lib/firebase/products';
import { useImageUpload } from '@/hooks/useImageUpload';

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { uploadMultiple, uploading, error } = useImageUpload();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'shirts',
    priceRange: 'under-1000',
    platform: 'amazon',
    affiliateLink: '',
    rating: '4.5',
    reviews: '0',
    sizes: '',
    colors: '',
    inStock: true,
    featured: false,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string; publicId: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        const product = await productsService.getProductById(id);

        if (!product) {
          toast.error('Product not found');
          navigate('/admin/products');
          return;
        }

        setFormData({
          title: product.title || '',
          description: product.description || '',
          price: String(product.price || ''),
          originalPrice: String(product.originalPrice || ''),
          category: product.category || 'shirts',
          priceRange: product.priceRange || 'under-1000',
          platform: product.platform || 'amazon',
          affiliateLink: product.affiliateLink || '',
          rating: String(product.rating || 4.5),
          reviews: String(product.reviews || 0),
          sizes: product.sizes?.join(', ') || '',
          colors: product.colors?.join(', ') || '',
          inStock: product.inStock ?? true,
          featured: product.featured ?? false,
        });

        setExistingImages(product.images || []);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getPriceRange = (price: number) => {
    if (price <= 1000) return 'under-1000';
    if (price <= 1500) return 'under-1500';
    return 'under-2000';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.title || !formData.description || !formData.price || !formData.affiliateLink) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);

      let uploadedImages: { url: string; publicId: string }[] = [];

      if (selectedFiles.length > 0) {
        toast.loading('Uploading new images...', { id: 'edit-product' });
        uploadedImages = await uploadMultiple(selectedFiles, 'products');
      }

      const allImages = [...existingImages, ...uploadedImages];

      if (allImages.length === 0) {
        toast.error('At least one image is required', { id: 'edit-product' });
        setSaving(false);
        return;
      }

      toast.loading('Updating product...', { id: 'edit-product' });

      const price = parseFloat(formData.price);
      const originalPrice = formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : price;

      const discount =
        originalPrice > price
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : 0;

      const success = await productsService.updateProduct(id, {
        title: formData.title,
        description: formData.description,
        price,
        originalPrice,
        discount,
        category: formData.category as any,
        priceRange: getPriceRange(price) as any,
        platform: formData.platform as any,
        affiliateLink: formData.affiliateLink,
        images: allImages,
        rating: parseFloat(formData.rating) || 4.5,
        reviews: parseInt(formData.reviews) || 0,
        sizes: formData.sizes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        colors: formData.colors
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
        inStock: formData.inStock,
        featured: formData.featured,
      });

      if (success) {
        toast.success('Product updated successfully!', { id: 'edit-product' });
        navigate('/admin/products');
      } else {
        toast.error('Failed to update product', { id: 'edit-product' });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product', { id: 'edit-product' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-3xl p-10 text-center text-zinc-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product details</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Category & Classification</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="shirts">Shirts</option>
                <option value="pants">Pants</option>
                <option value="jeans">Jeans</option>
                <option value="trousers">Trousers</option>
                <option value="hoodies">Hoodies</option>
                <option value="oversized-tshirts">Oversized T-Shirts</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="under-1000">Under ₹1,000</option>
                <option value="under-1500">Under ₹1,500</option>
                <option value="under-2000">Under ₹2,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
              <select
                name="platform"
                required
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="amazon">Amazon</option>
                <option value="flipkart">Flipkart</option>
                <option value="myntra">Myntra</option>
                <option value="ajio">Ajio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate Link *</label>
            <input
              type="url"
              name="affiliateLink"
              required
              value={formData.affiliateLink}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Existing Images</h2>

          {existingImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={image.url} alt={`Existing ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No existing images.</p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upload New Images</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700">Click to upload new images</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 10MB</p>
            </label>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Additional Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Reviews</label>
              <input
                type="number"
                name="reviews"
                value={formData.reviews}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              placeholder="S, M, L, XL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              placeholder="Black, White, Blue"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={uploading || saving}
            className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading || saving ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
