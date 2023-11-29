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
import hub from '@ezkljs/hub'
// import ThreeScene from './components/ThreeScene'

export default function ThreeScene() {
  const model = useGLTF('/models/cartoon.glb')
  const modelRef = useRef<THREE.Mesh>()
  const directionalLightRef = useRef<DirectionalLight>(null!)

  const tiltAngle = 23.5 * (Math.PI / 180) // Earth's axial tilt
  const sunDistance = 5 // Adjust as needed for the scale of your scene

  // Calculate sun's position
  const sunPosition = {
    x: sunDistance * Math.cos(tiltAngle),
    y: sunDistance * Math.sin(tiltAngle),
    z: 0, // Assuming Sun is positioned directly over the equator at equinox
  }

  useHelper(directionalLightRef, DirectionalLightHelper, 1, 'red')

  // useFrame(async () => {
  //   const artifactId = '8c8791df-3f10-4d16-9774-f7e008a5cc7c'
  //   const input = { input_data: [[1.0, 0.0, 0.0, 1.0]] }
  //   const inputFile = JSON.stringify(input)

  //   console.log('inputFile', inputFile)
  //   const url = 'https://hub-staging.ezkl.xyz/graphql'

  //   const resp = await hub.initiateProof({
  //     artifactId,
  //     inputFile,
  //     url,
  //   })
  //   console.log('resp', resp)
  //   // if (modelRef.current) {
  //   //   modelRef.current.rotation.y += 0.01 // Adjust the rotation speed as needed
  //   // }
  // })
  useEffect(() => {
    console.log('useEffect')
    ;(async () => {
      console.log('async useEffect')
      const artifactId = '8c8791df-3f10-4d16-9774-f7e008a5cc7c'
      // const input = { input_data: [['1.0', '0.0', '0.0', '1.0']] }
      // const inputFile = JSON.stringify(input)
      const inputFile = `{"input_data": [[1.0, 0.0, 0.0, 1.0]]}`

      console.log('inputFile', inputFile)
      const url = 'https://hub-staging.ezkl.xyz/graphql'

      const { id } = await hub.initiateProof({
        artifactId,
        inputFile,
        url,
      })
      // console.log('initiateProofResp', initiateProofResp)

      let resp = await hub.getProof({ id, url })
      console.log('resp', resp)

      while (resp.status !== 'SUCCESS') {
        resp = await hub.getProof({ id, url })
        console.log('resp', resp)

        // if (resp.status === 'SUCCESS') {
        //   console.log('SUCCESS')
        //   break
        // }
      }

      console.log('outside', resp)

      // const id = initiateProofResp.id
      // console.log('resp', resp)
    })()
  }, [])

  return (
    <>
      {/* <axesHelper args={[5]} /> */}

      <ambientLight intensity={0.4} />
      <directionalLight
        ref={directionalLightRef}
        position={[sunPosition.x, sunPosition.y, sunPosition.z]}
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
        speed={0.1}
      />

      <OrbitControls />
    </>
  )
}
