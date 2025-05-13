import { useState } from 'react'

export const useBookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    service: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your booking request! We will contact you soon.')
    setFormData({
      name: '',
      phone: '',
      email: '',
      location: '',
      service: '',
    })
  }

  return { formData, handleChange, handleSubmit }
}
