import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import type { CartItemSupplements } from '../../types';
import './OrderModal.css';

interface OrderModalProps {
  onClose: () => void;
}

export const OrderModal = ({ onClose }: OrderModalProps) => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const changeQty = useCartStore((state) => state.changeQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} FCFA`;
  };

  const formatSupplements = (supplements: CartItemSupplements) => {
    const parts: string[] = [];
    
    if (supplements.pain) {
      parts.push(`Pain: ${supplements.pain}`);
    }
    
    if (supplements.frites) {
      parts.push(`Frites: ${supplements.frites}`);
    }
    
    if (supplements.sauces && supplements.sauces.length > 0) {
      parts.push(`Sauces: ${supplements.sauces.join(', ')}`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : null;
  };

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-header">
          <h2 className="order-modal-title">Mon Panier</h2>
          <button className="order-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="order-modal-body">
          {items.length === 0 ? (
            <div className="order-modal-empty">
              <div className="order-modal-empty-icon">🛒</div>
              <p className="order-modal-empty-text">Votre panier est vide</p>
            </div>
          ) : (
            <div className="order-modal-items">
              {items.map((item, index) => (
                <div key={index} className="order-modal-item">
                  <div className="order-modal-item-info">
                    <h3 className="order-modal-item-name">{item.name}</h3>
                    {formatSupplements(item.supplements) && (
                      <p className="order-modal-item-supplements">
                        {formatSupplements(item.supplements)}
                      </p>
                    )}
                    <p className="order-modal-item-price">
                      {formatPrice(item.total_price)}
                    </p>
                  </div>
                  <div className="order-modal-item-actions">
                    <div className="order-modal-item-quantity">
                      <button
                        className="order-modal-item-qty-btn"
                        onClick={() => changeQty(index, -1)}
                      >
                        −
                      </button>
                      <span className="order-modal-item-qty-value">{item.quantity}</span>
                      <button
                        className="order-modal-item-qty-btn"
                        onClick={() => changeQty(index, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="order-modal-item-remove"
                      onClick={() => removeItem(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="order-modal-footer">
            <div className="order-modal-total">
              <span className="order-modal-total-label">Total</span>
              <span className="order-modal-total-value">
                {formatPrice(getSubtotal())}
              </span>
            </div>
            <button className="order-modal-submit" onClick={handleCheckout}>
              Valider
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
