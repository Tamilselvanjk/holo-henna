import React from 'react';
import './HeroBanner.css';

const HeroBanner = () => {
  const handleShopClick = (e) => {
    e.preventDefault();
    const productsSection = document.getElementById('products-container');
    
    if (productsSection) {
      // Add highlight animation class before scrolling
      productsSection.classList.add('highlight-animate');
      
      // Smooth scroll with offset
      productsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      
      // Remove highlight animation class after transition
      setTimeout(() => {
        productsSection.classList.remove('highlight-animate');
      }, 2000);
    }
  };

  return (
    <div className="hero-banner">
      <div className="container">
        <h1>Premium Henna Products</h1>
        <p>
          Discover our collection of high-quality henna supplies for your
          artistic needs
        </p>
        <button onClick={handleShopClick} className="shop-now-btn">
          <span>Shop Now</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
