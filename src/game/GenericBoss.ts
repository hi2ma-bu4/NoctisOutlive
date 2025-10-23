// src/game/GenericBoss.ts

import { BaseBoss } from './BaseBoss';
import { Player } from './Player';
import * as PIXI from 'pixi.js';

export class GenericBoss extends BaseBoss {
    protected useAbility(ability: string, player: Player): void {
        switch (ability) {
            case 'multi-attack':
                this.multiAttack(player);
                break;
            case 'regenerate':
                this.setRegeneration();
                break;
            case 'summon_goblin':
                this.summonMinion('goblin');
                break;
            case 'charge':
                this.charge(player);
                break;
            case 'stomp':
                this.stomp();
                break;
            case 'fireball':
                this.fireball(player);
                break;
            case 'summon_undead':
                this.summonMinion('zombie');
                break;
            default:
                console.warn(`Unknown ability triggered: ${ability}`);
                break;
        }
    }

    private multiAttack(player: Player): void {
        const projectileCount = 5;
        const spreadAngle = Math.PI / 8; // 22.5 degrees

        for (let i = 0; i < projectileCount; i++) {
            const angle = (i - (projectileCount - 1) / 2) * spreadAngle;
            const direction = new PIXI.Point(
                Math.cos(angle) * (player.x - this.x) - Math.sin(angle) * (player.y - this.y),
                Math.sin(angle) * (player.x - this.x) + Math.cos(angle) * (player.y - this.y)
            );
            const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
            direction.x /= length;
            direction.y /= length;

            this.spawnProjectileCallback(this.position, direction, this.stats.attack * 0.5, 5, 120);
        }
    }

    private setRegeneration(): void {
        this.regenerationRate = this.stats.health * 0.02; // Regenerate 2% of max health per second
    }

    private summonMinion(minionType: string): void {
        const spawnPosition = new PIXI.Point(this.x, this.y);
        this.spawnEnemyCallback(minionType, spawnPosition);
    }

    private charge(player: Player): void {
        // Simple charge: quickly move towards the player's last known position
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > 0) {
            const chargeSpeed = this.stats.speed * 3;
            this.x += (dx / length) * chargeSpeed;
            this.y += (dy / length) * chargeSpeed;
        }
    }

    private stomp(): void {
        if (this.collisionManager) {
            const stompRadius = 200; // pixels
            const stompDamage = this.stats.attack * 1.5;
            this.collisionManager.stompAttack(this.position, stompRadius, stompDamage);
            console.log(`${this.stats.type} uses STOMP!`);
        } else {
            console.warn("CollisionManager not available for stomp attack.");
        }
    }

    private fireball(player: Player): void {
        const direction = new PIXI.Point(player.x - this.x, player.y - this.y);
        const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        direction.x /= length;
        direction.y /= length;

        this.spawnProjectileCallback(this.position, direction, this.stats.attack, 6, 180);
    }
}
