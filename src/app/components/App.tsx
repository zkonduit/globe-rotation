'use client'

import '@rainbow-me/rainbowkit/styles.css'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import { Canvas } from '@react-three/fiber'
import ThreeScene from './ThreeScene'
import { useState } from 'react'
import hub from '@ezkljs/hub'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import verifyABI from './verifier_abi.json'
import useSpinGlobe from './useSpinGlobe'

import { z } from 'zod'

const callDataSchema = z.object({
  proof: z.string(),
  instances: z.array(z.string()),
})

type CallData = z.infer<typeof callDataSchema>

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

  async function getNextPosFromHub() {
    let initialPos_str = [...position]
    const artifactId = '596654f8-5562-454b-a6d1-41a93a3e021b'
    const inputFile = `{"input_data": [[${initialPos_str[0]}, ${initialPos_str[1]}, ${initialPos_str[2]}, ${initialPos_str[3]}]]}`

    // Initiate Proof
    const { id } = await hub.initiateProof({
      artifactId,
      inputFile,
      url,
    })

    // Get Proof
    let resp = await hub.getProof({ id, url })

    // Wait for proof to be ready
    while (resp.status !== 'SUCCESS') {
      await new Promise((resolve) => setTimeout(resolve, 2_000))
      resp = await hub.getProof({ id, url })
    }

    // safeParse todo
    const calldata = callDataSchema.parse({
      proof: resp?.proof,
      instances: resp?.instances,
    })

    // Get next position matrix from ZK proof instances
    const nextPos_num = resp?.instances
      ?.slice(-4)
      .map((instance) => feltToFloat(instance))
      .map((instance) => deScale(instance, 14))

    // Convert to float / number; for math
    const initialPos_num = initialPos_str.map((v: string) => parseFloat(v))

    // Validate nextPos_num
    if (!nextPos_num) {
      throw new Error('nextPos_num is undefined')
    }

    for (let v of nextPos_num) {
      if (!v) {
        throw new Error('v is undefined')
      }
    }

    const phase = calcPhase(initialPos_num, nextPos_num)

    // new pos matrix
    const newPos_str = nextPos_num?.map((v) => String(v))

    if (!write) {
      throw new Error('write is undefined')
    }

    writeToVerifier(calldata)

    setPosition([...newPos_str])
    setDTheta(phase)
  }

  function writeToVerifier(calldata: CallData) {
    if (!write) {
      throw new Error('write is undefined')
    }
    write({ args: [calldata.proof, calldata.instances] })
  }

  function calcPhase(initPos: number[], nextPos: number[]) {
    const dTheta = Math.acos(
      (initPos[0] * nextPos[0] + initPos[1] * nextPos[1]) /
        (Math.sqrt(initPos[0] ** 2 + initPos[1] ** 2) *
          Math.sqrt(nextPos[0] ** 2 + nextPos[1] ** 2))
    )

    return dTheta
  }

  const theta = useSpinGlobe(dTheta, verified, () => setVerified(false))

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
          theta={theta}
          dTheta={dTheta}
          verified={verified}
          resetVerified={() => setVerified(false)}
        />
      </Canvas>
      <div className=' absolute bottom-12 w-full flex justify-center'>
        <button
          className='p-8 py-4 bg-cyan-400 text-white font-bold text-xl border-2 border-white rounded-lg'
          // onClick={spin}
          onClick={getNextPosFromHub}
        >
          Rotate
        </button>
      </div>
    </>
  )
}
