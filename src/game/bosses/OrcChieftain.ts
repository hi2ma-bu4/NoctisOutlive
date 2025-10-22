// src/game/bosses/OrcChieftain.ts
import { BaseBoss } from '../BaseBoss';
import { BossSpawn } from '../data/StageData';
import * as PIXI from 'pixi.js';
import { EffectManager } from '../../core/EffectManager';

export class OrcChieftain extends BaseBoss {
    private chargeSpeed: number = 0;
    private chargeDuration: number = 0;
    private chargeCooldown: number = 10 * 60; // 10 seconds
    private stompCooldown: number = 15 * 60; // 15 seconds

    constructor(
        enemyType: string,
        id: number,
        bossData: BossSpawn,
        spawnEnemyCallback: (enemyType: string, position: PIXI.Point) => void,
        spawnProjectileCallback: (position: PIXI.Point, direction: PIXI.Point, damage: number, speed: number, lifespan: number) => void
    ) {
        super(enemyType, id, bossData, spawnEnemyCallback, spawnProjectileCallback);
        this.chargeSpeed = this.stats.speed * 3;
    }

    public override update(delta: number, player: import('../Player').Player): void {
        if (this.chargeDuration > 0) {
            this.chargeDuration -= delta;
            // The actual movement is handled by the velocity set during the charge ability
        } else {
            // Revert to normal speed and behavior
            this.velocity.set(0, 0);
            super.update(delta, player);
        }
    }

    protected override useAbility(ability: string, player: import('../Player').Player): void {
        switch (ability) {
            case 'charge':
                if (this.abilityCooldowns.get(ability)! <= 0) {
                    this.charge(player.position);
                    this.abilityCooldowns.set(ability, this.chargeCooldown);
                }
                break;
            case 'stomp':
                if (this.abilityCooldowns.get(ability)! <= 0) {
                    this.stomp(player);
                    this.abilityCooldowns.set(ability, this.stompCooldown);
                }
                break;
        }
    }

    private charge(playerPosition: PIXI.Point): void {
        console.log(`${this.stats.name} uses Charge!`);
        const direction = new PIXI.Point(playerPosition.x - this.x, playerPosition.y - this.y);
        const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        if (magnitude > 0) {
            this.velocity.x = (direction.x / magnitude) * this.chargeSpeed;
            this.velocity.y = (direction.y / magnitude) * this.chargeSpeed;
        }
        this.chargeDuration = 2 * 60; // Charge for 2 seconds
    }

    private stomp(player: import('../Player').Player): void {
        console.log(`${this.stats.name} uses Stomp!`);
        const shockwaveRadius = 150;
        EffectManager.createCircularShockwave(this.position, shockwaveRadius);

        const distance = Math.sqrt(
            Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2)
        );

        if (distance <= shockwaveRadius) {
            player.takeDamage(this.damage);
        }
    }
}
