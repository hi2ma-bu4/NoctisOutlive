// src/game/BossProjectile.ts

import * as PIXI from 'pixi.js';
import { AssetManager } from '../core/AssetManager';
import { Player } from './Player';

export class BossProjectile extends PIXI.Sprite {
    public id: number;
    public damage: number;
    private speed: number;
    private direction: PIXI.Point;
    private lifespan: number;
    private hitPlayer: boolean = false;

    constructor(
        texture: PIXI.Texture,
        id: number,
        damage: number,
        speed: number,
        direction: PIXI.Point,
        lifespan: number,
    ) {
        super(texture);
        this.id = id;
        this.damage = damage;
        this.speed = speed;
        this.direction = direction;
        this.lifespan = lifespan;
        this.anchor.set(0.5);
    }

    public update(delta: number) {
        this.x += this.direction.x * this.speed * delta;
        this.y += this.direction.y * this.speed * delta;
        this.lifespan -= delta;
    }

    public shouldBeDestroyed(): boolean {
        return this.lifespan <= 0 || this.hitPlayer;
    }

    public registerHit(): void {
        this.hitPlayer = true;
    }
}
