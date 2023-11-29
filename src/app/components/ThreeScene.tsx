'use client'
import Image from 'next/image'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  DirectionalLight,
  DirectionalLightHelper,
  PointLightHelper,
} from 'three'
import { OrbitControls, Stars, useGLTF, useHelper } from '@react-three/drei'
import { useEffect, useRef } from 'react'
// import ThreeScene from './components/ThreeScene'

export default function ThreeScene() {
  const model = useGLTF('/models/cartoon.glb')

  const directionalLightRef = useRef<DirectionalLight>(null!)

  useHelper(directionalLightRef, DirectionalLightHelper, 1, 'red')

  const modelRef = useRef()

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01 // Adjust the rotation speed as needed
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={directionalLightRef}
        position={[5, 0, 0]}
        intensity={7}
      />
      <primitive ref={modelRef} object={model.scene} position={[0, -1, 0]} />
      <Stars
        radius={200}
        depth={5}
        count={9000}
        factor={6}
        saturation={1}
        fade
        speed={1}
      />

      <OrbitControls />
    </>
  )
}
