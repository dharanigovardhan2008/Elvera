import { useState, useEffect } from 'react';
import { combosService } from '@/lib/firebase/combos';
import { Combo } from '@/lib/firebase/schema';

export const useCombos = (priceRange?: string) => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCombos();
  }, [priceRange]);

  const fetchCombos = async () => {
    try {
      setLoading(true);
      setError(null);

      let fetchedCombos: Combo[];

      if (priceRange) {
        fetchedCombos = await combosService.getCombosByPriceRange(priceRange);
      } else {
        fetchedCombos = await combosService.getAllCombos();
      }

      setCombos(fetchedCombos);
    } catch (err) {
      console.error('Error fetching combos:', err);
      setError('Failed to load combos');
    } finally {
      setLoading(false);
    }
  };

  const refreshCombos = () => {
    fetchCombos();
  };

  return {
    combos,
    loading,
    error,
    refreshCombos,
  };
};

export const useCombo = (comboId: string) => {
  const [combo, setCombo] = useState<Combo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!comboId) return;

    const fetchCombo = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCombo = await combosService.getComboById(comboId);
        setCombo(fetchedCombo);
      } catch (err) {
        console.error('Error fetching combo:', err);
        setError('Failed to load combo');
      } finally {
        setLoading(false);
      }
    };

    fetchCombo();
  }, [comboId]);

  return {
    combo,
    loading,
    error,
  };
};

export const useFeaturedCombos = (limit: number = 6) => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const fetchedCombos = await combosService.getFeaturedCombos(limit);
        setCombos(fetchedCombos);
      } catch (err) {
        console.error('Error fetching featured combos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { combos, loading };
};

export const useLatestCombos = (limit: number = 8) => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const fetchedCombos = await combosService.getLatestCombos(limit);
        setCombos(fetchedCombos);
      } catch (err) {
        console.error('Error fetching latest combos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, [limit]);

  return { combos, loading };
};
