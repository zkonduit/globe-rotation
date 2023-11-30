import { useEffect, useRef, useState } from 'react'

const useSpinGlobe = (theta, verified, resetVerified) => {
  const timer = useRef<NodeJS.Timeout | null>(null)
  const ticks = useRef(0)

  const [angle, setAngle] = useState(0)

  useEffect(() => {
    if (verified) {
      timer.current = setInterval(() => {
        const newAngle = angle + theta / 15
        setAngle(newAngle)

        if (ticks.current > 100) {
          ticks.current = 0
          clearInterval(timer.current)
          resetVerified() // Reset verified here
        }
        ticks.current += 1
      }, 100)
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [resetVerified, theta, verified]) // Removed angle from dependencies

  return angle
}

export default useSpinGlobe
