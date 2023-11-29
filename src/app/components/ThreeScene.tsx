'use client'
import Image from 'next/image'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  DirectionalLight,
  DirectionalLightHelper,
  PointLightHelper,
} from 'three'
import { OrbitControls, useGLTF, useHelper } from '@react-three/drei'
import { useEffect, useRef } from 'react'
// import ThreeScene from './components/ThreeScene'

export default function ThreeScene() {
  const model = useGLTF('/models/cartoon.glb')

  const directionalLightRef = useRef<DirectionalLight>(null!)

  useHelper(directionalLightRef, DirectionalLightHelper, 1, 'red')
  return (
    <>
      <ambientLight />
      {/* <pointLight ref={pointLightRef} position={[1, 0, 0]} /> */}
      {/* <pointLight position={[1, 0, 0]} /> */}
      <directionalLight ref={directionalLightRef} position={[0, 5, 0]} />
      <primitive object={model.scene} />
      <OrbitControls />
    </>
  )
}
