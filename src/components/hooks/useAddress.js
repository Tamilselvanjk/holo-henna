import { useState } from 'react'

export const useAddress = () => {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Home',
      street: '5/170 middle street',
      city: 'villiseri',
      state: 'kovilpatti',
      zip: '628501',
      icon: 'home',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Work',
      street: '5/170 middle street',
      city: 'villiseri',
      state: 'kovilpatti',
      zip: '628501',
      icon: 'work',
    },
  ])

  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((addr) => addr.isDefault) || addresses[0]
  )

  const [showAddressDialog, setShowAddressDialog] = useState(false)

  const handleSelectAddress = (address) => {
    setSelectedAddress(address)
  }

  const handleAddAddress = (newAddress) => {
    const addressWithId = {
      ...newAddress,
      id: (addresses.length + 1).toString(),
    }
    setAddresses([...addresses, addressWithId])
    setSelectedAddress(addressWithId)
    setShowAddressDialog(false)
  }

  const toggleAddressDialog = () => {
    setShowAddressDialog((prev) => !prev)
  }

  return {
    addresses,
    selectedAddress,
    showAddressDialog,
    handleSelectAddress,
    handleAddAddress,
    toggleAddressDialog,
  }
}
