import React from 'react';
import './HomeShop.css';

const HomeShop = () => {
  const packages = [
    {
      img: '../webimg/product6.jpg',
      title: 'Basic Mehndi Package',
      description:
        'Traditional designs perfect for small gatherings and casual events.',
      price: '$75',
    },
    {
      img: '../webimg/1.jpg',
      title: 'Premium Mehndi Service',
      description:
        'Elaborate designs ideal for bridal ceremonies and special occasions.',
      price: '$150',
    },
    {
      img: '../webimg/product1.jpg',
      title: 'Custom Design Package',
      description:
        'Customized patterns tailored to your preferences and style.',
      price: '$200',
    },
    {
      img: '../webimg/product2.webp',
      title: 'Traditional Designs',
      description:
        'Traditional henna patterns from various cultures and traditions.',
      price: '$50',
    },
    {
      img: '../webimg/product5.jpg',
      title: 'Henna Cone Packaging',
      description: 'Premium quality henna cones for professional application.',
      price: '$200',
    },
    {
      img: '../webimg/product4.webp',
      title: 'Traditional Henna Stencils',
      description:
        'Reusable stencils for creating perfect traditional patterns.',
      price: '$75',
    },
  ];

  const products = [
    {
      img: '../webimg/product1.jpg',
      title: 'The Cone',
      price: '$29.99',
    },
    {
      img: '../webimg/product2.webp',
      title: 'The Powder',
      price: '$19.99',
    },
    {
      img: '../webimg/product3.png',
      title: 'Bridal Aftercare Guide',
      price: '$8.99',
    },
    {
      img: '../webimg/product5.jpg',
      title: 'Essential Kit',
      price: '$49.99',
    },
  ];

  return (
    <>
      <section id="shop">
        <div className="container">
          <div className="section-title">
            <h2>Our Services</h2>
            <p>Explore our premium mehndi services and products</p>
          </div>

          <div className="shop-section">
            {packages.map((pkg, index) => (
              <div className="package-card" key={index}>
                <div className="package-image">
                  <img src={pkg.img} alt={pkg.title} />
                </div>
                <div className="package-content">
                  <h3 className="package-title">{pkg.title}</h3>
                  <p className="package-description">{pkg.description}</p>
                  <p className="package-price">{pkg.price}</p>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services">
        <div className="container">
          <div className="section-title">
            <h2>Featured Products</h2>
            <p>High-quality henna products for professional and home use</p>
          </div>

          <div className="product-grid">
            {products.map((product, index) => (
              <div className="product-card" key={index}>
                <div className="product-image">
                  <img src={product.img} alt={product.title} />
                </div>
                <div className="product-info">
                  <p className="product-title">{product.title}</p>
                  <p className="product-price">{product.price}</p>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeShop;
