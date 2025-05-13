import { useEffect } from 'react'

export const useTestimonialAnimation = (ref) => {
  useEffect(() => {
    if (!ref?.current) return // Guard clause

    const currentRef = ref.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.testimonial-card')
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate')
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(currentRef)

    return () => {
      observer.unobserve(currentRef)
    }
  }, [ref])
}
