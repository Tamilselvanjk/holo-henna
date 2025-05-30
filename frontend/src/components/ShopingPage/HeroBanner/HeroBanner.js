import React from 'react';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="container">
        <h1>Premium Henna Products</h1>
        <p>
          Discover our collection of high-quality henna supplies for your
          artistic needs
        </p>
        <a href="#products-container" className="shop-now-btn">
          Shop Now
        </a>
      </div>
    </div>
  );
};

export default HeroBanner;
