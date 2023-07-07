import React from 'react'

import { ComponentAvatar } from './avatar'
import { ComponentExperience } from './experience'
import { ComponentHealth } from './health'
import { ComponentResources } from './resources'
import { Group, Space, Wrapper } from './styles'
import { ComponentUpgrades } from './upgrades'
import { ComponentWallet } from './wallet'

export const ComponentHUD: React.FC = () => (
  <Wrapper>
    <Group>
      <ComponentAvatar />
      <ComponentHealth />
      <Space />
      <ComponentUpgrades />
    </Group>
    <Group>
      <ComponentWallet />
      <Space />
      <ComponentExperience />
      <Space />
      <ComponentResources />
    </Group>
  </Wrapper>
)

ComponentHUD.displayName = 'ComponentHUD'
