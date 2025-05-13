import React, { useEffect, useRef, useState } from 'react'
import useCountUp from '../../hooks/useCountUp'
import './Experience.css'

const Experience = () => {
  const statsRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const currentStats = statsRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (currentStats) {
      observer.observe(currentStats)
    }

    return () => {
      if (currentStats) {
        observer.unobserve(currentStats)
      }
    }
  }, [])

  const clientsCount = useCountUp(isVisible ? 40000 : 0)
  const bridesCount = useCountUp(isVisible ? 3500 : 0)
  const citiesCount = useCountUp(isVisible ? 55 : 0)
  const studentsCount = useCountUp(isVisible ? 200 : 0)

  return (
    <section id="experience">
      <div className="container">
        <div className="section-title">
          <h2>Our Journey of Excellence</h2>
          <p>
            Discover our remarkable journey in the world of Mehndi artistry.
          </p>
        </div>
        <div className="stats" ref={statsRef}>
          <div className="stat-box">
            <div className="stat-number">{clientsCount.toLocaleString()}+</div>
            <div className="stat-text">Clients served</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{bridesCount.toLocaleString()}+</div>
            <div className="stat-text">Applied mehndi for brides</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{citiesCount}+</div>
            <div className="stat-text">Cities travelled</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{studentsCount}+</div>
            <div className="stat-text">Students trained</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
