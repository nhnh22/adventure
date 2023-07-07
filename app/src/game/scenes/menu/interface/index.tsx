import cn from 'classnames'
import React, { useContext, useMemo, useState } from 'react'

import { GameContext } from '~lib/interface'
import { MenuItem } from '~type/menu'

import { useWalletAddress } from '~hooks/useWalletAddress'
import { ConnectWallet } from '~web3/connect-wallet'
import { WalletAdapter } from '~web3/wallet-adapter'
import { ComponentAbout } from './content/about'
import { ComponentControls } from './content/controls'
import { ComponentSettings } from './content/settings'
import { Content, Line, Logotype, Menu, Overlay, Sidebar, Wrapper } from './styles'

export const MenuUI: React.FC = () => {
  const game = useContext(GameContext)
  const [currentContent, setCurrentContent] = useState('About')

  const wallet = useWalletAddress((s) => s.wallet)

  const menuItems = useMemo<MenuItem[]>(
    () => [
      ...(wallet
        ? game.onPause
          ? [
              {
                label: 'Continue',
                onClick: () => {
                  game.resumeGame()
                },
              },
              {
                label: 'Restart',
                onClick: () => {
                  // eslint-disable-next-line no-alert
                  if (window.confirm('Do you confirm start new game?')) {
                    game.restartGame()
                  }
                },
              },
            ]
          : [
              {
                label: 'New game',
                onClick: () => {
                  game.startGame()
                },
              },
            ]
        : []),
      {
        label: 'Settings',
        onClick: () => setCurrentContent('Settings'),
      },
      {
        label: 'About',
        onClick: () => setCurrentContent('About'),
      },
      {
        label: 'Controls',
        onClick: () => setCurrentContent('Controls'),
      },
    ],
    [wallet],
  )

  const Component = useMemo(() => {
    switch (currentContent) {
      case 'Settings':
        return <ComponentSettings disabled={game.onPause} />
      case 'About':
        return <ComponentAbout />
      case 'Controls':
        return <ComponentControls />
    }
  }, [currentContent])

  const handleClick = (item: MenuItem) => {
    item.onClick()
  }

  return (
    <WalletAdapter>
      <Overlay>
        <Wrapper>
          <Sidebar>
            <Logotype>Adventure</Logotype>
            <Menu>
              <ConnectWallet />
              {menuItems.map((item) => (
                <Menu.Item
                  key={item.label}
                  onClick={() => handleClick(item)}
                  className={cn({
                    active: item.label === currentContent,
                  })}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          </Sidebar>
          <Line />
          <Content>
            <Content.Title>{currentContent}</Content.Title>
            <Content.Wrapper>{Component}</Content.Wrapper>
          </Content>
        </Wrapper>
      </Overlay>
    </WalletAdapter>
  )
}

MenuUI.displayName = 'MenuUI'
