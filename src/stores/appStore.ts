import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from '../types';

const STORAGE_KEY = 'planet-kebab-app-store';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      storeId: null,
      countryCode: null,
      countryId: null,
      setStoreId: (id) => set({ storeId: id }),
      setCountryCode: (code) => set({ countryCode: code }),
      setCountryId: (id) => set({ countryId: id }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        storeId: state.storeId,
        countryCode: state.countryCode,
        countryId: state.countryId,
      }),
    }
  )
);
