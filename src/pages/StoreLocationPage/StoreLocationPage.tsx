import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { useStores } from '../../hooks/useStores';
import { useAppStore } from '../../stores/appStore';
import './StoreLocationPage.css';

export const StoreLocationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const countryCode = searchParams.get('country_code');
  
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  
  const setStoreId = useAppStore((state) => state.setStoreId);
  const setCountryCode = useAppStore((state) => state.setCountryCode);
  const setCountryId = useAppStore((state) => state.setCountryId);
  
  const { stores, loading, error } = useStores({ 
    countryCode: countryCode || undefined,
    autoFetch: !!countryCode
  });

  useEffect(() => {
    if (!countryCode) {
      navigate('/');
    } else {
      setCountryCode(countryCode);
    }
  }, [countryCode, navigate, setCountryCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStoreId) return;
    
    const storeIdNum = parseInt(selectedStoreId, 10);
    const selectedStore = stores.find((s) => s.id === storeIdNum);
    
    if (selectedStore) {
      setStoreId(storeIdNum);
      setCountryId(selectedStore.country_id);
      navigate(`/products?store=${storeIdNum}`);
    }
  };

  if (!countryCode) {
    return null;
  }

  return (
    <Layout className="store-location-page">
      <div className="store-location-content">
        <div className="store-location-logo">
          Planet Kebab
        </div>

        <h1 className="store-location-title">
          Ton kebab prêt pour la livraison !
        </h1>

        {loading && (
          <div className="store-location-loading">
            Chargement des magasins...
          </div>
        )}

        {error && (
          <div className="store-location-error">
            {error}
          </div>
        )}

        {!loading && !error && (
          <form className="store-location-form" onSubmit={handleSubmit}>
            <select
              className="store-location-select"
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
            >
              <option value="">Sélectionne ton magasin</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="store-location-button"
              disabled={!selectedStoreId}
            >
              Commander
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};
