import React, { useEffect, useState } from 'react'
import { useGalleryNavigation } from '../../hooks/useGalleryNavigation'
import './GalleryHero.css'

const HeroSection = () => {
  const { activeSection, scrollToSection } = useGalleryNavigation()
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const categories = [
    { id: 'illustration-infusion', label: 'Creative' },
    { id: 'bridal-blooms', label: 'Portrait' },
    { id: 'bridal-bliss', label: 'Bridal' },
    { id: 'featured-collections', label: 'Featured' },
  ]

  return (
    <section className="gallery-hero" id="home">
      <div 
        className="hero-parallax-bg"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      ></div>
      
      <div className="floating-elements">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
        <div className="floating-element element-4"></div>
      </div>

      <div className={`gallery-hero-content ${isVisible ? 'visible' : ''}`}>
        <div className="hero-badge text-reveal">
          <span>Premium Collection</span>
        </div>
        
        <h1 className="animate-title">
          <span className="text-reveal main-title">Discover Beautiful</span>
          <span className="text-reveal delay-1 sub-title">Mehendi Designs</span>
        </h1>
        
        <p className="hero-description text-reveal delay-2">
          Explore our exquisite collection of traditional and modern mehendi patterns
          <br />
          <span className="description-accent">Crafted with love and precision</span>
        </p>
        
        <div className="categories text-reveal delay-3">
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              className={`${activeSection === cat.id ? 'active' : ''} category-button`}
              style={{ animationDelay: `${1.2 + index * 0.15}s` }}
              onClick={() => scrollToSection(cat.id)}
            >
              <span className="button-icon">{cat.icon}</span>
              <span className="button-text">{cat.label}</span>
              <div className="button-glow"></div>
            </button>
          ))}
        </div>

        
      </div>
    </section>
  )
}

export default HeroSection