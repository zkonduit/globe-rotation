// useHubDataFetcher.ts
import { useState } from 'react'
import hub from '@ezkljs/hub'
import { z } from 'zod'

const callDataSchema = z.object({
  proof: z.string(),
  instances: z.array(z.string()),
})

type CallData = z.infer<typeof callDataSchema>

const useHubDataFetcher = (position: string[], url: string) => {
  const [calculatedPhase, setCalculatedPhase] = useState<number>(0)
  const [nextPosition, setNextPosition] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const deScale = (instance: bigint, scale: number): number =>
    Number(instance) / 2 ** scale

  const feltToFloat = (instance: string): bigint => {
    const p = BigInt(
      '0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001'
    )
    const bigInst = BigInt(instance)
    return bigInst > BigInt(2) ** BigInt(128) - BigInt(1)
      ? bigInst - p
      : bigInst
  }

  const calcPhase = (initPos: number[], nextPos: number[]): number => {
    return Math.acos(
      (initPos[0] * nextPos[0] + initPos[1] * nextPos[1]) /
        (Math.sqrt(initPos[0] ** 2 + initPos[1] ** 2) *
          Math.sqrt(nextPos[0] ** 2 + nextPos[1] ** 2))
    )
  }

  const getNextPosFromHub = async () => {
    console.log('getNextPosFromHub')
    setLoading(true)
    try {
      const artifactId = '596654f8-5562-454b-a6d1-41a93a3e021b'
      const inputFile = `{"input_data": [[${position.join(', ')}]]}`

      const { id } = await hub.initiateProof({
        artifactId,
        inputFile,
        url,
      })

      let resp = await hub.getProof({ id, url })
      while (resp.status !== 'SUCCESS') {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        resp = await hub.getProof({ id, url })
      }

      const calldata: CallData = callDataSchema.parse({
        proof: resp?.proof,
        instances: resp?.instances,
      })

      const nextPos_num = calldata.instances
        ?.slice(-4)
        .map((instance) => feltToFloat(instance))
        .map((instance) => deScale(instance, 14))
        .map(String)

      const initialPos_num = position.map((v) => parseFloat(v))
      const nextPos_float = nextPos_num.map((v) => parseFloat(v))

      const phase = calcPhase(initialPos_num, nextPos_float)

      console.log('phase', phase)

      setNextPosition(nextPos_num)
      setCalculatedPhase(phase)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { nextPosition, calculatedPhase, loading, error, getNextPosFromHub }
}

export default useHubDataFetcher
