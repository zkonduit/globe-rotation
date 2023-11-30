'use client'
import Image from 'next/image'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  DirectionalLight,
  DirectionalLightHelper,
  PointLightHelper,
} from 'three'
import {
  Float,
  OrbitControls,
  Stars,
  useGLTF,
  useHelper,
} from '@react-three/drei'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useSpinGlobe from './useSpinGlobe'
// import hub from '@ezkljs/hub'
// import { parse } from 'path'
// import ThreeScene from './components/ThreeScene'

export default function ThreeScene({
  theta,
  dTheta,
  verified,
  resetVerified,
}: {
  dTheta: number
  verified: boolean
  resetVerified: () => void
}) {
  const model = useGLTF('/models/cartoon.glb')
  const modelRef = useRef<THREE.Mesh>()
  const directionalLightRef = useRef<DirectionalLight>(null!)

  const tiltAngle = 23.5 * (Math.PI / 180) // Earth's axial tilt
  const sunDistance = 5 // Adjust as needed for the scale of your scene

  // Calculate sun's position
  const sunPosition = useMemo(
    () => ({
      x: sunDistance * Math.cos(tiltAngle),
      y: sunDistance * Math.sin(tiltAngle),
      z: 0, // Assuming Sun is positioned directly over the equator at equinox
    }),
    [tiltAngle]
  )

  // console.log('verified', verified)
  // const theta = useSpinGlobe(dTheta, verified, resetVerified)

  // const totalRotation = useRef(0)

  modelRef.current?.rotation.set(0, theta, 0)

  // const sunPosition = {
  //   x: sunDistance * Math.cos(tiltAngle),
  //   y: sunDistance * Math.sin(tiltAngle),
  //   z: 0, // Assuming Sun is positioned directly over the equator at equinox
  // }
  // const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // const ticks = useRef(0)
  // console.log('ticks', ticks.current)

  // const moveGlobe = useCallback(() => {
  //   console.log('ticks', ticks.current)
  //   if (modelRef.current && verified) {
  //     // console.log('modelRef.current', modelRef.current)
  //     modelRef.current.rotation.y += dTheta / 15

  //     console.log('ticks', ticks.current)

  //     if (ticks.current > 100) {
  //       console.log('ticks', ticks.current)
  //       setVerified(false)
  //       ticks.current = 0
  //       clearInterval(intervalRef.current!)
  //     }

  //     ticks.current += 1
  //   }
  // }, [dTheta, setVerified, verified, ticks, intervalRef])

  // useEffect(() => {
  //   if (verified) {
  //     intervalRef.current = setInterval(moveGlobe, 10)
  //   }

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current)
  //     }
  //   }
  // }, [moveGlobe, verified]) // Dependency array includes 'verified'

  // intervalRef.current = setInterval(moveGlobe, 10)

  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight
        ref={directionalLightRef}
        position={[sunPosition.x, sunPosition.y, sunPosition.z]}
        intensity={1.5}
      />
      <primitive ref={modelRef} object={model.scene} position={[0, -1, 0]} />
      <Stars
        radius={200}
        depth={5}
        count={9000}
        factor={6}
        saturation={1}
        fade
        speed={0.1}
      />

      <OrbitControls />
    </>
  )
}
