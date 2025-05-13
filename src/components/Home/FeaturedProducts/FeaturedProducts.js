import React, { useEffect } from 'react'
import { useCart } from '../../../context/CartContext'
import { toast } from 'react-toastify'
import './FeaturedProducts.css'

const FeaturedProducts = () => {
  const { addToCart } = useCart()

  const products = [
    {
      id: 1,
      title: 'The Cone',
      price: 29.99,
      image: '/webimg/product1.jpg',
      alt: 'The Cone',
    },
    {
      id: 2,
      title: 'The Powder',
      price: 19.99,
      image: '/webimg/product2.webp',
    },
    {
      id: 3,
      title: 'Bridal Aftercare Guide',
      price: 8.99,
      image: '/webimg/product3.png',
    },
    {
      id: 4,
      title: 'Essential Kit',
      price: 49.99,
      image: '/webimg/product5.jpg',
      alt: 'Essential Kit',
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

    document.querySelectorAll('.product-card').forEach((card) => {
      observer.observe(card)
    })

    return () => {
      document.querySelectorAll('.product-card').forEach((card) => {
        observer.unobserve(card)
      })
    }
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success(`${product.name} added to cart`)
  }

  const handleProductView = (product) => {
    handleAddToCart(product)
    toast.success(`${product.title} added to cart`)
  }

  return (
    <section id="services">
      <div className="container">
        <div className="section-title">
          <h2>Featured Products</h2>
          <p>High-quality henna products for professional and home use</p>
        </div>

        <div className="product-grid">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="product-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="product-image">
                <img src={product.image} alt={product.alt} loading="lazy" />
              </div>
              <div className="product-info">
                <p className="product-title">{product.title}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button
                  className="add-to-cart"
                  onClick={() => handleProductView(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
