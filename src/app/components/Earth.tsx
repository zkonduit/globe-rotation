'use client'

import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Earth() {
  // const { nodes, materials } = useGLTF('/models/earth.glb')
  const result = useGLTF('/models/earth.glb')
  console.log(result)

  return (
    <primitive
      object={result.scene}
      position={[0, 1, 0]}
      children-0-castShadow
    />
  )

  // return (
  //   <mesh
  //     position={[0, 0, 0]}
  //     rotation={[0, 0, 0]}
  //     scale={[1, 1, 1]}
  //     geometry={result.nodes.Cube001.geometry}
  //     // material={result.materials['Default OBJ']}
  //   >
  //     {/* <boxGeometry args={[1, 1, 1]} /> */}
  //     <meshStandardMaterial color='orange' />
  //   </mesh>
  // )
}
