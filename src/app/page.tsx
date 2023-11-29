'use client'
import { Canvas } from '@react-three/fiber'

import ThreeScene from './components/ThreeScene'

export default function Home() {
  return (
    <main className='h-full'>
      <Canvas flat className='h-full w-full bg-black'>
        <ThreeScene />
      </Canvas>
    </main>
  )
}
