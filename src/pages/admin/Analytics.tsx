import { useEffect, useState } from 'react';
import { analyticsService } from '@/lib/firebase/analytics';

export default function AdminAnalytics() {
  const [totalClicks, setTotalClicks] = useState(0);
  const [amazonClicks, setAmazonClicks] = useState(0);
  const [flipkartClicks, setFlipkartClicks] = useState(0);
  const [myntraClicks, setMyntraClicks] = useState(0);
  const [ajioClicks, setAjioClicks] = useState(0);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [total, amazon, flipkart, myntra, ajio] = await Promise.all([
          analyticsService.getTotalClicks(),
          analyticsService.getClicksByPlatform('amazon'),
          analyticsService.getClicksByPlatform('flipkart'),
          analyticsService.getClicksByPlatform('myntra'),
          analyticsService.getClicksByPlatform('ajio'),
        ]);

        setTotalClicks(total);
        setAmazonClicks(amazon);
        setFlipkartClicks(flipkart);
        setMyntraClicks(myntra);
        setAjioClicks(ajio);
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

      <div className="bg-white border border-zinc-200 rounded-3xl p-8">
        <h3 className="text-lg font-semibold text-text mb-4">Performance Summary</h3>
        <p className="text-zinc-500 text-sm leading-7">
          This section shows the click distribution across affiliate platforms.
          More detailed charts and daily/weekly/monthly breakdowns can be added next.
        </p>
      </div>
    </div>
  );
}
