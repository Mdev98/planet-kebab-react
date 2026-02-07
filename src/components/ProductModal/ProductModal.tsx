import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { useSupplements } from '../../hooks/useSupplements';
import './ProductModal.css';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

// Categories that allow supplements
const SUPPLEMENT_CATEGORIES = ['kebab', 'burger', 'chick-n-snack', 'tres-speciaux'];

export const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedPain, setSelectedPain] = useState<string>('');
  const [selectedFrites, setSelectedFrites] = useState<string>('');
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  
  const addItem = useCartStore((state) => state.addItem);
  const { pains, frites, sauces } = useSupplements();
  
  const showSupplements = SUPPLEMENT_CATEGORIES.includes(product.category);

  useEffect(() => {
    // Set default selections
    if (showSupplements && pains.length > 0 && !selectedPain) {
      // Use a microtask to avoid setting state during render
      Promise.resolve().then(() => {
        setSelectedPain(pains[0].name);
      });
    }
  }, [pains, showSupplements, selectedPain]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleSauceToggle = (sauce: string) => {
    if (selectedSauces.includes(sauce)) {
      setSelectedSauces(selectedSauces.filter((s) => s !== sauce));
    } else {
      setSelectedSauces([...selectedSauces, sauce]);
    }
  };

  const calculateSupplementsPrice = (): number => {
    let total = 0;
    
    if (showSupplements) {
      // Add frites price if selected
      if (selectedFrites) {
        const fritesItem = frites.find((f) => f.name === selectedFrites);
        if (fritesItem?.price_cents) {
          total += fritesItem.price_cents;
        }
      }
    }
    
    return total;
  };

  const handleSubmit = () => {
    const supplementsPrice = calculateSupplementsPrice();
    
    addItem(
      product,
      quantity,
      {
        pain: showSupplements ? selectedPain : undefined,
        frites: showSupplements ? selectedFrites : undefined,
        sauces: showSupplements && selectedSauces.length > 0 ? selectedSauces : undefined,
      },
      supplementsPrice
    );
    
    onClose();
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} FCFA`;
  };

  const totalPrice = (product.price_cents + calculateSupplementsPrice()) * quantity;

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="product-modal-header">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="product-modal-image"
            />
          ) : (
            <div className="product-modal-image" style={{ backgroundColor: '#f0f0f0' }} />
          )}
          <button className="product-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="product-modal-body">
          <h2 className="product-modal-title">{product.name}</h2>
          <p className="product-modal-price">{formatPrice(product.price_cents)}</p>

          {product.description && (
            <div className="product-modal-section">
              <p style={{ margin: 0, color: 'var(--color-dark)' }}>{product.description}</p>
            </div>
          )}

          <div className="product-modal-section">
            <h3 className="product-modal-section-title">Quantité</h3>
            <div className="product-modal-quantity">
              <button
                className="product-modal-quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="product-modal-quantity-value">{quantity}</span>
              <button
                className="product-modal-quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
              >
                +
              </button>
            </div>
          </div>

          {showSupplements && (
            <>
              {pains.length > 0 && (
                <div className="product-modal-section">
                  <h3 className="product-modal-section-title">Pain</h3>
                  <div className="product-modal-radio-group">
                    {pains.map((pain) => (
                      <div key={pain.name} className="product-modal-radio-item">
                        <input
                          type="radio"
                          id={`pain-${pain.name}`}
                          name="pain"
                          value={pain.name}
                          checked={selectedPain === pain.name}
                          onChange={(e) => setSelectedPain(e.target.value)}
                        />
                        <label htmlFor={`pain-${pain.name}`}>{pain.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {frites.length > 0 && (
                <div className="product-modal-section">
                  <h3 className="product-modal-section-title">Frites</h3>
                  <div className="product-modal-radio-group">
                    <div className="product-modal-radio-item">
                      <input
                        type="radio"
                        id="frites-none"
                        name="frites"
                        value=""
                        checked={selectedFrites === ''}
                        onChange={(e) => setSelectedFrites(e.target.value)}
                      />
                      <label htmlFor="frites-none">Sans frites</label>
                    </div>
                    {frites.map((frite) => (
                      <div key={frite.name} className="product-modal-radio-item">
                        <input
                          type="radio"
                          id={`frites-${frite.name}`}
                          name="frites"
                          value={frite.name}
                          checked={selectedFrites === frite.name}
                          onChange={(e) => setSelectedFrites(e.target.value)}
                        />
                        <label htmlFor={`frites-${frite.name}`}>
                          {frite.name}
                          {frite.price_cents && frite.price_cents > 0 && (
                            <span> (+{formatPrice(frite.price_cents)})</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sauces.length > 0 && (
                <div className="product-modal-section">
                  <h3 className="product-modal-section-title">Sauces</h3>
                  <div className="product-modal-checkbox-group">
                    {sauces.map((sauce) => (
                      <div key={sauce.name} className="product-modal-checkbox-item">
                        <input
                          type="checkbox"
                          id={`sauce-${sauce.name}`}
                          checked={selectedSauces.includes(sauce.name)}
                          onChange={() => handleSauceToggle(sauce.name)}
                        />
                        <label htmlFor={`sauce-${sauce.name}`}>{sauce.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <button className="product-modal-submit" onClick={handleSubmit}>
            Commander - {formatPrice(totalPrice)}
          </button>
        </div>
      </div>
    </div>
  );
};
