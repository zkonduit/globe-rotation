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
  return (
    <>
      <ambientLight intensity={0.4} />
      {/* <pointLight ref={pointLightRef} position={[1, 0, 0]} /> */}
      {/* <pointLight position={[1, 0, 0]} /> */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 0, 0]}
        intensity={7}
      />
      <primitive object={model.scene} position={[0, -1, 0]} />
      <Stars
        radius={10}
        depth={50}
        count={9000}
        factor={6}
        saturation={10}
        fade
        speed={1}
      />

      <OrbitControls />
    </>
  )
}
