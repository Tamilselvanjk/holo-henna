import React, { useState, useEffect } from 'react'
import './AddressDialog.css'

const AddressDialog = ({ isOpen, onClose, onSave, currentAddress }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'HOME',
    lines: ['', '', ''],
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    mobile: '',
    isDefault: false,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (currentAddress) {
      setFormData({
        ...currentAddress,
        lines: currentAddress.lines || ['', '', ''],
      })
    } else {
      // Reset form when adding new address
      setFormData({
        name: '',
        type: 'HOME',
        lines: ['', '', ''],
        street: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        mobile: '',
        isDefault: false,
      })
    }
  }, [currentAddress])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.street?.trim()) {
      newErrors.street = 'Street address is required'
    }

    if (!formData.city?.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.state?.trim()) {
      newErrors.state = 'State is required'
    }

    if (!formData.pincode?.trim()) {
      newErrors.pincode = 'PIN code is required'
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Enter valid 6-digit PIN code'
    }

    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Enter valid 10-digit mobile number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const cleanedFormData = {
        ...formData,
        lines: [
          formData.street,
          formData.area,
          `${formData.city}, ${formData.state} ${formData.pincode}`,
        ].filter((line) => line?.trim()),
        name: formData.name?.trim(),
        mobile: formData.mobile?.trim(),
      }
      onSave(cleanedFormData)
    }
  }

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target

    if (name === 'lines') {
      const newLines = [...formData.lines]
      newLines[index] = value
      setFormData((prev) => ({
        ...prev,
        lines: newLines,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h3>{currentAddress ? 'Edit Address' : 'Add New Address'}</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Address Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="HOME">Home</option>
              <option value="WORK">Work</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              name="street"
              value={formData.street || ''}
              onChange={handleChange}
              placeholder="House/Flat No., Street, Building"
              className={errors.street ? 'error' : ''}
            />
            {errors.street && (
              <span className="error-text">{errors.street}</span>
            )}
          </div>

          <div className="form-group">
            <label>Area/Locality</label>
            <input
              type="text"
              name="area"
              value={formData.area || ''}
              onChange={handleChange}
              placeholder="Area, Colony, Locality"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                placeholder="City"
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                placeholder="State"
                className={errors.state ? 'error' : ''}
              />
              {errors.state && (
                <span className="error-text">{errors.state}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>PIN Code *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode || ''}
                onChange={handleChange}
                placeholder="6-digit PIN code"
                maxLength="6"
                className={errors.pincode ? 'error' : ''}
              />
              {errors.pincode && (
                <span className="error-text">{errors.pincode}</span>
              )}
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile || ''}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength="10"
                className={errors.mobile ? 'error' : ''}
              />
              {errors.mobile && (
                <span className="error-text">{errors.mobile}</span>
              )}
            </div>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              Set as default address
            </label>
          </div>

          <div className="dialog-buttons">
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
