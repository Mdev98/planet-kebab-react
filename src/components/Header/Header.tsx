import { useNavigate } from 'react-router-dom';
import { CartIcon } from '../CartIcon/CartIcon';
import './Header.css';

interface HeaderProps {
  showCart?: boolean;
  onCartClick?: () => void;
  serviceHours?: string;
}

export const Header = ({ 
  showCart = false, 
  onCartClick,
  serviceHours = 'Service de 11h à 23h'
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div 
          className="header-logo"
          onClick={handleLogoClick}
          style={{
            /* Placeholder for logo */
            width: '150px',
            height: '50px',
            background: 'var(--color-primary)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-title)',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          Planet Kebab
        </div>

        {serviceHours && (
          <div className="header-info">
            <span className="header-hours">{serviceHours}</span>
          </div>
        )}

        <div className="header-actions">
          {showCart && onCartClick && (
            <CartIcon onClick={onCartClick} />
          )}
        </div>
      </div>
    </header>
  );
};
