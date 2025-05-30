import React, { useState } from 'react'
import './Categories.css'

const categories = [
  'All Products',
  'Bridal Henna',
  'Traditional',
  'Arabic',
  'Modern',
  'Floral',
  'Custom Designs',
]

const Categories = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('All Products')

  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    if (onCategoryChange) {
      onCategoryChange(category)
    }
  }

  return (
    <div className="categories-section">
      <h2>Categories</h2>
      <div className="categories-list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              activeCategory === category ? 'active' : ''
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Categories
