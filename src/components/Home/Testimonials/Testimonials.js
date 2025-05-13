import React, { useRef, useState } from 'react'
import { useTestimonialsPanel } from '../../hooks/useTestimonialsPanel'
import { useTestimonialAnimation } from '../../hooks/useTestimonialAnimation'
import { testimonials, reviews } from './testimonialData'
import './Testimonials.css'

const StarRating = ({ rating }) => (
  <div className="stars">
    {[...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fas fa-star${
          i < Math.floor(rating)
            ? ''
            : i === Math.floor(rating) && rating % 1 !== 0
            ? '-half-alt'
            : ''
        }`}
      ></i>
    ))}
  </div>
)

const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card">
    <StarRating rating={testimonial.stars} />
    <p className="testimonial-text">{testimonial.text}</p>
    <div className="divider"></div>
    <div className="client-info">
      <div className="client-avatar">{testimonial.initials}</div>
      <div>
        <div className="client-name">{testimonial.name}</div>
        <div className="client-email">{testimonial.email}</div>
      </div>
    </div>
  </div>
)

const ReviewCard = ({ review }) => (
  <div className="review-card">
    <div className="reviewer-avatar">{review.initials}</div>
    <div className="review-content">
      <h3 className="reviewer-name">{review.name}</h3>
      <div className="review-stars">
        {'★'.repeat(review.stars)}
        {'☆'.repeat(5 - review.stars)}
      </div>
      <div className="review-date">{review.date}</div>
      <p className="review-text">{review.text}</p>
    </div>
  </div>
)

const Testimonials = () => {
  const { isPanelOpen, togglePanel } = useTestimonialsPanel()
  const [isVisible, setIsVisible] = useState(false)
  const testimonialsRef = useRef(null)
  useTestimonialAnimation(testimonialsRef)

  const handleBusinessClick = () => {
    setIsVisible(true)
    togglePanel()
  }

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-title">
          <h2>Client Testimonials</h2>
          <p>Hear from our delighted clients about their experiences</p>
        </div>

        <div className="busniess-review" onClick={handleBusinessClick}>
          <img
            src="/webimg/reviews.png"
            alt="Holo Henna Art Illustration"
            className="business-img"
            style={{ width: '600px', height: '600px', borderRadius: '8px' }}
          />
          <div className="business-info">
            <h2 className="business-name">Holo Henna Art</h2>
            <p className="reviews-count">
              <span className="star-rating">★★★★★</span> 319 Google reviews
            </p>
          </div>
        </div>

        <div className="testimonials-wrapper">
          <div
            className={`testimonials-grid ${isVisible ? 'visible' : ''}`}
            ref={testimonialsRef}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>

      <div
        className={`overlay ${isPanelOpen ? 'active' : ''}`}
        onClick={togglePanel}
      />
      <div className={`reviews-panel ${isPanelOpen ? 'active' : ''}`}>
        <div className="panel-header">
          <h2 className="panel-title">Customer Reviews</h2>
          <button className="close-panel" onClick={togglePanel}>
            &times;
          </button>
        </div>
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </section>
  )
}

export default Testimonials
