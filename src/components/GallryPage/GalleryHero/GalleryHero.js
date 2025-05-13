import React, { useEffect, useState } from 'react'
import { useGalleryNavigation } from '../../hooks/useGalleryNavigation'
import './GalleryHero.css'

const HeroSection = () => {
  const { activeSection, scrollToSection } = useGalleryNavigation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100) // Small delay to ensure proper mounting

    return () => {
      clearTimeout(timer)
      setIsVisible(false)
    }
  }, [])

  return (
    <section className="gallery-hero" id="home">
      <div className={`gallery-hero-content ${isVisible ? 'visible' : ''}`}>
        <h1 className="animate-title">
          <span className="text-reveal">Discover Beautiful</span>
          <span className="text-reveal delay-1">Mehendi Designs</span>
        </h1>
        <p className="text-reveal delay-2">
          Explore our collection of traditional and modern mehendi patterns
        </p>
        <div className="categories text-reveal delay-3">
          <button
            className={
              activeSection === 'illustration-infusion' ? 'active' : ''
            }
            onClick={() => scrollToSection('illustration-infusion')}
          >
            Bridal
          </button>
          <button
            className={activeSection === 'bridal-blooms' ? 'active' : ''}
            onClick={() => scrollToSection('bridal-blooms')}
          >
            Portrait
          </button>
          <button
            className={activeSection === 'bridal-bliss' ? 'active' : ''}
            onClick={() => scrollToSection('bridal-bliss')}
          >
            Creative
          </button>
          <button
            className={activeSection === 'featured-collections' ? 'active' : ''}
            onClick={() => scrollToSection('featured-collections')}
          >
            Featured
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
