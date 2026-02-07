import './CategoryNav.css';

export type Category = 'kebab' | 'burger' | 'chick-n-snack' | 'dessert' | 'tres-speciaux' | 'boisson';

interface CategoryNavProps {
  activeCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'TOUS' },
  { id: 'kebab', label: 'FAMILLE KEBAB' },
  { id: 'burger', label: 'NOS BURGERS' },
  { id: 'chick-n-snack', label: 'CHIC\'N\'SNACK' },
  { id: 'dessert', label: 'NOS DESSERTS' },
  { id: 'tres-speciaux', label: 'TRÈS SPECIAUX' },
  { id: 'boisson', label: 'BOISSONS' },
];

export const CategoryNav = ({ activeCategory, onCategoryChange }: CategoryNavProps) => {
  return (
    <nav className="category-nav">
      <div className="category-nav-container">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={`category-nav-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
