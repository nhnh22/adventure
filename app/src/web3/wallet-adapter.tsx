import React, { FC, ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { BackpackWalletAdapter, PhantomWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

type Props = {
  children: ReactNode
}
export const WalletAdapter: FC<Props> = ({ children }) => {
  const endpoint = 'https://devnet.helius-rpc.com/?api-key=1ca3907c-c5ea-453d-ba98-45893829c1be'

  const wallets = useMemo(
    () => [new BackpackWalletAdapter(), new PhantomWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
