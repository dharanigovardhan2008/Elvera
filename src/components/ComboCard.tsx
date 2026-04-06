import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function ComboCard({ combo }: { combo: any }) {
  const [expanded, setExpanded] = useState(false);
  const { trackClick } = useAppContext();

  const handleBuy = (item: any) => {
    trackClick(item.id, item.platform);
    window.open(item.affiliateLink, '_blank');
  };

  return (
    <motion.div 
      layout
      className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300"
    >
      <div className="relative aspect-[3/4] md:aspect-video w-full overflow-hidden group">
        <img 
          src={combo.imageUrl} 
          alt={combo.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-4 py-1.5 rounded-capsule bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase border border-white/20">
              {combo.type}
            </span>
            <span className="px-4 py-1.5 rounded-capsule bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase border border-white/20">
              {combo.styleTag}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2 tracking-wide">{combo.name}</h2>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-white">₹{combo.totalPrice.toLocaleString('en-IN')}</p>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 backdrop-blur-lg px-6 py-3 rounded-capsule font-bold text-sm tracking-wide transition-colors border border-white/10"
            >
              {expanded ? 'HIDE ITEMS' : 'VIEW OUTFIT'} {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-100"
          >
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <h3 className="font-serif text-xl font-bold text-text">Outfit Items ({combo.items.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {combo.items.map((item: any, idx: number) => (
                  <motion.div 
                    key={item.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-row md:flex-col gap-4 bg-zinc-50 p-4 rounded-[1.5rem] border border-zinc-100 hover:border-zinc-300 transition-colors group"
                  >
                    <div className="w-24 md:w-full aspect-square rounded-[1rem] overflow-hidden shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col flex-1 justify-between gap-3">
                      <div>
                        <span className="inline-block px-3 py-1 bg-white border border-zinc-200 text-[10px] font-bold tracking-wider uppercase rounded-capsule mb-2">
                          {item.platform}
                        </span>
                        <h4 className="font-medium text-sm text-text line-clamp-2">{item.title}</h4>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-bold text-text">₹{item.price.toLocaleString('en-IN')}</span>
                        <button 
                          onClick={() => handleBuy(item)}
                          className="w-8 h-8 rounded-full bg-text text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
