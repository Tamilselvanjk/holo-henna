import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ShopSection.css'

const ShopSection = () => {
  const products = [
    {
      id: 1,
      title: 'Cones',
      description:
        'Traditional designs perfect for small gatherings and casual events.',
      price: '₹75',
      image: '/webimg/product4.webp',
      alt: 'Basic Mehndi Design',
    },
    {
      id: 2,
      title: 'Bridal Mehndi Kit',
      description:
        'Elaborate designs ideal for bridal ceremonies and special occasions.',
      price: '₹150',
      image: '/webimg/product1.jpg',
      alt: 'Premium Mehndi Design',
    },
    {
      id: 3,
      title: 'Henna Powder',
      description:
        'Customized patterns tailored to your preferences and style.',
      price: '₹200',
      image: '/webimg/product2.webp',
      alt: 'Custom Mehndi Design',
    },
    {
      id: 4,
      title: 'Stecils',
      description:
        'Traditional henna patterns from various cultures and traditions.',
      price: '₹50',
      image: '/webimg/product3.png', 
      alt: 'Cultural or Traditional Designs',
    },
    {
      id: 5,
      title: 'Henna Cone Packaging',
      description: 'Premium quality henna cones for professional application.',
      price: '₹200',
      image: '/webimg/product5.jpg',
      alt: 'Henna Cone Packaging',
    },
    {
      id: 6,
      title: 'Traditional Henna Stencils',
      description:
        'Reusable stencils for creating perfect traditional patterns.',
      price: '₹75',
      image: '/webimg/product6.jpg',
      alt: 'Traditional Henna Stencils',
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.package-card').forEach((card) => {
      observer.observe(card)
    })

    return () => {
      document.querySelectorAll('.package-card').forEach((card) => {
        observer.unobserve(card)
      })
    }
  }, [])

  const handleAddToCart = () => {
    // Add your cart logic here
    alert('Item added to cart!')
  }

  return (
    <section id="shop" className="shop-contain">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>Explore and purchase our premium mehndi services</p>
        </div>

        <div className="shop-section">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="package-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="package-image">
                <img src={product.image} alt={product.alt} loading="lazy" />
                <div className="package-overlay">
                  <Link to="/shop" className="view-in-shop">
                    View in Shop
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
              <div className="package-content">
                <h3 className="package-title">{product.title}</h3>
                <p className="package-description">{product.description}</p>
                <div className="price-action">
                  <p className="package-price">{product.price}</p>
                  <Link to="/shop" className="buy-now-btn">
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopSection
