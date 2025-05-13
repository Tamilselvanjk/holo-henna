import React from 'react';
import { useShop } from '../../../context/ShopContext';

import './Categories.css';

const categories = [
  'All Products',
  'Bridal Henna',
  'Traditional',
  'Arabic',
  'Modern',
  'Floral',
  'Custom Designs'
];

const Categories = () => {
  const { activeCategory, setActiveCategory, setSearchTerm } = useShop();

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchTerm(''); // Clear search when changing categories
  };

  return (
    <div className="categories-section">
      <h2>Categories</h2>
      <div className="categories-list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;