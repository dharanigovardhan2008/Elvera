import { useState } from 'react';
import { seedDatabase } from '@/utils/seedDatabase';
import { useAuthContext } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function SeedData() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await seedDatabase(user.email!, user.uid);
      setResult(res);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-gradient-to-br from-zinc-50 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-zinc-200">
          <h1 className="text-4xl font-serif font-bold mb-4 text-text">
            🌱 Seed Database
          </h1>
          <p className="text-zinc-600 mb-8">
            This will automatically create all collections and add sample data to your Firebase Firestore.
          </p>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8">
            <h2 className="font-bold text-yellow-900 mb-2">⚠️ Important</h2>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>This will create: <strong>6 products</strong>, <strong>2 combos</strong>, and make you an <strong>admin</strong></li>
              <li>Run this <strong>only once</strong></li>
              <li>If you already have data, this will add duplicates</li>
              <li>You must be <strong>logged in</strong> to run this</li>
            </ul>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold mb-3">What will be created:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                <span><strong>products</strong> collection (6 items)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <span><strong>combos</strong> collection (2 items)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <span><strong>admins</strong> collection (you)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <span><strong>analytics</strong> collection (sample)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg
                       hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            {loading ? '🌱 Seeding Database...' : '🚀 Seed Database Now'}
          </button>

          {result && (
            <div className={`mt-6 p-6 rounded-2xl border-2 ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              {result.success ? (
                <>
                  <h3 className="font-bold text-green-900 text-xl mb-3">
                    ✅ Success!
                  </h3>
                  <p className="text-green-800 mb-4">
                    Database seeded successfully!
                  </p>
                  <div className="space-y-2 text-sm text-green-900">
                    <p>✅ Created <strong>{result.productCount} products</strong></p>
                    <p>✅ Created <strong>{result.comboCount} combos</strong></p>
                    <p>✅ Added you as <strong>admin</strong></p>
                    <p>✅ Created sample analytics</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-green-200">
                    <p className="font-bold text-green-900 mb-2">Next Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
                      <li>Go to <strong>/shop</strong> to see products</li>
                      <li>Click heart icon to add to favorites</li>
                      <li>Go to <strong>/favorites</strong> to see them</li>
                      <li>Check Firebase Console to verify data</li>
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-red-900 text-xl mb-3">
                    ❌ Error
                  </h3>
                  <p className="text-red-800 mb-2">Failed to seed database.</p>
                  <p className="text-sm text-red-700">
                    {result.error?.message || 'Unknown error'}
                  </p>
                  <p className="text-xs text-red-600 mt-4">
                    Check browser console for details.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
