import { LEVEL_TILE_SIZE } from '~const/world/level';
import {
  MovementDirection,
  PlayerUpgrade,
  PlayerUpgradeData,
} from '~type/world/entities/player';

import { DIFFICULTY } from '../difficulty';

export const PLAYER_TILE_SIZE = {
  width: 16,
  height: 16,
  gamut: 4,
};

const {
  RIGHT, LEFT, UP, DOWN, NONE,
} = MovementDirection;

export const PLAYER_UPGRADES: Record<PlayerUpgrade, PlayerUpgradeData> = {
  [PlayerUpgrade.MAX_HEALTH]: {
    label: 'Maximum health',
    description: 'Grow health of player and assistant',
    experience: DIFFICULTY.PLAYER_HEALTH_EXPERIENCE_TO_UPGRADE,
    maxLevel: 10,
  },
  [PlayerUpgrade.SPEED]: {
    label: 'Movement speed',
    description: 'Grow speed of player and assistant',
    experience: DIFFICULTY.PLAYER_SPEED_EXPERIENCE_TO_UPGRADE,
    maxLevel: 10,
  },
  [PlayerUpgrade.BUILD_AREA]: {
    label: 'Build area',
    description: 'Grow radius of build area',
    experience: DIFFICULTY.BUILDER_BUILD_AREA_EXPERIENCE_TO_UPGRADE,
    maxLevel: 10,
  },
  [PlayerUpgrade.ASSISTANT]: {
    label: 'Assistant strength',
    description: 'Grow damage, radius and speed attack',
    experience: DIFFICULTY.ASSISTANT_EXPERIENCE_TO_UPGRADE,
    maxLevel: 10,
  },
};

export const PLAYER_MOVE_DIRECTIONS = {
  [`${LEFT}|${UP}`]: 180 + LEVEL_TILE_SIZE.deg,
  [`${LEFT}|${NONE}`]: 180,
  [`${LEFT}|${DOWN}`]: 180 - LEVEL_TILE_SIZE.deg,
  [`${NONE}|${UP}`]: 270,
  [`${NONE}|${DOWN}`]: 90,
  [`${RIGHT}|${UP}`]: -LEVEL_TILE_SIZE.deg,
  [`${RIGHT}|${NONE}`]: 0,
  [`${RIGHT}|${DOWN}`]: LEVEL_TILE_SIZE.deg,
};

export const PLAYER_MOVE_ANIMATIONS = {
  [`${LEFT}|${UP}`]: 'move_left_up',
  [`${LEFT}|${NONE}`]: 'move_left',
  [`${LEFT}|${DOWN}`]: 'move_left_down',
  [`${NONE}|${UP}`]: 'move_up',
  [`${NONE}|${DOWN}`]: 'move_down',
  [`${RIGHT}|${UP}`]: 'move_right_up',
  [`${RIGHT}|${NONE}`]: 'move_right',
  [`${RIGHT}|${DOWN}`]: 'move_right_down',
};
