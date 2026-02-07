import { useCartStore } from '../../stores/cartStore';
import './CartIcon.css';

interface CartIconProps {
  onClick: () => void;
}

export const CartIcon = ({ onClick }: CartIconProps) => {
  const itemsCount = useCartStore((state) => state.getItemsCount());

  return (
    <div className="cart-icon" onClick={onClick}>
      {/* Placeholder icon - replace with actual icon from assets */}
      <div 
        className="cart-icon-image"
        style={{
          width: '30px',
          height: '30px',
          border: '2px solid var(--color-dark)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem'
        }}
      >
        🛒
      </div>
      {itemsCount > 0 && (
        <span className="cart-icon-badge">{itemsCount}</span>
      )}
    </div>
  );
};
