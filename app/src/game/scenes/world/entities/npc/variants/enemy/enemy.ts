import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import { ENEMY_PATH_BREAKPOINT, ENEMY_TEXTURE_META } from '~const/world/entities/enemy';
import { NPC } from '~entity/npc';
import { registerSpriteAssets } from '~lib/assets';
import { progression } from '~lib/utils';
import { Effect, Particles } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { EffectTexture, ParticlesType } from '~type/world/effects';
import { IBuilding } from '~type/world/entities/building';
import {
  IEnemyTarget, EnemyData, EnemyTexture, IEnemy,
} from '~type/world/entities/npc/enemy';
import { TileType } from '~type/world/level';

export class Enemy extends NPC implements IEnemy {
  private might: number;

  private freezeTimer: Nullable<Phaser.Time.TimerEvent> = null;

  constructor(scene: IWorld, {
    positionAtMatrix, texture, multipliers = {},
  }: EnemyData) {
    super(scene, {
      texture,
      positionAtMatrix,
      frameRate: ENEMY_TEXTURE_META[texture].frameRate,
      pathFindTriggerDistance: ENEMY_PATH_BREAKPOINT,
      health: progression(
        DIFFICULTY.ENEMY_HEALTH * (multipliers.health ?? 1.0) * scene.game.getDifficultyMultiplier(),
        DIFFICULTY.ENEMY_HEALTH_GROWTH,
        scene.wave.number,
      ),
      damage: progression(
        DIFFICULTY.ENEMY_DAMAGE * (multipliers.damage ?? 1.0) * scene.game.getDifficultyMultiplier(),
        DIFFICULTY.ENEMY_DAMAGE_GROWTH,
        scene.wave.number,
      ),
      speed: progression(
        DIFFICULTY.ENEMY_SPEED * (multipliers.speed ?? 1.0),
        DIFFICULTY.ENEMY_SPEED_GROWTH,
        scene.wave.number,
      ),
    });
    scene.add.existing(this);
    scene.entityGroups.enemies.add(this);

    this.gamut = ENEMY_TEXTURE_META[texture].size.gamut;
    this.might = (
      (multipliers.health ?? 1.0)
      + (multipliers.damage ?? 1.0)
      + (multipliers.speed ?? 1.0)
    ) / 3;

    const scale = ENEMY_TEXTURE_META[texture].scale ?? 1.0;
    const offset = scale * 2;

    this.body.setCircle((this.width / 2) - offset, offset, offset);
    this.setScale(scale);

    this.addHealthIndicator(0xdb2323, true);

    this.setTilesCollision([TileType.BUILDING], (tile: IBuilding) => {
      this.attack(tile);
    });

    if (this.visible) {
      this.addSpawnEffect();
    }

    this.scene.physics.add.collider(this, this.scene.entityGroups.npc);

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.freezeTimer) {
        this.freezeTimer.destroy();
      }
    });
  }

  public update() {
    super.update();

    if (this.isPathPassed) {
      this.moveTo(this.scene.player.getPositionOnGround());
    }
  }

  public freeze(duration: number) {
    const finalDuration = duration / this.scale;

    this.calmDown(finalDuration);

    if (!this.visible) {
      return;
    }

    new Particles(this, {
      type: ParticlesType.GLOW,
      duration: 250,
      positionAtWorld: this.getBodyOffset(),
      params: {
        follow: this,
        lifespan: { min: 100, max: 150 },
        scale: { start: 0.2, end: 0.1 },
        speed: 80,
      },
    });

    if (this.freezeTimer) {
      this.freezeTimer.elapsed = 0;
    } else {
      this.setTint(0x00a8ff);
      this.freezeTimer = this.scene.time.delayedCall(finalDuration, () => {
        this.clearTint();
        this.freezeTimer = null;
      });
    }
  }

  public attack(target: IEnemyTarget) {
    if (this.isCalmed() || target.live.isDead()) {
      return;
    }

    target.live.damage(this.damage);

    this.calmDown(1000);
  }

  public onDead() {
    const experience = progression(
      DIFFICULTY.ENEMY_KILL_EXPERIENCE * this.might,
      DIFFICULTY.ENEMY_KILL_EXPERIENCE_GROWTH,
      this.scene.wave.number,
    );

    this.scene.player.giveExperience(experience);
    this.scene.player.incrementKills();

    this.addBloodEffect();

    super.onDead();
  }

  private addBloodEffect() {
    if (
      !this.currentGroundTile?.biome.solid
      || !this.scene.game.isSettingEnabled(GameSettings.BLOOD_ON_MAP)
    ) {
      return;
    }

    const effect = new Effect(this.scene, {
      texture: EffectTexture.BLOOD,
      position: this.getPositionOnGround(),
      permanentFrame: Phaser.Math.Between(0, 3),
    });

    this.currentGroundTile.mapEffects?.push(effect);
  }

  private addSpawnEffect() {
    const originalScale = this.scale;

    this.calmDown(750);

    this.container.setAlpha(0.0);
    this.setScale(0.1);
    this.scene.tweens.add({
      targets: this,
      scale: originalScale,
      duration: 750,
      onComplete: () => {
        this.container.setAlpha(1.0);
      },
    });

    if (this.visible) {
      new Particles(this, {
        type: ParticlesType.GLOW,
        positionAtWorld: this,
        duration: 500,
        params: {
          lifespan: { min: 150, max: 250 },
          scale: { start: 0.25, end: 0.0 },
          speed: 100,
          quantity: 2,
          tint: 0x000,
        },
      });
    }
  }
}

registerSpriteAssets(EnemyTexture, (texture: EnemyTexture) => ENEMY_TEXTURE_META[texture].size);
