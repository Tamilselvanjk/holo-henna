import React, { useState } from 'react'
import AddressDialog from './AddressDialog'
import './AddressSelector.css'

const AddressSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
      mobile: '9600846892',
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

  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((addr) => addr.isDefault) || addresses[0]
  )

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
    setIsOpen(false)
  }

  const handleAddAddress = () => {
    setEditingAddress(null)
    setIsDialogOpen(true)
    setIsOpen(false)
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setIsDialogOpen(true)
    setIsOpen(false)
  }

  const handleSaveAddress = (addressData) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addressData, id: addr.id }
            : addressData.isDefault
            ? { ...addr, isDefault: false }
            : addr
        )
      )
    } else {
      // Add new address
      const newAddress = {
        ...addressData,
        id: Math.max(...addresses.map((a) => a.id), 0) + 1,
      }

      // If this is the first address or it's set as default
      if (addresses.length === 0 || addressData.isDefault) {
        setAddresses((prevAddresses) =>
          prevAddresses
            .map((addr) => ({ ...addr, isDefault: false }))
            .concat(newAddress)
        )
        setSelectedAddress(newAddress)
      } else {
        setAddresses((prev) => [...prev, newAddress])
      }
    }
    setIsDialogOpen(false)
    setEditingAddress(null)
  }

  const getAddressDisplay = (address) => {
    return address.lines.join(', ').substring(0, 50) + '...'
  }

  return (
    <div className="address-selector">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <div className="toggle-content">
          <div className="address-icon">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div className="address-text">
            <div className="address-type">{selectedAddress.type}</div>
            <div className="address-details">
              {getAddressDisplay(selectedAddress)}
            </div>
          </div>
        </div>
        <i
          className={`fas fa-chevron-down dropdown-arrow ${
            isOpen ? 'rotate' : ''
          }`}
        ></i>
      </button>

      {isOpen && (
        <div className="address-list">
          <div className="address-group">
            <h3>Default Address</h3>
            {addresses
              .filter((addr) => addr.isDefault)
              .map((address) => (
                <div
                  key={address.id}
                  className={`address-item ${
                    selectedAddress.id === address.id ? 'selected' : ''
                  }`}
                >
                  <div
                    className="address-item-content"
                    onClick={() => handleAddressSelect(address)}
                  >
                    <div className="address-details">
                      <div className="address-type">
                        {address.type}
                        <span className="default-badge">Default</span>
                      </div>
                      <div className="address-text">
                        {getAddressDisplay(address)}
                      </div>
                    </div>
                  </div>
                  <button
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditAddress(address)
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              ))}
          </div>

          <div className="address-group">
            <h3>Other Addresses</h3>
            {addresses
              .filter((addr) => !addr.isDefault)
              .map((address) => (
                <div
                  key={address.id}
                  className={`address-item ${
                    selectedAddress.id === address.id ? 'selected' : ''
                  }`}
                >
                  <div
                    className="address-item-content"
                    onClick={() => handleAddressSelect(address)}
                  >
                    <div className="address-details">
                      <div className="address-type">{address.type}</div>
                      <div className="address-text">
                        {getAddressDisplay(address)}
                      </div>
                    </div>
                  </div>
                  <button
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditAddress(address)
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              ))}
          </div>

          <button className="add-address-btn" onClick={handleAddAddress}>
            <i className="fas fa-plus"></i>
            Add New Address
          </button>
        </div>
      )}

      <AddressDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveAddress}
        currentAddress={editingAddress}
      />
    </div>
  )
}

export default AddressSelector
