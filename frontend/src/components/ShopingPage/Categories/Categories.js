import React, { useState } from 'react'
import { categories } from '../../../constants/categories'
import './Categories.css'

const Categories = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('All Products')

  const handleCategoryClick = (category) => {
    setActiveCategory(category.name)
    onCategoryChange?.(category.value) // Pass null for "All Products"
  }

  return (
    <div className="categories-section">
      <h2>Categories</h2>
      <div className="categories-list">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${
              activeCategory === cat.name ? 'active' : ''
            }`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Categories
