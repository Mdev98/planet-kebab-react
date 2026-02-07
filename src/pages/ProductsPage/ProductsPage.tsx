import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { CategoryNav } from '../../components/CategoryNav/CategoryNav';
import type { Category } from '../../components/CategoryNav/CategoryNav';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { ProductModal } from '../../components/ProductModal/ProductModal';
import { OrderModal } from '../../components/OrderModal/OrderModal';
import { useProducts } from '../../hooks/useProducts';
import { useAppStore } from '../../stores/appStore';
import type { Product } from '../../types';
import './ProductsPage.css';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeIdParam = searchParams.get('store');
  
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  
  const storeId = useAppStore((state) => state.storeId);
  const setStoreId = useAppStore((state) => state.setStoreId);
  
  const { products, loading, error } = useProducts({ 
    storeId: storeId || undefined,
    autoFetch: !!storeId
  });

  useEffect(() => {
    if (storeIdParam) {
      const id = parseInt(storeIdParam, 10);
      if (id !== storeId) {
        setStoreId(id);
      }
    } else if (!storeId) {
      navigate('/');
    }
  }, [storeIdParam, storeId, setStoreId, navigate]);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter((p) => p.category === activeCategory);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  const handleCartClick = () => {
    setShowCart(true);
  };

  const handleCloseCartModal = () => {
    setShowCart(false);
  };

  if (!storeId) {
    return null;
  }

  return (
    <div className="products-page">
      <Header 
        showCart={true} 
        onCartClick={handleCartClick}
        serviceHours="Service de 11h à 23h"
      />
      
      <CategoryNav 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {loading && (
        <div className="products-page-loading">
          Chargement des produits...
        </div>
      )}

      {error && (
        <div className="products-page-error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="products-page-content">
          {filteredProducts.length === 0 ? (
            <div className="products-page-empty">
              <div className="products-page-empty-icon">🍔</div>
              <p className="products-page-empty-text">
                Aucun produit disponible dans cette catégorie
              </p>
            </div>
          ) : (
            <div className="products-page-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="products-page-footer">
        <div className="products-page-footer-content">
          <h3 className="products-page-footer-title">Contactez-nous</h3>
          <div className="products-page-footer-socials">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="products-page-footer-social"
            >
              Facebook
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="products-page-footer-social"
            >
              Instagram
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="products-page-footer-social"
            >
              Twitter
            </a>
          </div>
          <p className="products-page-footer-copyright">
            © 2024 Planet Kebab. Tous droits réservés.
          </p>
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={handleCloseProductModal}
        />
      )}

      {showCart && (
        <OrderModal onClose={handleCloseCartModal} />
      )}
    </div>
  );
};
