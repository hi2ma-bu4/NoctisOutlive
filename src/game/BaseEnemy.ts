// src/game/BaseEnemy.ts

import * as PIXI from 'pixi.js';
import { EnemyStats, EnemyDatabase } from './data/EnemyData';
import { AssetManager } from '../core/AssetManager';

export class BaseEnemy extends PIXI.Sprite {
    public id: number;
    public stats: EnemyStats;
    public health: number;
    public damage: number;

    constructor(enemyType: string, id: number) {
        const stats = EnemyDatabase[enemyType];
        if (!stats) {
            throw new Error(`Enemy type '${enemyType}' not found in EnemyDatabase.`);
        }

        const texture = AssetManager.getTexture(stats.textureKey);
        if (!texture) {
            throw new Error(`Texture '${stats.textureKey}' not found for enemy type '${enemyType}'.`);
        }

        super(texture);

        this.id = id;
        this.stats = { ...stats }; // Create a copy of the stats
        this.health = this.stats.health;
        this.damage = this.stats.attack;

        this.anchor.set(0.5);
        this.scale.set(this.stats.scale);
    }

    public update(delta: number, playerPosition: PIXI.Point): void {
        this.move(delta, playerPosition);
    }

    protected move(delta: number, playerPosition: PIXI.Point): void {
        const dx = playerPosition.x - this.x;
        const dy = playerPosition.y - this.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > 0) {
            const normalizedDx = dx / length;
            const normalizedDy = dy / length;

            this.x += normalizedDx * this.stats.speed * delta;
            this.y += normalizedDy * this.stats.speed * delta;
        }
    }

    public takeDamage(amount: number): void {
        this.health -= amount;
    }

    public isDead(): boolean {
        return this.health <= 0;
    }
}
