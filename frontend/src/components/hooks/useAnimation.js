import { useEffect, useRef } from 'react'

export const useAnimation = () => {
  const animateOnScroll = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate')

        // Animate child elements
        const cards = entry.target.querySelectorAll(
          '.card, .package-card, .product-card, .plan, .stat-box, .testimonial-card'
        )
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate')
          }, index * 100)
        })
      }
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(animateOnScroll, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px',
    })

    // Observe all sections
    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [])
}

export const useCounterAnimation = (targetRef) => {
  useEffect(() => {
    const animateNumberCounter = () => {
      const counters = targetRef.current.querySelectorAll('.stat-number')
      const animationDuration = 2000 // 2 seconds
      const frameDuration = 1000 / 60 // 60fps

      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'))
        const start = 0
        const totalFrames = Math.round(animationDuration / frameDuration)
        let current = start
        const increment = target / totalFrames

        const updateCounter = () => {
          current += increment
          if (current < target) {
            counter.textContent = Math.floor(current) + '+'
            requestAnimationFrame(updateCounter)
          } else {
            counter.textContent = target + '+'
          }
        }

        // Start the animation
        requestAnimationFrame(updateCounter)
      })
    }

    const experienceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumberCounter()
            experienceObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (targetRef.current) {
      experienceObserver.observe(targetRef.current)
    }

    return () => {
      if (targetRef.current) {
        experienceObserver.unobserve(targetRef.current)
      }
    }
  }, [targetRef])
}
