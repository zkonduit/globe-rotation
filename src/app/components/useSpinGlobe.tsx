import { useEffect, useRef, useState } from 'react'

const useSpinGlobe = (theta, verified, resetVerified) => {
  const timer = useRef<NodeJS.Timeout | null>(null)
  const ticks = useRef(0)

  const [angle, setAngle] = useState(0)

  useEffect(() => {
    if (verified) {
      timer.current = setInterval(() => {
        setAngle((prevAngle) => prevAngle + theta / 15)

        if (ticks.current > 300) {
          ticks.current = 0
          clearInterval(timer.current!)
          resetVerified()
        }
        ticks.current += 1
      }, 10)
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [resetVerified, theta, verified])

  return angle
}

export default useSpinGlobe
