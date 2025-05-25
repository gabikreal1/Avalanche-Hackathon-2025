import { http, createConfig } from 'wagmi'
import { avalanche, avalancheFuji } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [avalanche, avalancheFuji],
    multiInjectedProviderDiscovery: false,
    connectors: [
        injected({
            target() {
                return {
                    id: 'CoreWallet',
                    name: 'Core',
                    provider: typeof window !== 'undefined' ? window.avalanche as any : undefined,
                }
            },
        }),
    ],
    transports: {
        [avalanche.id]: http(),
        [avalancheFuji.id]: http(),
    },
})

export const SUPPORTED_CHAINS = {
  AVALANCHE: avalanche.id,
  AVALANCHE_FUJI: avalancheFuji.id,
} as const

export const isAvalancheChain = (chainId?: number): boolean => {
  return chainId === SUPPORTED_CHAINS.AVALANCHE || chainId === SUPPORTED_CHAINS.AVALANCHE_FUJI
} 