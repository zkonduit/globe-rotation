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
import { useCallback, useEffect, useRef } from 'react'
import hub from '@ezkljs/hub'
import { parse } from 'path'
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

  // useHelper(directionalLightRef, DirectionalLightHelper, 1, 'red')

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
  const spin = useCallback(async () => {
    // while (true) {
    let v1: any = ['1.0', '0.0', '0.0', '1.0']
    // let v2 = ['1.0', '0.8', '-0.85', '1.0']
    // console.log('async useEffect')
    const artifactId = '8c8791df-3f10-4d16-9774-f7e008a5cc7c'
    // const input = { input_data: [['1.0', '0.0', '0.0', '1.0']] }
    // const inputFile = JSON.stringify(input)
    // const inputFile = `{"input_data": [[1.0, 0.0, 0.0, 1.0]]}`
    const inputFile = `{"input_data": [[${v1[0]}, ${v1[1]}, ${v1[2]}, ${v1[3]}]]}`

    // console.log('inputFile', inputFle)
    const url = 'https://hub-staging.ezkl.xyz/graphql'

    const { id } = await hub.initiateProof({
      artifactId,
      inputFile,
      url,
    })

    let resp = await hub.getProof({ id, url })

    while (resp.status !== 'SUCCESS') {
      resp = await hub.getProof({ id, url })
    }

    const p = BigInt(
      '0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001'
    )

    const lastFour = resp?.instances
      ?.slice(-4)
      .map((instance) => {
        const bigInst = BigInt(instance)
        // is negative
        if (bigInst > BigInt(2) ** BigInt(128) - BigInt(1)) {
          return bigInst - p
        } else {
          return bigInst
        }
      })
      // .map((instance) => instance / BigInt(2) ** BigInt(14))
      .map((instance) => Number(instance) / 2 ** 14)
    console.log('lastFour', lastFour)

    v1 = v1.map((v: string) => parseFloat(v))

    const v2 = lastFour
    if (!v2) {
      throw new Error('v2 is undefined')
    }

    for (let v of v2) {
      if (!v) {
        throw new Error('v is undefined')
      }
    }

    const phi = Math.acos(
      (v1[0] * v2[0] + v1[1] * v2[1]) /
        (Math.sqrt(v1[0] ** 2 + v1[1] ** 2) *
          Math.sqrt(v2[0] ** 2 + v2[1] ** 2))
    )

    // console.log('phi', phi)

    v1 = v2?.map((v) => String(v))

    // await new Promise((resolve) => setTimeout(resolve, 1000))

    setTimeout(() => {
      if (modelRef.current) {
        modelRef.current.rotation.y += phi
      }
      spin()
    }, 1_300)
  }, [])

  useEffect(() => {
    spin()
  }, [spin])

  return (
    <>
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
