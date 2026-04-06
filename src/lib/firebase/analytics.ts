import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './config';
import { ClickAnalytics } from './schema';

const analyticsCollection = collection(db, 'analytics');

export const analyticsService = {
  // Track affiliate click
  async trackClick(
    productId: string,
    productTitle: string,
    platform: string,
    userId: string | null = null
  ): Promise<boolean> {
    try {
      await addDoc(analyticsCollection, {
        productId,
        productTitle,
        platform,
        userId,
        timestamp: serverTimestamp(),
        userAgent:
          typeof window !== 'undefined' ? navigator.userAgent : null,
        referrer: typeof window !== 'undefined' ? document.referrer : null,
      });
      return true;
    } catch (error) {
      console.error('Error tracking click:', error);
      return false;
    }
  },

  // Get clicks by product
  async getClicksByProduct(productId: string): Promise<number> {
    try {
      const q = query(analyticsCollection, where('productId', '==', productId));
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting clicks by product:', error);
      return 0;
    }
  },

  // Get clicks by platform
  async getClicksByPlatform(platform: string): Promise<number> {
    try {
      const q = query(analyticsCollection, where('platform', '==', platform));
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting clicks by platform:', error);
      return 0;
    }
  },

  // Get clicks by date range
  async getClicksByDateRange(startDate: Date, endDate: Date) {
    try {
      const q = query(
        analyticsCollection,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate)),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ClickAnalytics[];
    } catch (error) {
      console.error('Error getting clicks by date range:', error);
      return [];
    }
  },

  // Get total clicks
  async getTotalClicks(): Promise<number> {
    try {
      const snapshot = await getDocs(analyticsCollection);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting total clicks:', error);
      return 0;
    }
  },

  // Get recent clicks
  async getRecentClicks(limitCount: number = 50): Promise<ClickAnalytics[]> {
    try {
      const q = query(
        analyticsCollection,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ClickAnalytics[];
    } catch (error) {
      console.error('Error getting recent clicks:', error);
      return [];
    }
  },

  // Get top clicked products
  async getTopClickedProducts(limitCount: number = 10) {
    try {
      const snapshot = await getDocs(analyticsCollection);
      const clicksByProduct: { [key: string]: { count: number; title: string } } = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (clicksByProduct[data.productId]) {
          clicksByProduct[data.productId].count++;
        } else {
          clicksByProduct[data.productId] = {
            count: 1,
            title: data.productTitle,
          };
        }
      });

      return Object.entries(clicksByProduct)
        .map(([productId, data]) => ({
          productId,
          title: data.title,
          clicks: data.count,
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error getting top clicked products:', error);
      return [];
    }
  },

  // Get platform statistics
  async getPlatformStatistics() {
    try {
      const snapshot = await getDocs(analyticsCollection);
      const platforms: { [key: string]: number } = {
        amazon: 0,
        flipkart: 0,
        myntra: 0,
        ajio: 0,
      };

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (platforms[data.platform] !== undefined) {
          platforms[data.platform]++;
        }
      });

      return platforms;
    } catch (error) {
      console.error('Error getting platform statistics:', error);
      return { amazon: 0, flipkart: 0, myntra: 0, ajio: 0 };
    }
  },

  // Get clicks today
  async getClicksToday(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const q = query(
        analyticsCollection,
        where('timestamp', '>=', Timestamp.fromDate(today))
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting clicks today:', error);
      return 0;
    }
  },

  // Get clicks this week
  async getClicksThisWeek(): Promise<number> {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const q = query(
        analyticsCollection,
        where('timestamp', '>=', Timestamp.fromDate(weekAgo))
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting clicks this week:', error);
      return 0;
    }
  },

  // Get clicks this month
  async getClicksThisMonth(): Promise<number> {
    try {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      
      const q = query(
        analyticsCollection,
        where('timestamp', '>=', Timestamp.fromDate(monthAgo))
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting clicks this month:', error);
      return 0;
    }
  },
};
