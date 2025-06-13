import React, { useState, useEffect } from 'react'
import AddressDialog from '../AddressSelector/AddressDialog'
import './DeliveryForm.css'

const DeliveryForm = ({
  onBack,
  onNext,
  cartItems = [], // Add default empty array
  user = {}, // Add default empty object
}) => {
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Tamil Jk',
      type: 'HOME',
      lines: [
        'Near Jct College Of Engineering And Technology',
        'Jct College Of Engineering And Technology, Pichanur',
        'Coimbatore',
        'Pichanur',
        'Coimbatore, Tamil Nadu 641105',
      ],
      mobile: '9600846892', // Add mobile number
      isDefault: true,
    },
    {
      id: 2,
      name: 'Tamil Jk',
      type: 'HOME',
      lines: [
        '5/170middle street',
        'Villiseri, kovilpatti, Thoothukudi',
        'Villiseri',
        'Kovilpatti - 628716',
      ],
      isDefault: false,
    },
  ])
  const [error, setError] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(addresses.length === 0)
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false)
  const [deliveryDetails, setDeliveryDetails] = useState({
    date: '',
    timeSlot: '',
    instructions: '',
  })

  useEffect(() => {
    // Set default address as selected initially
    const defaultAddress = addresses.find((addr) => addr.isDefault)
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id)
    }
  }, [addresses])

  const formatShippingAddress = (address) => {
    // Split the last line which contains city, state and pincode
    const addressLines = address.lines.filter((line) => line) // Remove empty lines
    const lastLine = addressLines[addressLines.length - 1] || ''
    const matches = lastLine.match(/([^,]+),\s*([^,]+)\s+(\d{6})/)

    return {
      name: address.name,
      mobile: address.mobile,
      street: addressLines[0] || '',
      area: addressLines[1] || '',
      city: matches?.[1] || addressLines[2] || '',
      state: matches?.[2]?.trim() || '',
      pincode: matches?.[3] || '',
      type: address.type,
      addressLines: addressLines,
    }
  }

  const handleConfirm = () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address')
      return
    }

    const selectedAddress = addresses.find(
      (addr) => addr.id === selectedAddressId
    )
    if (!selectedAddress) {
      setError('Selected address not found')
      return
    }

    const shippingAddress = formatShippingAddress(selectedAddress)

    // Validate complete address
    if (!validateAddress(shippingAddress)) {
      return // Error is set in validateAddress
    }

    try {
      onNext({
        shippingAddress,
        deliveryDetails,
        orderItems: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
      })
    } catch (error) {
      setError('Failed to process delivery information')
      console.error('Error:', error)
    }
  }

  const validateAddress = (address) => {
    // Basic validation
    if (
      !address.name ||
      !address.mobile ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      setError('Please provide all address details')
      return false
    }

    // Format validation
    if (!/^\d{10}$/.test(address.mobile)) {
      setError('Invalid mobile number format')
      return false
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      setError('Invalid pincode format')
      return false
    }

    return true
  }

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId)
    setError('')
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setShowAddressDialog(true)
  }

  const handleRemoveAddress = (addressId) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))
  }

  const handleSaveAddress = (newAddress) => {
    setAddresses((prev) => {
      const existingIndex = prev.findIndex((addr) => addr.id === newAddress.id)

      if (existingIndex !== -1) {
        // Update existing address
        const updatedAddresses = [...prev]
        updatedAddresses[existingIndex] = {
          ...newAddress,
          id: prev[existingIndex].id,
        }

        // Update other addresses if this one is set as default
        if (newAddress.isDefault) {
          return updatedAddresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === prev[existingIndex].id,
          }))
        }
        return updatedAddresses
      } else {
        // Add new address
        const newId = Math.max(...prev.map((a) => a.id), 0) + 1
        const addressWithId = { ...newAddress, id: newId }

        // If this is first address or set as default
        if (prev.length === 0 || newAddress.isDefault) {
          const result = prev.map((addr) => ({ ...addr, isDefault: false }))
          result.push(addressWithId)
          setSelectedAddressId(newId) // Auto-select new default address
          return result
        }
        return [...prev, addressWithId]
      }
    })
    setShowAddressDialog(false)
    setEditingAddress(null)
    setError('') // Clear any existing errors
  }

  const handleNewAddressSubmit = (formData) => {
    const newAddress = {
      id: Math.max(...addresses.map((a) => a.id), 0) + 1,
      name: formData.name,
      type: 'HOME',
      lines: [
        formData.street,
        formData.area,
        formData.city,
        `${formData.city}, ${formData.state} ${formData.pincode}`,
      ],
      mobile: formData.mobile,
      isDefault: addresses.length === 0,
    }

    setAddresses((prev) => [...prev, newAddress])
    setSelectedAddressId(newAddress.id)
    setShowAddressForm(false)
    setShowDeliveryDetails(true)
  }

  const handleDeliveryDetailsSubmit = (details) => {
    setDeliveryDetails(details)
    handleConfirm()
  }

  const defaultAddresses = addresses.filter((addr) => addr.isDefault)
  const otherAddresses = addresses.filter((addr) => !addr.isDefault)

  const handleAddNewAddress = () => {
    setShowAddressDialog(true)
  }

  if (showAddressForm) {
    return (
      <div className="delivery-form-container">
        <AddressInputForm onSubmit={handleNewAddressSubmit} />
      </div>
    )
  }

  if (showDeliveryDetails) {
    return (
      <div className="delivery-form-container">
        <DeliveryDetailsForm
          onSubmit={handleDeliveryDetailsSubmit}
          onBack={() => setShowDeliveryDetails(false)}
        />
      </div>
    )
  }

  return (
    <div className="delivery-form-container">
      <button className="add-address-btn" onClick={handleAddNewAddress}>
        ADD NEW ADDRESS
      </button>

      <div className="addresses-wrapper">
        <div className="address-section">
          <h2>DEFAULT ADDRESS</h2>
          {defaultAddresses.length > 0 ? (
            defaultAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isSelected={selectedAddressId === address.id}
                onSelect={handleAddressSelect}
                onEdit={handleEditAddress}
                onRemove={handleRemoveAddress}
                showActions
              />
            ))
          ) : (
            <div className="empty-section">
              <p>No default address set</p>
              <button className="add-new-btn" onClick={handleAddNewAddress}>
                Set Default Address
              </button>
            </div>
          )}
        </div>

        <div className="address-section">
          <h2>OTHER ADDRESSES</h2>
          {otherAddresses.length > 0 ? (
            otherAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isSelected={selectedAddressId === address.id}
                onSelect={handleAddressSelect}
                onEdit={handleEditAddress}
                onRemove={handleRemoveAddress}
                showActions
              />
            ))
          ) : (
            <div className="empty-section">
              <p>No other addresses saved</p>
              <button className="add-new-btn" onClick={handleAddNewAddress}>
                Add New Address
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bottom-panel">
        {error && <div className="error-message">{error}</div>}
        <div className="bottom-buttons">
          <button className="back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <button
            className={`confirm-btn ${!selectedAddressId ? 'disabled' : ''}`}
            onClick={handleConfirm}
            disabled={!selectedAddressId}
          >
            Continue to Payment <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <AddressDialog
        isOpen={showAddressDialog}
        onClose={() => {
          setShowAddressDialog(false)
          setEditingAddress(null)
        }}
        onSave={handleSaveAddress}
        currentAddress={editingAddress}
      />
    </div>
  )
}

