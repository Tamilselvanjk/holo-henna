import { useState, useEffect } from 'react'

export const useGalleryNavigation = () => {
  const [activeSection, setActiveSection] = useState('illustration-infusion')

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.gallery-section')
      let currentSection = ''

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        if (
          window.scrollY >= sectionTop - 200 &&
          window.scrollY < sectionTop + sectionHeight - 200
        ) {
          currentSection = section.id
        }
      })

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeSection])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return { activeSection, scrollToSection }
}

export default useGalleryNavigation
