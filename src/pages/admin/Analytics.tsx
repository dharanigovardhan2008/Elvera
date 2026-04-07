import { useEffect, useState } from 'react';
import { analyticsService } from '@/lib/firebase/analytics';

interface RecentClick {
  id: string;
  productId: string;
  productTitle: string;
  platform: string;
  userId?: string | null;
  timestamp?: any;
}

export default function AdminAnalytics() {
  const [totalClicks, setTotalClicks] = useState(0);
  const [amazonClicks, setAmazonClicks] = useState(0);
  const [flipkartClicks, setFlipkartClicks] = useState(0);
  const [myntraClicks, setMyntraClicks] = useState(0);
  const [ajioClicks, setAjioClicks] = useState(0);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentClicks, setRecentClicks] = useState<RecentClick[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [
          total,
          amazon,
          flipkart,
          myntra,
          ajio,
          top,
          recent,
        ] = await Promise.all([
          analyticsService.getTotalClicks(),
          analyticsService.getClicksByPlatform('amazon'),
          analyticsService.getClicksByPlatform('flipkart'),
          analyticsService.getClicksByPlatform('myntra'),
          analyticsService.getClicksByPlatform('ajio'),
          analyticsService.getTopClickedProducts(5),
          analyticsService.getRecentClicks(10),
        ]);

        setTotalClicks(total);
        setAmazonClicks(amazon);
        setFlipkartClicks(flipkart);
        setMyntraClicks(myntra);
        setAjioClicks(ajio);
        setTopProducts(top);
        setRecentClicks(recent as RecentClick[]);
      } catch (error) {
        console.error(error);
      }
    };

    loadAnalytics();
  }, []);

  const stats = [
    { label: 'Total Clicks', value: totalClicks },
    { label: 'Amazon Clicks', value: amazonClicks },
    { label: 'Flipkart Clicks', value: flipkartClicks },
    { label: 'Myntra Clicks', value: myntraClicks },
    { label: 'Ajio Clicks', value: ajioClicks },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-text">Analytics</h1>
        <p className="text-zinc-500 mt-1">Track affiliate click performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white border border-zinc-200 rounded-3xl p-6"
          >
            <p className="text-sm text-zinc-500">{item.label}</p>
            <h2 className="text-3xl font-bold text-text mt-3">{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-text mb-4">Top Clicked Products</h2>

          {topProducts.length === 0 ? (
            <p className="text-zinc-500 text-sm">No product click data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((item, index) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100"
                >
                  <div>
                    <p className="font-medium text-text">
                      {index + 1}. {item.title || item.productId}
                    </p>
                    <p className="text-sm text-zinc-500">Product ID: {item.productId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-text">{item.clicks}</p>
                    <p className="text-xs text-zinc-500">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-text mb-4">Recent Clicks</h2>

          {recentClicks.length === 0 ? (
            <p className="text-zinc-500 text-sm">No recent click data yet.</p>
          ) : (
            <div className="space-y-3">
              {recentClicks.map((click) => (
                <div
                  key={click.id}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100"
                >
                  <p className="font-medium text-text">{click.productTitle || click.productId}</p>
                  <div className="flex items-center justify-between mt-2 text-sm text-zinc-500">
                    <span className="capitalize">{click.platform}</span>
                    <span>
                      {click.timestamp?.toDate
                        ? click.timestamp.toDate().toLocaleString()
                        : 'Unknown time'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
