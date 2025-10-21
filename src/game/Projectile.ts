import * as PIXI from 'pixi.js';

import * as PIXI from 'pixi.js';
import { BaseEnemy } from './BaseEnemy';

export class Projectile extends PIXI.Sprite {
    public id: number;
    public velocity: PIXI.Point;
    public damage: number;
    public pierce: number;
    public lifespan: number; // in frames

    private enemiesHit: Set<number> = new Set();

    constructor(
        texture: PIXI.Texture,
        id: number,
        damage: number,
        speed: number,
        direction: PIXI.Point,
        lifespan: number, // in seconds
        pierce: number
    ) {
        super(texture);
        this.id = id;
        this.anchor.set(0.5);
        this.damage = damage;
        this.pierce = pierce;
        this.lifespan = lifespan * 60; // Convert seconds to frames

        this.velocity = new PIXI.Point(direction.x * speed, direction.y * speed);
    }

    public update(delta: number): void {
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
        this.lifespan -= delta;
    }

    public hasHit(enemyId: number): boolean {
        return this.enemiesHit.has(enemyId);
    }

    public registerHit(enemyId: number): void {
        this.enemiesHit.add(enemyId);
        this.pierce--;
    }

    public shouldBeDestroyed(): boolean {
        return this.pierce <= 0 || this.lifespan <= 0;
    }
}
