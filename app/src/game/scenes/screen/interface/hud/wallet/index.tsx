import React from 'react'

import { useWalletAddress } from '~hooks/useWalletAddress'
import { formatWallet } from '~lib/utils'
import { ComponentWidget } from '../widget'

export const ComponentWallet: React.FC = () => {
  const wallet = useWalletAddress((s) => s.wallet)

  return <>{wallet && <ComponentWidget icon='experience'>{formatWallet(wallet.toString(), 3)}</ComponentWidget>}</>
}

ComponentWallet.displayName = 'ComponentWallet'
