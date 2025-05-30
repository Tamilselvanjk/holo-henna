import React, { useState } from 'react'
import './Booking.css'

const Booking = () => {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    customServiceDetail: '',
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <section className="section-wrapper" id="booking-section">
      <div className="section-overlay"></div>
      <div className="section-content">
        <div className="section-title">
          <span className="contact-label">CONTACT US</span>
          <h1>
            Get In Touch With
            <br />
            Our Mehndi Experts
          </h1>
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
                HSR Layout, Sector 3<br />
                Bengaluru, Karnataka 560102
              </div>
            </div>
          </div>

          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
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
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Your Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
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

              <div className="form-group service-group">
                <label htmlFor="service" className="form-label">
                  Select Your Service Type
                </label>
                <div className="select-wrapper">
                  <select
                    id="service"
                    name="service"
                    className="form-control service-select"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select a mehndi service...
                    </option>
                    <optgroup label="Wedding Services">
                      <option value="bridal">
                        Bridal Mehndi Design (Traditional & Modern)
                      </option>
                      <option value="engagement">
                        Engagement Ceremony Mehndi
                      </option>
                      <option value="sangeet">Sangeet Ceremony Mehndi</option>
                    </optgroup>
                    <optgroup label="Special Occasions">
                      <option value="party">
                        Party / Event Mehndi Designs
                      </option>
                      <option value="festival">Festival Special Mehndi</option>
                      <option value="custom">Custom Design Consultation</option>
                    </optgroup>
                  </select>
                </div>

                {showCustomInput && (
                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label className="form-label">
                      Describe Your Custom Design
                    </label>
                    <input
                      type="text"
                      name="customServiceDetail"
                      className="form-control"
                      placeholder="e.g., Arabic fusion with glitter"
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </div>

              <button type="submit" className="booking-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Booking
