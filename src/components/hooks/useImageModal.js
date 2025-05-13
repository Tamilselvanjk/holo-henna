import { useState,useEffect } from 'react'

export const useImageModal = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState('')

  const openModal = (imgSrc) => {
    setCurrentImage(imgSrc)
    setModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalOpen && e.target.classList.contains('modal')) {
        closeModal()
      }
    }

    if (modalOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [modalOpen])

  return { modalOpen, currentImage, openModal, closeModal }
}
