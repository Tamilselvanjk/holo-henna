import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnimation } from '../../hooks/useAnimation'
import './Hero.css'

const Hero = () => {
  useAnimation()
  const navigate = useNavigate()

  const handleBookNow = () => {
    navigate('/home#contact')
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">Experience the Art of Mehndi</h1>
        <p className="hero-text">
          Professional Mehndi Services for All Occasions
        </p>
        <button onClick={handleBookNow} className="hero-button btn">
          Book Now
        </button>
      </div>
    </section>
  )
}

export default Hero
