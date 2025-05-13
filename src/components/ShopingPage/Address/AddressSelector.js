import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faBriefcase,
  faMapMarkerAlt,
  faChevronDown,
  faEdit,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import AddressDialog from './AddressDialog'
import './AddressSelector.css'

const AddressSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'John Doe',
      type: 'Home',
      street: '5/170 middle street',
      city: 'villiseri',
      state: 'kovilpatti',
      zip: '62850',
      isDefault: true,
    },
    {
      id: 2,
      name: 'John Doe',
      type: 'Work',
      street: '123 Work Plaza',
      city: 'villiseri',
      state: 'kovilpatti',
      zip: '62850',
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

  const getAddressIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'home':
        return faHome
      case 'work':
        return faBriefcase
      default:
        return faMapMarkerAlt
    }
  }

  return (
    <div className="address-selector">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <div className="toggle-content">
          <div className="address-icon">
            <FontAwesomeIcon icon={getAddressIcon(selectedAddress.type)} />
          </div>
          <div className="address-text">
            <div className="address-type">{selectedAddress.type}</div>
            <div className="address-details">
              {selectedAddress.street}, {selectedAddress.city}
            </div>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`dropdown-arrow ${isOpen ? 'rotate' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="address-list">
          {addresses.map((address) => (
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
                <div className="address-icon">
                  <FontAwesomeIcon icon={getAddressIcon(address.type)} />
                </div>
                <div className="address-details">
                  <div className="address-type">
                    {address.type}
                    {address.isDefault && (
                      <span className="default-badge">Default</span>
                    )}
                  </div>
                  <div className="address-text">
                    {address.street}, {address.city}
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
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          ))}
          <button className="add-address-btn" onClick={handleAddAddress}>
            <FontAwesomeIcon icon={faPlus} />
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
