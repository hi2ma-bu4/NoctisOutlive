// src/game/bosses/HydraBoss.ts

import { BaseBoss } from '../BaseBoss';
import * as PIXI from 'pixi.js';

export class HydraBoss extends BaseBoss {

    protected useAbility(ability: string, player: import('../Player').Player): void {
        switch (ability) {
            case 'multi-attack':
                this.multiAttack(player.position);
                break;
            case 'regenerate':
                this.regenerate();
                break;
        }
    }

    private multiAttack(playerPosition: PIXI.Point): void {
        console.log(`${this.stats.type} uses Multi-Attack!`);
        const numProjectiles = 3;
        for (let i = 0; i < numProjectiles; i++) {
            const direction = new PIXI.Point(playerPosition.x - this.x, playerPosition.y - this.y);
            const angle = Math.atan2(direction.y, direction.x);
            const spread = Math.PI / 8; // 22.5 degrees
            const newAngle = angle + (i - 1) * spread;
            const newDirection = new PIXI.Point(Math.cos(newAngle), Math.sin(newAngle));

            this.spawnProjectileCallback(this.position, newDirection, this.stats.attack, 3, 5 * 60); // 5 second lifespan
        }
    }

    private regenerate(): void {
        console.log(`${this.stats.type} regenerates!`);
        const healAmount = this.stats.health * 0.1; // Heal 10% of max health
        this.currentHealth = Math.min(this.stats.health, this.currentHealth + healAmount);
    }
}
