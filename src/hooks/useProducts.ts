import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import type { ProductsResponse, Product } from '../types';

interface UseProductsOptions {
  storeId?: number;
  autoFetch?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { storeId, autoFetch = true } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (id?: number) => {
    const targetId = id || storeId;
    if (!targetId) {
      setError('ID du magasin requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<ProductsResponse>(
        `/public/products/?per_page=50&store_id=${targetId}`
      );
      setProducts(response.data.data);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    if (autoFetch && storeId) {
      fetchProducts();
    }
  }, [storeId, autoFetch, fetchProducts]);

  return { products, loading, error, fetchProducts };
};
