import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { productsService } from '@/lib/firebase/products';
import { useImageUpload } from '@/hooks/useImageUpload';
import toast from 'react-hot-toast';

export default function AddProduct() {
  const navigate = useNavigate();
  const { uploadMultiple, uploading } = useImageUpload();

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
    sizes: [] as string[],
    colors: [] as string[],
    inStock: true,
    featured: false,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles([...selectedFiles, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    try {
      toast.loading('Uploading images...');

      // Upload images to Cloudinary
      const uploadedImages = await uploadMultiple(selectedFiles, 'products');

      if (uploadedImages.length === 0) {
        toast.dismiss();
        toast.error('Failed to upload images');
        return;
      }

      toast.dismiss();
      toast.loading('Creating product...');

      // Calculate discount
      const price = parseFloat(formData.price);
      const originalPrice = parseFloat(formData.originalPrice) || price;
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

      // Create product
      const productId = await productsService.addProduct({
        title: formData.title,
        description: formData.description,
        price,
        originalPrice,
        discount,
        category: formData.category as any,
        priceRange: formData.priceRange as any,
        platform: formData.platform as any,
        affiliateLink: formData.affiliateLink,
        images: uploadedImages,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        sizes: formData.sizes,
        colors: formData.colors,
        inStock: formData.inStock,
        featured: formData.featured,
      });

      toast.dismiss();

      if (productId) {
        toast.success('Product created successfully!');
        navigate('/admin/products');
      } else {
        toast.error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.dismiss();
      toast.error('Error creating product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black">Add New Product</h1>
          <p className="text-gray-600 mt-1">Fill in the product details below</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="e.g., Classic White Shirt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Product description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="899"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="1499"
              />
            </div>
          </div>
        </div>

        {/* Category & Classification */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Category & Classification</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range *
              </label>
              <select
                required
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="under-1000">Under ₹1,000</option>
                <option value="under-1500">Under ₹1,500</option>
                <option value="under-2000">Under ₹2,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform *
              </label>
              <select
                required
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Affiliate Link *
            </label>
            <input
              type="url"
              required
              value={formData.affiliateLink}
              onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="https://amazon.in/..."
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Product Images *</h2>

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
              <p className="text-sm font-medium text-gray-700">Click to upload images</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 10MB</p>
            </label>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Additional Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (1-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Reviews
              </label>
              <input
                type="number"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Sizes (comma separated)
            </label>
            <input
              type="text"
              placeholder="S, M, L, XL"
              onChange={(e) =>
                setFormData({ ...formData, sizes: e.target.value.split(',').map((s) => s.trim()) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Colors (comma separated)
            </label>
            <input
              type="text"
              placeholder="Black, White, Blue"
              onChange={(e) =>
                setFormData({ ...formData, colors: e.target.value.split(',').map((c) => c.trim()) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
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
            disabled={uploading}
            className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
