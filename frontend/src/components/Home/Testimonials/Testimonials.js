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
  const [reviewsVisible, setReviewsVisible] = useState(false)
  const { isPanelOpen, togglePanel } = useTestimonialsPanel()
  const testimonialsRef = useRef(null)
  useTestimonialAnimation(testimonialsRef)

  const handleBusinessClick = () => {
    if (!reviewsVisible) {
      setReviewsVisible(true)
      setTimeout(() => {
        togglePanel()
      }, 500) // Wait for cards animation
    } else {
      togglePanel()
    }
  }

  const handleClosePanel = () => {
    togglePanel()
    // Optional: Hide cards when panel closes
    // setTimeout(() => {
    //   setReviewsVisible(false);
    // }, 300);
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    const tiltX = (y - 0.5) * 10 // Max tilt of 10 degrees
    const tiltY = (x - 0.5) * 10

    const image = e.currentTarget.querySelector('.business-img')
    if (image) {
      image.style.transform = `perspective(1000px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`
    }
  }

  const handleMouseLeave = (e) => {
    const image = e.currentTarget.querySelector('.business-img')
    if (image) {
      image.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }
  }

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-title">
          <h2>Client Testimonials</h2>
          <p>Hear from our delighted clients about their experiences</p>
        </div>

        <div
          className="busniess-review"
          onClick={handleBusinessClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src="/webimg/reviews.png"
            alt="Holo Henna Art Illustration"
            className="business-img"
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
            className={`testimonials-grid ${reviewsVisible ? 'visible' : ''}`}
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
        onClick={handleClosePanel}
      />
      <div className={`reviews-panel ${isPanelOpen ? 'active' : ''}`}>
        <div className="panel-header">
          <h2 className="panel-title">Customer Reviews</h2>
          <button className="close-panel" onClick={handleClosePanel}>
            &times;
          </button>
        </div>
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