const AddressCard = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onRemove,
  showActions,
}) => {
  if (!address || !address.lines || !Array.isArray(address.lines)) {
    return (
      <div className="address-card empty">
        <p>No address details available</p>
        <button className="add-new-btn" onClick={onEdit}>
          Add Address Details
        </button>
      </div>
    )
  }

  return (
    <div className={`address-card ${isSelected ? 'selected' : ''}`}>
      <div className="address-header">
        <label className="radio-label">
          <input
            type="radio"
            name="selectedAddress"
            checked={isSelected}
            onChange={() => onSelect(address.id)}
          />
          <div className="user-info">
            <span className="name">{address.name || 'No Name'}</span>
          </div>
        </label>
      </div>
      <div className="address-content">
        {address.lines.map((line, idx) => (
          <p key={idx} className="address-line">
            {line}
          </p>
        ))}
      </div>
      <div className="address-actions">
        {address.mobile && <p className="mobile-number">📱 {address.mobile}</p>}
        {showActions && (
          <div className="address-actions">
            <button className="action-btn edit" onClick={() => onEdit(address)}>
              <i className="fas fa-edit"></i> EDIT
            </button>
            <button
              className="action-btn remove"
              onClick={() => onRemove(address.id)}
            >
              <i className="fas fa-trash"></i> REMOVE
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const AddressInputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    mobile: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="address-input-form">
      <h2>Add Delivery Address</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Street Address"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Area/Locality"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="PIN Code"
          value={formData.pincode}
          onChange={(e) =>
            setFormData({ ...formData, pincode: e.target.value })
          }
          required
          pattern="\d{6}"
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          required
          pattern="\d{10}"
        />
      </div>
      <button type="submit" className="submit-btn">
        Continue to Delivery Details
      </button>
    </form>
  )
}

const DeliveryDetailsForm = ({ onSubmit, onBack }) => {
  const [details, setDetails] = useState({
    date: '',
    timeSlot: '',
    instructions: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(details)
  }

  return (
    <form onSubmit={handleSubmit} className="delivery-details-form">
      <h2>Delivery Details</h2>
      <div className="form-group">
        <label>Delivery Date</label>
        <input
          type="date"
          value={details.date}
          onChange={(e) => setDetails({ ...details, date: e.target.value })}
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="form-group">
        <label>Time Slot</label>
        <select
          value={details.timeSlot}
          onChange={(e) => setDetails({ ...details, timeSlot: e.target.value })}
          required
        >
          <option value="">Select Time Slot</option>
          <option value="morning">Morning (9 AM - 12 PM)</option>
          <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
          <option value="evening">Evening (3 PM - 6 PM)</option>
        </select>
      </div>
      <div className="form-group">
        <label>Special Instructions (Optional)</label>
        <textarea
          value={details.instructions}
          onChange={(e) =>
            setDetails({ ...details, instructions: e.target.value })
          }
          placeholder="Any special instructions for delivery"
        />
      </div>
      <div className="button-group">
        <button type="button" onClick={onBack} className="back-btn">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button type="submit" className="confirm-btn">
          Continue to Payment <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </form>
  )
}

export default DeliveryForm
