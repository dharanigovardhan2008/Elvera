import { useState } from 'react';
import { seedProducts } from '@/utils/seedProducts';
import { useAuthContext } from '@/context/AuthContext';

export default function SeedData() {
  const { user, isAdmin } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setMessage('Adding products to Firebase...');
    
    try {
      await seedProducts();
      setMessage('✅ Products added successfully! Check Firestore.');
    } catch (error) {
      setMessage('❌ Error adding products. Check console.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to access this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Seed Database</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <p className="text-sm text-yellow-800 mb-4">
            ⚠️ This will add sample products to your Firebase Firestore database.
            Only run this once!
          </p>
        </div>

        <button
          onClick={handleSeed}
          disabled={loading}
          className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding Products...' : 'Add Sample Products to Firebase'}
        </button>

        {message && (
          <div className="mt-6 p-4 bg-white border border-zinc-200 rounded-xl">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
