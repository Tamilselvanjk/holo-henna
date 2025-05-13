import { useState, useEffect } from 'react'

export const useTestimonialsPanel = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isPanelOpen])

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen)
  }

  return { isPanelOpen, togglePanel }
}
