'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { optimismGoerli, optimism } from 'wagmi/chains'
// import { optimismGoerli } from 'wagmi/chains'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'

const { chains, publicClient } = configureChains(
  [optimism, optimismGoerli],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Globe Rotation',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

import App from './components/App'

export default function Home() {
  return (
    <main className='h-full'>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </main>
  )
}
