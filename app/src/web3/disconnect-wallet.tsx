import { useWallet } from '@solana/wallet-adapter-react'
import React, { FC } from 'react'
import { useWalletAddress } from '~hooks/useWalletAddress'

import { Setting, Values } from '~scene/menu/interface/content/settings/styles'

export const DisconnectWallet: FC = () => {
  const { disconnect } = useWallet()
  const setWallet = useWalletAddress((s) => s.setWallet)

  const handler = async () => {
    await disconnect()
    setWallet(undefined)
  }

  return (
    <Setting>
      <Setting.Description>Wallet</Setting.Description>
      <Values>
        <Values.Item onClick={handler}>Disconnect</Values.Item>
      </Values>
    </Setting>
  )
}
