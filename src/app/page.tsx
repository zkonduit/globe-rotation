'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
// import { optimismGoerli } from '@wagmi/core/chains'
import { publicProvider } from 'wagmi/providers/public'
import { optimismGoerli, optimism } from 'wagmi/chains'

import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'

const { chains, publicClient } = configureChains(
  // [optimism, optimismGoerli],
  [optimismGoerli],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

import { useCallback, useState } from 'react'
import hub from '@ezkljs/hub'
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
