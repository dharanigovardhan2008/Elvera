import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { combosService } from '@/lib/firebase/combos';

interface ComboItem {
  id: string;
  name: string;
  description?: string;
  totalPrice: number;
  originalPrice?: number;
  images?: { url: string; publicId: string }[];
  featured?: boolean;
  priceRange?: string;
}

export default function AdminCombos() {
  const [combos, setCombos] = useState<ComboItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCombos = async () => {
    try {
      setLoading(true);
      const data = await combosService.getAllCombos();
      setCombos(data as ComboItem[]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load combos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCombos();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Are you sure you want to delete this combo?');
    if (!ok) return;

    try {
      const success = await combosService.deleteCombo(id);
      if (success) {
        toast.success('Combo deleted');
        await loadCombos();
      } else {
        toast.error('Failed to delete combo');
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
          <h1 className="text-3xl font-serif font-bold text-text">Combos</h1>
          <p className="text-zinc-500 mt-1">Manage complete outfit combinations</p>
        </div>

        <Link
          to="/admin/combos/add"
          className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-2xl font-medium hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Combo
        </Link>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-zinc-500">Loading combos...</div>
        ) : combos.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-zinc-500 mb-4">No combos added yet</p>
            <Link
              to="/admin/combos/add"
              className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-2xl font-medium hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Combo
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="w-full md:w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0">
                  {combo.images?.[0]?.url ? (
                    <img
                      src={combo.images[0].url}
                      alt={combo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text truncate">{combo.name}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2">{combo.description}</p>

                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                      ₹{combo.totalPrice}
                    </span>
                    {combo.priceRange ? (
                      <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 capitalize">
                        {combo.priceRange}
                      </span>
                    ) : null}
                    {combo.featured ? (
                      <span className="px-3 py-1 rounded-full bg-black text-white">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(combo.id)}
                    className="p-3 rounded-2xl border border-zinc-200 hover:bg-red-50 text-red-600"
                    title="Delete combo"
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
