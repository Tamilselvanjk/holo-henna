import { useState } from 'react'

export const useMobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenuOnLinkClick = () => {
    setIsMenuOpen(false)
  }

  return { isMenuOpen, toggleMenu, closeMenuOnLinkClick }
}
