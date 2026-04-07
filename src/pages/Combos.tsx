import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ComboCard from '../components/ComboCard';
import { combosService } from '@/lib/firebase/combos';

export default function Combos() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCombos = async () => {
      try {
        const data = await combosService.getAllCombos();

        const formatted = data.map((combo: any) => ({
          ...combo,
          imageUrl: combo.images?.[0]?.url || '',
        }));

        setCombos(formatted);
      } catch (error) {
        console.error('Error loading combos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCombos();
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto bg-zinc-50 rounded-b-[4rem]"
    >
      <div className="flex flex-col items-center text-center mb-20 max-w-3xl mx-auto">
        <span className="mb-6 px-6 py-2 rounded-capsule bg-zinc-200/50 backdrop-blur-md text-zinc-600 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 shadow-sm border border-zinc-200">
          <Sparkles className="w-3.5 h-3.5" /> Curated Outfits
        </span>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-text mb-6 tracking-tight leading-tight">
          Complete The Look
        </h1>
        <p className="text-xl text-zinc-500 font-medium leading-relaxed">
          Shop fully styled, cohesive outfits created by our fashion experts.
          Buy the pieces individually across our partner platforms.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading combos...</div>
      ) : combos.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">No combos found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
          {combos.map((combo, idx) => (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <ComboCard combo={combo} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.main>
  );
}
