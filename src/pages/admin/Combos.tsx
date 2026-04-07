import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function AdminCombos() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text">Combos</h1>
          <p className="text-zinc-500 mt-1">Manage outfit combo collections</p>
        </div>

        <button
          className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-2xl font-medium hover:bg-zinc-800 transition-colors"
          disabled
        >
          <Plus className="w-4 h-4" />
          Add Combo
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl p-10 text-center">
        <p className="text-zinc-500">Combo management panel coming next.</p>
      </div>
    </div>
  );
}
