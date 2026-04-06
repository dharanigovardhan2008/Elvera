import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { PRODUCTS } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, Settings, LogOut, Activity } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout, favorites, bag, clicks } = useAppContext();
  const [activeTab, setActiveTab] = useState('favorites');

  if (!user) return <Navigate to="/login" replace />;

  const favoriteProducts = PRODUCTS.filter(p => favorites.includes(p.id));
  const bagProducts = PRODUCTS.filter(p => bag.includes(p.id));

  return (
    <motion.main 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-12"
    >
      {/* Sidebar */}
      <aside className="w-full md:w-80 shrink-0 flex flex-col gap-6 bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-[0_20px_60px_rgb(0,0,0,0.04)] self-start sticky top-32">
        <div className="flex flex-col items-center text-center pb-8 border-b border-zinc-100">
          <div className="w-24 h-24 bg-zinc-100 rounded-full mb-4 flex items-center justify-center text-4xl font-serif text-zinc-400 border border-zinc-200 shadow-inner">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-xl font-serif font-bold text-text mb-1">{user.name}</h2>
          <p className="text-sm font-medium text-zinc-500">{user.email}</p>
        </div>

        <nav className="flex flex-col gap-3 py-4">
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-4 px-6 py-4 rounded-capsule text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'favorites' ? 'bg-text text-white shadow-lg shadow-black/10' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            <Heart className="w-4 h-4" /> Saved Items
          </button>
          <button 
            onClick={() => setActiveTab('bag')}
            className={`flex items-center gap-4 px-6 py-4 rounded-capsule text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'bag' ? 'bg-text text-white shadow-lg shadow-black/10' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            <ShoppingBag className="w-4 h-4" /> My Bag
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-4 px-6 py-4 rounded-capsule text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'history' ? 'bg-text text-white shadow-lg shadow-black/10' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            <Activity className="w-4 h-4" /> Click History
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-4 px-6 py-4 rounded-capsule text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'settings' ? 'bg-text text-white shadow-lg shadow-black/10' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </nav>

        <button 
          onClick={logout}
          className="mt-auto flex items-center justify-center gap-3 px-6 py-4 bg-red-50 text-red-600 rounded-capsule text-sm font-bold tracking-widest uppercase hover:bg-red-100 transition-colors border border-red-100"
        >
          <LogOut className="w-4 h-4" /> LOG OUT
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-zinc-200 shadow-[0_20px_60px_rgb(0,0,0,0.04)] p-8 md:p-12 min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'favorites' && (
            <motion.div key="fav" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-text mb-2">Saved Items</h3>
                  <p className="text-zinc-500 font-medium tracking-wide">You have {favoriteProducts.length} items saved</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {favoriteProducts.length === 0 && (
                <div className="py-20 text-center text-zinc-400 font-medium">Your favorites list is empty.</div>
              )}
            </motion.div>
          )}

          {activeTab === 'bag' && (
            <motion.div key="bag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-text mb-2">Shopping Bag</h3>
                  <p className="text-zinc-500 font-medium tracking-wide">You have {bagProducts.length} items in your bag</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bagProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {bagProducts.length === 0 && (
                <div className="py-20 text-center text-zinc-400 font-medium">Your shopping bag is empty.</div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="hist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="text-3xl font-serif font-bold text-text mb-8">Click History</h3>
              <div className="bg-zinc-50 rounded-[2rem] border border-zinc-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-zinc-100 border-b border-zinc-200">
                    <tr>
                      <th className="px-8 py-5 text-xs font-bold text-zinc-500 tracking-widest uppercase">Product ID</th>
                      <th className="px-8 py-5 text-xs font-bold text-zinc-500 tracking-widest uppercase">Platform</th>
                      <th className="px-8 py-5 text-xs font-bold text-zinc-500 tracking-widest uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clicks.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-10 text-center text-zinc-400 font-medium">No clicks recorded yet.</td>
                      </tr>
                    ) : (
                      clicks.map((click, i) => (
                        <tr key={i} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-100/50 transition-colors">
                          <td className="px-8 py-5 text-sm font-medium text-text">{click.productId}</td>
                          <td className="px-8 py-5 text-sm font-bold text-zinc-600"><span className="px-3 py-1 bg-white border border-zinc-200 rounded-capsule shadow-sm">{click.platform}</span></td>
                          <td className="px-8 py-5 text-sm font-medium text-zinc-400">{new Date(click.timestamp).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="set" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="text-3xl font-serif font-bold text-text mb-8">Profile Settings</h3>
              <div className="max-w-xl space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Full Name</label>
                  <input type="text" defaultValue={user.name} className="w-full bg-zinc-50 border border-zinc-200 rounded-capsule px-6 py-4 text-sm font-medium text-text outline-none focus:border-zinc-500 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Email Address</label>
                  <input type="email" defaultValue={user.email} readOnly className="w-full bg-zinc-100 border border-zinc-200 rounded-capsule px-6 py-4 text-sm font-medium text-zinc-400 outline-none cursor-not-allowed" />
                </div>
                <button className="px-8 py-4 bg-text text-white rounded-capsule text-sm font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10 hover:-translate-y-0.5 mt-4">
                  SAVE CHANGES
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
