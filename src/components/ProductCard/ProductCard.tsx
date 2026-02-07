import type { Product } from '../../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const isAvailable = product.is_available !== false;

  const handleClick = () => {
    if (isAvailable) {
      onClick(product);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} FCFA`;
  };

  return (
    <div 
      className={`product-card ${!isAvailable ? 'unavailable' : ''}`}
      onClick={handleClick}
    >
      <div className="product-card-image-wrapper">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="product-card-image"
            loading="lazy"
          />
        ) : (
          <div className="product-card-image" style={{ backgroundColor: '#f0f0f0' }} />
        )}
        {!isAvailable && (
          <div className="product-card-unavailable-badge">Indisponible</div>
        )}
        {isAvailable && (
          <div className="product-card-add-icon">+</div>
        )}
      </div>
      <div className="product-card-content">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">{formatPrice(product.price_cents)}</p>
      </div>
    </div>
  );
};
