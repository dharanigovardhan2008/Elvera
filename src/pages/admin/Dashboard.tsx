import { useEffect, useState } from 'react';
import { productsService } from '@/lib/firebase/products';
import { combosService } from '@/lib/firebase/combos';
import { analyticsService } from '@/lib/firebase/analytics';

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [products, combos, clicks] = await Promise.all([
          productsService.getAllProducts(),
          combosService.getAllCombos(),
          analyticsService.getTotalClicks(),
        ]);

        setProductCount(products.length);
        setComboCount(combos.length);
        setClickCount(clicks);
      } catch (error) {
        console.error(error);
      }
    };

    loadStats();
  }, []);

  const cards = [
    { label: 'Total Products', value: productCount },
    { label: 'Total Combos', value: comboCount },
    { label: 'Total Clicks', value: clickCount },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-text">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Overview of your ELVERA store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-zinc-200 rounded-3xl p-6"
          >
            <p className="text-sm text-zinc-500">{card.label}</p>
            <h2 className="text-4xl font-bold text-text mt-3">{card.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
