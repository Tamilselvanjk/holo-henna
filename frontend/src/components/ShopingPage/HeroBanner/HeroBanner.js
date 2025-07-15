import React, { useEffect, useRef } from 'react';
import './HeroBanner.css';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const HeroBanner = () => {
  const heroRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Add parallax effect on scroll
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.pageYOffset;
        heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShopClick = (e) => {
    e.preventDefault();
    const productsSection = document.getElementById('products-container');
    if (productsSection) {
      productsSection.classList.add('highlight-animate');
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        productsSection.classList.remove('highlight-animate');
      }, 2000);
    }
  };

  return (
    <div className="hero-banner" ref={heroRef}>
      <div className="hero-overlay"></div>
      <div className="hero-particles"></div>
      
      <div className="container">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-title"
        >
          Premium Henna Products
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="hero-subtitle"
        >
          Discover our collection of high-quality henna supplies for your
          artistic needs
        </motion.p>
        
        <motion.button 
          ref={buttonRef}
          onClick={handleShopClick}
          className="shop-now-btn"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Shop Now</span>
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ 
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut"
            }}
          >
            <FaArrowRight />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
};

export default HeroBanner;