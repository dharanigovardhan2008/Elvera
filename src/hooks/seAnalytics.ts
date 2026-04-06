import { useState, useEffect } from 'react';
import { analyticsService } from '@/lib/firebase/analytics';
import { useAuth } from './useAuth';

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackClick = async (
    productId: string,
    productTitle: string,
    platform: string
  ) => {
    try {
      await analyticsService.trackClick(
        productId,
        productTitle,
        platform,
        user?.uid || null
      );
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  return {
    trackClick,
  };
};

export const useAdminAnalytics = () => {
  const [totalClicks, setTotalClicks] = useState(0);
  const [clicksToday, setClicksToday] = useState(0);
  const [clicksThisWeek, setClicksThisWeek] = useState(0);
  const [clicksThisMonth, setClicksThisMonth] = useState(0);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const [total, today, week, month, products, platforms] = await Promise.all([
        analyticsService.getTotalClicks(),
        analyticsService.getClicksToday(),
        analyticsService.getClicksThisWeek(),
        analyticsService.getClicksThisMonth(),
        analyticsService.getTopClickedProducts(10),
        analyticsService.getPlatformStatistics(),
      ]);

      setTotalClicks(total);
      setClicksToday(today);
      setClicksThisWeek(week);
      setClicksThisMonth(month);
      setTopProducts(products);
      setPlatformStats(platforms);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  return {
    totalClicks,
    clicksToday,
    clicksThisWeek,
    clicksThisMonth,
    topProducts,
    platformStats,
    loading,
    refreshAnalytics,
  };
};
