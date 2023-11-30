'use client'

import '@rainbow-me/rainbowkit/styles.css'

import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'

import { Canvas } from '@react-three/fiber'
import ThreeScene from './ThreeScene'
import { useCallback, useState } from 'react'
import hub from '@ezkljs/hub'
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import verifyABI from './verifier_abi.json'

export default function App() {
  const [verified, setVerified] = useState(false)
  const { write, data, isSuccess, isLoading } = useContractWrite({
    address: '0xf2607430e752cBd67bA0207b21DEe3e634b7306D',
    abi: verifyABI,
    functionName: 'verifyProof',
  })

  const waitForTransaction = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 3,
    onSettled() {
      setVerified(true)
    },
  })

  const INITIAL_POSITION = ['1.0', '0.0', '0.0', '1.0']
  const [dTheta, setDTheta] = useState(0)

  const [position, setPosition] = useState(INITIAL_POSITION)
  const url = 'https://hub-staging.ezkl.xyz/graphql'

  const deScale = (instance: bigint, scale: number) =>
    Number(instance) / 2 ** scale

  const feltToFloat = (instance: string) => {
    const p = BigInt(
      '0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001'
    )
    const bigInst = BigInt(instance)
    // is negative
    if (bigInst > BigInt(2) ** BigInt(128) - BigInt(1)) {
      return bigInst - p
    } else {
      return bigInst
    }
  }
  const spin = useCallback(async () => {
    let initialPos_str = [...position]
    const artifactId = '596654f8-5562-454b-a6d1-41a93a3e021b'
    const inputFile = `{"input_data": [[${initialPos_str[0]}, ${initialPos_str[1]}, ${initialPos_str[2]}, ${initialPos_str[3]}]]}`

    const { id } = await hub.initiateProof({
      artifactId,
      inputFile,
      url,
    })

    let resp = await hub.getProof({ id, url })

    while (resp.status !== 'SUCCESS') {
      await new Promise((resolve) => setTimeout(resolve, 2_000))
      resp = await hub.getProof({ id, url })
    }

    const nextPos_num = resp?.instances
      ?.slice(-4)
      .map((instance) => feltToFloat(instance))
      .map((instance) => deScale(instance, 14))

    const initialPos_num = initialPos_str.map((v: string) => parseFloat(v))

    if (!nextPos_num) {
      throw new Error('nextPos_num is undefined')
    }

    for (let v of nextPos_num) {
      if (!v) {
        throw new Error('v is undefined')
      }
    }

    const dTheta = Math.acos(
      (initialPos_num[0] * nextPos_num[0] +
        initialPos_num[1] * nextPos_num[1]) /
        (Math.sqrt(initialPos_num[0] ** 2 + initialPos_num[1] ** 2) *
          Math.sqrt(nextPos_num[0] ** 2 + nextPos_num[1] ** 2))
    )

    const newPos_num = nextPos_num?.map((v) => String(v))

    if (!write) {
      throw new Error('write is undefined')
    }

    write({ args: [resp.proof, resp.instances] })

    setPosition([...newPos_num])

    setDTheta(dTheta)
  }, [position, write])
  return (
    <>
      <div className='absolute top-10 left-10 bg-black  z-[100]'>
        <ConnectButton />
      </div>
      <Canvas
        camera={{ position: [-3, 0, 0] }}
        flat
        className='h-full w-full bg-black'
      >
        <ThreeScene
          dTheta={dTheta}
          verified={verified}
          resetVerified={() => setVerified(false)}
        />
      </Canvas>
      <div className=' absolute bottom-12 w-full flex justify-center'>
        <button
          className='p-8 py-4 bg-cyan-400 text-white font-bold text-xl border-2 border-white rounded-lg'
          onClick={spin}
        >
          Rotate
        </button>
      </div>
    </>
  )
}
