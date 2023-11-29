'use client'
import Image from 'next/image'
import { Canvas, useFrame } from '@react-three/fiber'
// import { useRef, useState } from 'react'

// import { useLoader } from '@react-three/fiber'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// import earthModel from './earth.glb'
// import earthModel from 'models/earth.glb'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Earth from './components/Earth'

export default function Home() {
  // const { nodes, materials } = useGLTF('/models/earth.glb')
  // const { nodes, materials } = useGLTF(earthModel)
  // const model = useGLTF('/models/earth.glb')
  const { nodes, materials } = useGLTF('/models/earth.glb')

  console.log(Object.keys(nodes))
  // console.log(Object.keys(nodes.Cube001))
  // console.log(Object.keys(materials['Default OBJ']))

  return (
    <main className='h-full'>
      <Canvas flat className='h-full w-full'>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <mesh
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={1}
          geometry={nodes.Cube001.geometry}
          material={nodes.Cube001.material}
        />
        {/* <Earth /> */}
        {/* <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='orange' />
        </mesh> */}

        <OrbitControls />
      </Canvas>
    </main>
  )
}

// function Box(props) {
//   // This reference gives us direct access to the THREE.Mesh object
//   const ref = useRef()
//   // Hold state for hovered and clicked events
//   const [hovered, hover] = useState(false)
//   const [clicked, click] = useState(false)
//   // Subscribe this component to the render-loop, rotate the mesh every frame
//   useFrame((state, delta) => (ref.current.rotation.x += delta))
//   // Return the view, these are regular Threejs elements expressed in JSX
//   return (
//     <mesh
//       {...props}
//       ref={ref}
//       scale={clicked ? 1.5 : 1}
//       onClick={(event) => click(!clicked)}
//       onPointerOver={(event) => hover(true)}
//       onPointerOut={(event) => hover(false)}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//     </mesh>
//   )
// }
