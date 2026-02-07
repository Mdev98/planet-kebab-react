import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import type { StoresResponse, Store } from '../types';

interface UseStoresOptions {
  countryCode?: string;
  autoFetch?: boolean;
}

export const useStores = (options: UseStoresOptions = {}) => {
  const { countryCode, autoFetch = true } = options;
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async (code?: string) => {
    const country = code || countryCode;
    if (!country) {
      setError('Code pays requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<StoresResponse>(
        `/public/stores/?country_code=${country}&brand=PlaneteKebab`
      );
      setStores(response.data.data);
    } catch (err) {
      setError('Erreur lors du chargement des magasins');
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  }, [countryCode]);

  useEffect(() => {
    if (autoFetch && countryCode) {
      fetchStores();
    }
  }, [countryCode, autoFetch, fetchStores]);

  return { stores, loading, error, fetchStores };
};

export const useStoreInfo = (storeId?: number) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStore = useCallback(async (id?: number) => {
    const targetId = id || storeId;
    if (!targetId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<Store>(`/public/stores/${targetId}`);
      setStore(response.data);
    } catch (err) {
      setError('Erreur lors du chargement du magasin');
      console.error('Error fetching store:', err);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    if (storeId) {
      fetchStore();
    }
  }, [storeId, fetchStore]);

  return { store, loading, error, fetchStore };
};
