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

  useEffect(() => {
    // Set default address as selected initially
    const defaultAddress = addresses.find((addr) => addr.isDefault)
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id)
    }
  }, [addresses])

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

    // Ensure all required fields are present
    const shippingAddress = {
      name: selectedAddress.name,
      mobile: selectedAddress.mobile,
      street: selectedAddress.lines[0],
      city: selectedAddress.lines[2],
      state:
        selectedAddress.lines[4]?.split(',')[1]?.trim() ||
        selectedAddress.lines[3],
      pincode: selectedAddress.lines[4]?.match(/\d+/)?.[0] || '',
      addressLines: selectedAddress.lines,
    }

    // Validate required fields
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      setError('Please provide complete address details')
      return
    }

    try {
      onNext({
        shippingAddress,
        orderItems: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
      })
    } catch (error) {
      console.error('Error processing delivery details:', error)
      setError('Failed to process delivery information')
    }
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

  const defaultAddresses = addresses.filter((addr) => addr.isDefault)
  const otherAddresses = addresses.filter((addr) => !addr.isDefault)

  const handleAddNewAddress = () => {
    setShowAddressDialog(true)
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

export default DeliveryForm
