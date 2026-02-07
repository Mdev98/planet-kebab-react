import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import './HomePage.css';

export const HomePage = () => {
  return (
    <Layout className="home-page">
      <div className="home-page-logo">
        Planet Kebab
      </div>

      <h1 className="home-page-title">Où êtes-vous ?</h1>

      <div className="home-page-countries">
        <Link to="/store-location?country_code=SN" className="home-page-country-link">
          <div className="home-page-country-flag">
            {/* Placeholder for Senegal flag - replace with actual image */}
            🇸🇳
          </div>
          <h2 className="home-page-country-name">Sénégal</h2>
        </Link>

        <Link to="/store-location?country_code=CI" className="home-page-country-link">
          <div className="home-page-country-flag">
            {/* Placeholder for Cote d'Ivoire flag - replace with actual image */}
            🇨🇮
          </div>
          <h2 className="home-page-country-name">Côte d'Ivoire</h2>
        </Link>
      </div>
    </Layout>
  );
};
