import { useEffect, useRef, useState } from 'react'

const useSpinGlobe = (
  totalRotation: number = 0,
  setTotalRotation: (totalRotation: number) => void,
  theta: number,
  verified: boolean,
  resetVerified: () => void
) => {
  const timer = useRef<NodeJS.Timeout | null>(null)
  const ticks = useRef(0)

  const [angle, setAngle] = useState(0)

  console.log('angle', angle)

  useEffect(() => {
    console.log('useEffect', verified)
    console.log('verified', verified)
    if (verified) {
      timer.current = setInterval(() => {
        console.log('ticks', ticks.current)

        setAngle(totalRotation + (ticks.current * theta) / 15)

        // setTotalRotation(totalRotation + theta / 15)
        if (ticks.current > 100) {
          ticks.current = 0
          clearInterval(timer.current!)
          setTotalRotation(angle + totalRotation)
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
  }, [resetVerified, setTotalRotation, theta, totalRotation, verified])
  console.log('angle', angle)

  return angle

  // return (ticks.current * theta) / 15
  // return { spin, spinGlobe, stopSpin }
}

export default useSpinGlobe
