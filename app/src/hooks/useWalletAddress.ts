import { PublicKey } from '@solana/web3.js'
import { create } from 'zustand'

type WalletAddressState = {
  wallet: PublicKey | undefined
  setWallet: (wallet: PublicKey) => void
}

export const useWalletAddress = create<WalletAddressState>()((set) => ({
  wallet: undefined,
  setWallet: (wallet: PublicKey) => set(() => ({ wallet })),
}))
