import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import cn from 'classnames'
import React, { FC, useEffect, useState } from 'react'
import { useWalletAddress } from '~hooks/useWalletAddress'
import { formatWallet } from '~lib/utils'
import { Menu } from '~scene/menu/interface/styles'

export const ConnectWallet: FC = () => {
  const [isConnected, setIsConnected] = useState(false)

  const { publicKey, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const setWallet = useWalletAddress((s) => s.setWallet)

  const connect = () => {
    if (connected) {
      setIsConnected(true)
      return
    }

    setVisible(true)
  }

  useEffect(() => {
    setIsConnected(connected)

    publicKey && setWallet(publicKey)
  }, [publicKey])

  return (
    <Menu.Item
      onClick={connect}
      className={cn({
        active: isConnected,
      })}>
      {connected ? formatWallet(publicKey.toString()) : 'Connect Wallet'}
    </Menu.Item>
  )
}
