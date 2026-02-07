import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { SupplementsResponse, Supplement } from '../types';

export const useSupplements = () => {
  const [pains, setPains] = useState<Supplement[]>([]);
  const [frites, setFrites] = useState<Supplement[]>([]);
  const [sauces, setSauces] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<SupplementsResponse>('/public/supplements/');
      setPains(response.data.pains || []);
      setFrites(response.data.frites || []);
      setSauces(response.data.sauces || []);
    } catch (err) {
      setError('Erreur lors du chargement des suppléments');
      console.error('Error fetching supplements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplements();
  }, []);

  return { pains, frites, sauces, loading, error, fetchSupplements };
};
