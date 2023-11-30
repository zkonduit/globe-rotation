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
// import hub from '@ezkljs/hub'
// import { parse } from 'path'
// import ThreeScene from './components/ThreeScene'

export default function ThreeScene({
  dTheta,
  verified,
  setVerified,
}: {
  dTheta: number
  verified: boolean
  setVerified: (verified: boolean) => void
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
  // const sunPosition = {
  //   x: sunDistance * Math.cos(tiltAngle),
  //   y: sunDistance * Math.sin(tiltAngle),
  //   z: 0, // Assuming Sun is positioned directly over the equator at equinox
  // }

  const ticks = useRef(0)

  const moveGlobe = () => {
    if (modelRef.current && verified) {
      modelRef.current.rotation.y += dTheta / 15
      // setVerified(false)

      ticks.current += 1

      if (ticks.current > 700) {
        clearInterval(intervalRef.current!)
        ticks.current = 0
        setVerified(false)
      }
    }
  }

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  intervalRef.current = setInterval(moveGlobe, 10)

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
