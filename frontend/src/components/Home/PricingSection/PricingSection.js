import React, { useEffect, useState } from 'react'
import './PricingSection.css'

const PricingSection = () => {
  const plans = [
    {
      title: 'HOURLY PRICING',
      subtitle: 'Free Hand Designing',
      price: '₹ 1,000',
      period: 'per month',
      features: [
        'Suitable for Mehndi events where more than 10 people',
        'Minimum billing for 3 hours / artist',
        'Additional hour - ₹ 1,000 / hour / artist',
      ],
    },
    {
      title: 'BRIDAL PACKAGES',
      subtitle: 'Customized Designing',
      price: '₹ 2,000',
      period: 'per month',
      isPopular: true,
      features: [
        'Suitable for Engagement, Wedding & Baby Shower',
        'Premium & intricate designs',
        'Theme specific design customization & selection',
        'Experienced artists',
        'Outstation & On-site services available',
      ],
    },
    {
      title: 'INDIVIDUAL PRICING',
      subtitle: 'Free Hand Designing',
      price: '₹ 500',
      period: 'per month',
      features: [
        'Suitable for mehndi events less than 10 people',
        'Studio walk-ins and On-site services available',
        '24/7 dedicated support',
        'Minimum billing for On-site services - ₹ 3,000',
      ],
    },
  ]

  // Track which plan was chosen for feedback
  const [chosenPlan, setChosenPlan] = useState(null)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.plan').forEach((plan) => {
      observer.observe(plan)
    })

    return () => {
      document.querySelectorAll('.plan').forEach((plan) => {
        observer.unobserve(plan)
      })
    }
  }, [])

  const handleChoosePlan = (planTitle) => {
    setChosenPlan(planTitle)
    setShowMessage(true)
    setTimeout(() => setShowMessage(false), 2500) // Hide after 2.5s
  }

  return (
    <section id="pricing" className="pricing-contain">
      <div className="container">
        <div className="section-title">
          <div className='price-head'>
            <h2>Choose Your Perfect Package</h2>
            <p>Compare our most popular packages to find the right one for you</p>
          </div>
        </div>
        <div className="pricing-table">
          {plans.map((plan, index) => (
            <div
              className={`plan ${plan.isPopular ? 'popular' : ''}`}
              key={index}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.isPopular && (
                <div className="popular-tag">Most Popular</div>
              )}
              <h3>{plan.title}</h3>
              <p className="subtitle">{plan.subtitle}</p>
              <div className="price-circle">
                <div className="price" >
                  {plan.price}
                </div>
                <span>{plan.period}</span>
              </div>
              <ul className="features">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button
                className="btn-outline"
                onClick={() => handleChoosePlan(plan.title)}
              >
                Choose {plan.title.split(' ')[0]}
              </button>
              {/* Creative feedback message */}
              {showMessage && chosenPlan === plan.title && (
                <div className="plan-feedback">
                  🎉 You selected <b>{plan.title}</b>! We'll help you make your event special.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
