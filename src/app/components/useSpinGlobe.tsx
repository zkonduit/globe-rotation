import { useEffect, useRef, useState } from 'react'

const useSpinGlobe = (
  theta: number,
  verified: boolean,
  resetVerified: () => void
) => {
  console.log('theta', theta)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const ticks = useRef(0)

  const [angle, setAngle] = useState(0)

  useEffect(() => {
    console.log('useEffect', verified)
    console.log('verified', verified)
    if (verified) {
      timer.current = setInterval(() => {
        console.log('ticks', ticks.current)

        setAngle((ticks.current * theta) / 15)
        if (ticks.current > 100) {
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
  console.log('angle', angle)

  return angle

  // return (ticks.current * theta) / 15
  // return { spin, spinGlobe, stopSpin }
}

export default useSpinGlobe
