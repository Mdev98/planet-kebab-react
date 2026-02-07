import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { StoreLocationPage } from './pages/StoreLocationPage/StoreLocationPage';
import { ProductsPage } from './pages/ProductsPage/ProductsPage';
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/store-location" element={<StoreLocationPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
