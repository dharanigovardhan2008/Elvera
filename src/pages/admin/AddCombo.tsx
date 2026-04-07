import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { combosService } from '@/lib/firebase/combos';
import { useImageUpload } from '@/hooks/useImageUpload';

export default function AddCombo() {
  const navigate = useNavigate();
  const { uploadMultiple, uploading, error } = useImageUpload();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalPrice: '',
    originalPrice: '',
    priceRange: 'under-1500',
    featured: false,
    item1Name: '',
    item1Type: 'shirt',
    item1Price: '',
    item2Name: '',
    item2Type: 'pant',
    item2Price: '',
    item3Name: '',
    item3Type: 'shoes',
    item3Price: '',
    platform1: 'amazon',
    link1: '',
    platform2: 'myntra',
    link2: '',
    platform3: 'flipkart',
    link3: '',
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

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

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.totalPrice) {
      toast.error('Please fill all required fields');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please upload at least one combo image');
      return;
    }

    try {
      setSaving(true);
      toast.loading('Uploading images...', { id: 'add-combo' });

      const uploadedImages = await uploadMultiple(selectedFiles, 'combos');

      if (!uploadedImages.length) {
        toast.error('Failed to upload images', { id: 'add-combo' });
        setSaving(false);
        return;
      }

      toast.loading('Creating combo...', { id: 'add-combo' });

      const items = [
        formData.item1Name
          ? {
              productId: '',
              type: formData.item1Type,
              name: formData.item1Name,
              image: '',
              price: Number(formData.item1Price || 0),
            }
          : null,
        formData.item2Name
          ? {
              productId: '',
              type: formData.item2Type,
              name: formData.item2Name,
              image: '',
              price: Number(formData.item2Price || 0),
            }
          : null,
        formData.item3Name
          ? {
              productId: '',
              type: formData.item3Type,
              name: formData.item3Name,
              image: '',
              price: Number(formData.item3Price || 0),
            }
          : null,
      ].filter(Boolean) as any[];

      const platforms = [
        formData.link1 ? { platform: formData.platform1, link: formData.link1 } : null,
        formData.link2 ? { platform: formData.platform2, link: formData.link2 } : null,
        formData.link3 ? { platform: formData.platform3, link: formData.link3 } : null,
      ].filter(Boolean) as any[];

      const comboId = await combosService.addCombo({
        name: formData.name,
        description: formData.description,
        items,
        totalPrice: Number(formData.totalPrice),
        originalPrice: Number(formData.originalPrice || formData.totalPrice),
        discount:
          Number(formData.originalPrice || formData.totalPrice) > Number(formData.totalPrice)
            ? Math.round(
                ((Number(formData.originalPrice || formData.totalPrice) -
                  Number(formData.totalPrice)) /
                  Number(formData.originalPrice || formData.totalPrice)) *
                  100
              )
            : 0,
        priceRange: formData.priceRange as any,
        images: uploadedImages,
        platforms,
        featured: formData.featured,
      });

      if (comboId) {
        toast.success('Combo created successfully!', { id: 'add-combo' });
        navigate('/admin/combos');
      } else {
        toast.error('Failed to create combo', { id: 'add-combo' });
      }
    } catch (error) {
      console.error('Error creating combo:', error);
      toast.error('Error creating combo', { id: 'add-combo' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/combos')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black">Add New Combo</h1>
          <p className="text-gray-600 mt-1">Create a complete outfit combo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Info</h2>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Combo name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Combo description"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleChange}
              placeholder="Total price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              placeholder="Original price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="under-1500">Under ₹1,500</option>
              <option value="under-2000">Under ₹2,000</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            <span className="text-sm font-medium">Featured Combo</span>
          </label>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Combo Items</h2>

          {[1, 2, 3].map((num) => (
            <div key={num} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name={`item${num}Name`}
                value={(formData as any)[`item${num}Name`]}
                onChange={handleChange}
                placeholder={`Item ${num} name`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <select
                name={`item${num}Type`}
                value={(formData as any)[`item${num}Type`]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="shirt">Shirt</option>
                <option value="pant">Pant</option>
                <option value="shoes">Shoes</option>
                <option value="hoodie">Hoodie</option>
              </select>
              <input
                type="number"
                name={`item${num}Price`}
                value={(formData as any)[`item${num}Price`]}
                onChange={handleChange}
                placeholder={`Item ${num} price`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Platform Links</h2>

          {[1, 2, 3].map((num) => (
            <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name={`platform${num}`}
                value={(formData as any)[`platform${num}`]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="amazon">Amazon</option>
                <option value="flipkart">Flipkart</option>
                <option value="myntra">Myntra</option>
                <option value="ajio">Ajio</option>
              </select>
              <input
                type="url"
                name={`link${num}`}
                value={(formData as any)[`link${num}`]}
                onChange={handleChange}
                placeholder={`Platform ${num} link`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Combo Images</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="combo-image-upload"
            />
            <label htmlFor="combo-image-upload" className="flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700">Click to upload combo images</p>
            </label>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
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

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/combos')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={uploading || saving}
            className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading || saving ? 'Saving...' : 'Create Combo'}
          </button>
        </div>
      </form>
    </div>
  );
}
