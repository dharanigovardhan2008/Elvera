import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Combo } from './schema';

const combosCollection = collection(db, 'combos');

export const combosService = {
  // Get all combos
  async getAllCombos(): Promise<Combo[]> {
    try {
      const snapshot = await getDocs(combosCollection);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Combo[];
    } catch (error) {
      console.error('Error getting combos:', error);
      return [];
    }
  },

  // Get combo by ID
  async getComboById(id: string): Promise<Combo | null> {
    try {
      const docRef = doc(db, 'combos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Combo;
      }
      return null;
    } catch (error) {
      console.error('Error getting combo:', error);
      return null;
    }
  },

  // Get combos by price range
  async getCombosByPriceRange(priceRange: string): Promise<Combo[]> {
    try {
      const q = query(combosCollection, where('priceRange', '==', priceRange));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Combo[];
    } catch (error) {
      console.error('Error getting combos by price range:', error);
      return [];
    }
  },

  // Get featured combos
  async getFeaturedCombos(limitCount: number = 6): Promise<Combo[]> {
    try {
      const q = query(
        combosCollection,
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Combo[];
    } catch (error) {
      console.error('Error getting featured combos:', error);
      return [];
    }
  },

  // Get latest combos
  async getLatestCombos(limitCount: number = 8): Promise<Combo[]> {
    try {
      const q = query(
        combosCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Combo[];
    } catch (error) {
      console.error('Error getting latest combos:', error);
      return [];
    }
  },

  // Add combo (Admin only)
  async addCombo(
    combo: Omit<Combo, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string | null> {
    try {
      const docRef = await addDoc(combosCollection, {
        ...combo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding combo:', error);
      return null;
    }
  },

  // Update combo (Admin only)
  async updateCombo(id: string, updates: Partial<Combo>): Promise<boolean> {
    try {
      const docRef = doc(db, 'combos', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating combo:', error);
      return false;
    }
  },

  // Delete combo (Admin only)
  async deleteCombo(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'combos', id));
      return true;
    } catch (error) {
      console.error('Error deleting combo:', error);
      return false;
    }
  },

  // Get combos count
  async getCombosCount(): Promise<number> {
    try {
      const snapshot = await getDocs(combosCollection);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting combos count:', error);
      return 0;
    }
  },
};
