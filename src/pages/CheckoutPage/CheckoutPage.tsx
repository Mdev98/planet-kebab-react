import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { useCartStore } from '../../stores/cartStore';
import { useAppStore } from '../../stores/appStore';
import { useDeliveryZones } from '../../hooks/useDeliveryZones';
import { validatePhone, formatPhoneWithPrefix } from '../../utils/phone';
import { generateIdempotencyKey } from '../../utils/idempotency';
import apiClient from '../../api/client';
import type { OrderPayload, CountryCode } from '../../types';
import './CheckoutPage.css';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryZoneId, setDeliveryZoneId] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const storeId = useAppStore((state) => state.storeId);
  const countryCode = useAppStore((state) => state.countryCode);
  
  const { deliveryZones, loading: zonesLoading } = useDeliveryZones({ 
    storeId: storeId || undefined,
    autoFetch: !!storeId
  });

  useEffect(() => {
    if (!storeId || items.length === 0) {
      navigate('/products');
    }
  }, [storeId, items.length, navigate]);

  const selectedZone = deliveryZones.find((z) => z.id === parseInt(deliveryZoneId, 10));
  const subtotal = getSubtotal();
  const deliveryFee = selectedZone?.delivery_fee_cents || 0;
  const total = subtotal + deliveryFee;

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (countryCode) {
      const phoneValidation = validatePhone(phone, countryCode as CountryCode);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error || 'Numéro invalide';
      }
    }

    if (!deliveryZoneId) {
      newErrors.deliveryZone = 'La zone de livraison est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !storeId || !countryCode) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const orderPayload: OrderPayload = {
        store_id: storeId,
        customer_name: name.trim(),
        customer_phone: formatPhoneWithPrefix(phone, countryCode as CountryCode),
        delivery_zone_id: parseInt(deliveryZoneId, 10),
        note: note.trim() || undefined,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          pain: item.supplements.pain,
          frites: item.supplements.frites,
          sauces: item.supplements.sauces,
        })),
      };

      const idempotencyKey = generateIdempotencyKey();

      await apiClient.post('/public/orders/', orderPayload, {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      });

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Order submission error:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setSubmitError(
        error.response?.data?.message || 
        'Une erreur est survenue lors de la commande. Veuillez réessayer.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToProducts = () => {
    navigate(`/products?store=${storeId}`);
  };

  const handleNewOrder = () => {
    navigate('/');
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} FCFA`;
  };

  if (!storeId) {
    return null;
  }

  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="checkout-page-content">
          <div className="checkout-page-success">
            <div className="checkout-page-success-icon">✅</div>
            <h2 className="checkout-page-success-title">Commande confirmée !</h2>
            <p className="checkout-page-success-text">
              Votre commande a été enregistrée avec succès. Vous recevrez un appel de confirmation dans quelques instants.
            </p>
            <button 
              className="checkout-page-success-button"
              onClick={handleNewOrder}
            >
              Nouvelle commande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header />
      
      <div className="checkout-page-content">
        <button className="checkout-page-back" onClick={handleBackToProducts}>
          ← Retour
        </button>

        <h1 className="checkout-page-title">Finaliser la commande</h1>

        {submitError && (
          <div className="checkout-page-error-message">
            <div className="checkout-page-error-icon">⚠️</div>
            <h3 className="checkout-page-error-title">Erreur</h3>
            <p className="checkout-page-error-text">{submitError}</p>
          </div>
        )}

        <div className="checkout-page-grid">
          <div className="checkout-page-section">
            <h2 className="checkout-page-section-title">Informations de livraison</h2>
            
            <form className="checkout-page-form" onSubmit={handleSubmit}>
              <div className="checkout-page-form-group">
                <label className="checkout-page-form-label" htmlFor="name">
                  Nom complet *
                </label>
                <input
                  id="name"
                  type="text"
                  className={`checkout-page-form-input ${errors.name ? 'error' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                />
                {errors.name && (
                  <p className="checkout-page-form-error">{errors.name}</p>
                )}
              </div>

              <div className="checkout-page-form-group">
                <label className="checkout-page-form-label" htmlFor="phone">
                  Numéro de téléphone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`checkout-page-form-input ${errors.phone ? 'error' : ''}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={countryCode === 'SN' ? '9 chiffres' : '10 chiffres'}
                />
                {errors.phone && (
                  <p className="checkout-page-form-error">{errors.phone}</p>
                )}
                {countryCode && !errors.phone && (
                  <p className="checkout-page-form-hint">
                    {countryCode === 'SN' ? 'Format: 9 chiffres (ex: 771234567)' : 'Format: 10 chiffres'}
                  </p>
                )}
              </div>

              <div className="checkout-page-form-group">
                <label className="checkout-page-form-label" htmlFor="deliveryZone">
                  Zone de livraison *
                </label>
                <select
                  id="deliveryZone"
                  className={`checkout-page-form-select ${errors.deliveryZone ? 'error' : ''}`}
                  value={deliveryZoneId}
                  onChange={(e) => setDeliveryZoneId(e.target.value)}
                  disabled={zonesLoading}
                >
                  <option value="">Sélectionnez une zone</option>
                  {deliveryZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} - {formatPrice(zone.delivery_fee_cents)}
                    </option>
                  ))}
                </select>
                {errors.deliveryZone && (
                  <p className="checkout-page-form-error">{errors.deliveryZone}</p>
                )}
              </div>

              <div className="checkout-page-form-group">
                <label className="checkout-page-form-label" htmlFor="note">
                  Note (optionnel)
                </label>
                <textarea
                  id="note"
                  className="checkout-page-form-textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Instructions spéciales pour votre commande"
                />
              </div>
            </form>
          </div>

          <div className="checkout-page-section">
            <h2 className="checkout-page-section-title">Résumé de la commande</h2>
            
            <div className="checkout-page-summary">
              <div className="checkout-page-summary-row">
                <span>Sous-total ({items.length} article{items.length > 1 ? 's' : ''})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {selectedZone && (
                <div className="checkout-page-summary-row">
                  <span>Frais de livraison</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
              )}
              
              <div className="checkout-page-summary-row total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="button"
              className="checkout-page-submit"
              onClick={handleSubmit}
              disabled={submitting || items.length === 0}
            >
              {submitting ? 'Envoi en cours...' : 'Confirmer la commande'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
