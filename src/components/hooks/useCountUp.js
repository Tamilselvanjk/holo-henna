import { useState, useEffect } from 'react'

const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!end) return

    let startTime = null
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)

      setCount(Math.floor(end * percentage))

      if (percentage < 1) {
        requestAnimationFrame(animateCount)
      }
    }

    requestAnimationFrame(animateCount)
  }, [end, duration])

  return count
}

export default useCountUp;
