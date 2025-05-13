import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import './AddressDialog.css'

const AddressDialog = ({ isOpen, onClose, onSave, currentAddress }) => {
  const [address, setAddress] = useState({
    name: '',
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false,
  })

  useEffect(() => {
    if (currentAddress) {
      setAddress(currentAddress)
    }
  }, [currentAddress])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(address)
      onClose()
    }
  }

  const validateForm = () => {
    if (
      !address.name.trim() ||
      !address.street.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.zip.trim()
    ) {
      alert('Please fill in all fields')
      return false
    }
    // Validate ZIP code format (5 digits)
    if (!/^\d{5}$/.test(address.zip)) {
      alert('Please enter a valid 5-digit ZIP code')
      return false
    }
    return true
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h3>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            {currentAddress ? ' Edit Address' : ' Add New Address'}
          </h3>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={address.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Address Type</label>
            <select
              id="type"
              name="type"
              value={address.type}
              onChange={handleChange}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={address.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={address.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={address.zip}
                onChange={handleChange}
                required
                pattern="[0-9]{5}"
                title="Please enter a valid 5-digit ZIP code"
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isDefault"
                checked={address.isDefault}
                onChange={handleChange}
              />
              Set as default address
            </label>
          </div>

          <div className="dialog-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddressDialog
