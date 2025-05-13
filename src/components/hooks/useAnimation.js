import { useEffect } from 'react'

export const useAnimation = (targetRef) => {
  useEffect(() => {
    if (!targetRef?.current) return // Guard clause for undefined ref

    const currentTarget = targetRef.current
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate')
        }
      })
    })

    observer.observe(currentTarget)

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [targetRef])
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
  }, [targetRef])
}
