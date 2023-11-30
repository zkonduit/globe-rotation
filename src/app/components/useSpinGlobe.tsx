import { useEffect, useRef, useState } from 'react'

const useSpinGlobe = (
  // totalRotation: number = 0,
  // setTotalRotation: (totalRotation: number) => void,
  theta: number,
  verified: boolean,
  resetVerified: () => void
) => {
  const timer = useRef<NodeJS.Timeout | null>(null)
  const ticks = useRef(0)

  const [angle, setAngle] = useState(0)
  console.log('angle', angle)

  useEffect(() => {
    if (verified) {
      timer.current = setInterval(() => {
        setAngle((ticks.current * theta) / 15)

        console.log('ticks', ticks.current)
        if (ticks.current > 100) {
          console.log('ticks', ticks.current)
          ticks.current = 0
          clearInterval(timer.current!)
          // setTotalRotation(angle)
          resetVerified()
        }
        ticks.current = ticks.current + 1
      }, 100)
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [theta, verified, resetVerified])

  return angle
}

export default useSpinGlobe
