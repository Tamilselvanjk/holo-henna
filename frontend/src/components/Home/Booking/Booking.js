import React, { useState } from 'react'
import './Booking.css'
import { toast } from 'react-toastify'
import { API_ENDPOINTS, apiRequest } from '../../../config/api'

const serviceOptions = [
  {
    group: 'Bridal Collection',
    options: [
      {
        value: 'full-bridal',
        label: 'Full Bridal Package (Hands & Feet)',
        price: '₹25,000',
      },
      {
        value: 'elite-bridal',
        label: 'Elite Bridal Design with Portraits',
        price: '₹18,000',
      },
      {
        value: 'traditional',
        label: 'Traditional Wedding Design',
        price: '₹10,000',
      },
    ],
  },
  {
    group: 'Special Occasions',
    options: [
      {
        value: 'engagement',
        label: 'Engagement Ceremony Special',
        price: '₹8,000',
      },
      {
        value: 'pre-wedding',
        label: 'Pre-Wedding Celebration',
        price: '₹6,000',
      },
      { value: 'party', label: 'Party Design Package', price: '₹5,000' },
    ],
  },
  {
    group: 'Custom Designs',
    options: [
      {
        value: 'custom-arabic',
        label: 'Custom Arabic Fusion',
        price: 'Custom',
      },
      {
        value: 'custom-minimal',
        label: 'Minimalist Modern Design',
        price: 'Custom',
      },
      {
        value: 'custom-portrait',
        label: 'Portrait & Story Design',
        price: 'Custom',
      },
    ],
  },
]

const Booking = () => {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    customServiceDetail: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (name === 'service') {
      setShowCustomInput(value === 'custom')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.service) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)

    try {
      const bookingData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        service: {
          type: formData.service,
          amount: getServiceAmount(formData.service),
          details: serviceOptions
            .flatMap(group => group.options)
            .find(option => option.value === formData.service)?.label || ''
        },
        bookingDate: new Date().toISOString()
      }

      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000/api/v1/bookings'
        : 'https://holo-henna-frontend.onrender.com/api/v1/bookings'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit booking')
      }

      toast.success('Booking submitted successfully!')
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        service: '',
        customServiceDetail: ''
      })

    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.message || 'Failed to submit booking')
    } finally {
      setLoading(false)
    }
  }

  const getServiceAmount = (service) => {
    const servicePrices = {
      'full-bridal': 25000,
      'elite-bridal': 18000,
      traditional: 10000,
      engagement: 8000,
      'pre-wedding': 6000,
      party: 5000,
      'custom-arabic': 15000,
      'custom-minimal': 12000,
      'custom-portrait': 20000,
    }
    return servicePrices[service] || 0
  }

  return (
    <section className="section-wrapper" id="booking-section">
      <div className="section-overlay"></div>
      <div className="section-content">
        <div className="section-title">
          <span className="contact-label">CONTACT US</span>
          <h1>Transform Your Special Day</h1>
          <p className="title-description">
            Experience the art of traditional and modern mehndi designs
          </p>
        </div>

        <div className="section-container">
          <div className="map-section">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.9339575489837!2d77.63387!3d12.914699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1481dc7785c3%3A0x6d80b4706ef2c56c!2sHSR%20Layout%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1682227723574!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: 'var(--radius)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            ></iframe>
            <div className="map-info">
              <div className="map-address">Holo Henna Art</div>
              <div className="map-details">
                HSR Layout, Sector 3
                <br />
                Bengaluru, Karnataka 560102
              </div>
            </div>
          </div>

          <div className="contact-form">
            <div className="form-header">
              <i className="fas fa-mandala"></i>
              <h3>Book Your Appointment</h3>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-user"></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="Your Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-phone"></i>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Your Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-envelope"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group service-selection">
                <label className="form-label">
                  <i className="fas fa-paint-brush"></i>
                  Select Service
                </label>
                <select
                  name="service"
                  className="form-control service-select"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose your design package...</option>
                  {serviceOptions.map((group, index) => (
                    <optgroup key={index} label={group.group}>
                      {group.options.map((option, optIndex) => (
                        <option key={optIndex} value={option.value}>
                          {option.label} - {option.price}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={loading}
              >
                <span>{loading ? 'Submitting...' : 'Book Appointment'}</span>
                {!loading && <i className="fas fa-arrow-right"></i>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Booking
