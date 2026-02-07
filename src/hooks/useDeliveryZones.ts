import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { DeliveryZonesResponse, DeliveryZone } from '../types';

interface UseDeliveryZonesOptions {
  storeId?: number;
  autoFetch?: boolean;
}

export const useDeliveryZones = (options: UseDeliveryZonesOptions = {}) => {
  const { storeId, autoFetch = true } = options;
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveryZones = async (id?: number) => {
    const targetId = id || storeId;
    if (!targetId) {
      setError('ID du magasin requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<DeliveryZonesResponse>(
        `/public/stores/${targetId}/delivery-zones`
      );
      setDeliveryZones(response.data.delivery_zones);
    } catch (err) {
      setError('Erreur lors du chargement des zones de livraison');
      console.error('Error fetching delivery zones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && storeId) {
      fetchDeliveryZones();
    }
  }, [storeId, autoFetch]);

  return { deliveryZones, loading, error, fetchDeliveryZones };
};
