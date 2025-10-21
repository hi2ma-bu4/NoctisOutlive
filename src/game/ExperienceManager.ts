// src/game/ExperienceManager.ts

import * as PIXI from 'pixi.js';
import { ExperienceOrb } from './ExperienceOrb';
import { AssetManager } from '../core/AssetManager';
import { Player } from './Player';
import { SoundManager } from '../core/SoundManager';

export class ExperienceManager {
    private orbs: ExperienceOrb[] = [];
    private container: PIXI.Container;

    constructor(container: PIXI.Container) {
        this.container = container;
    }

    public spawnOrb(position: PIXI.Point, value: number) {
        const orbTexture = AssetManager.getTexture('exp_orb');
        if (!orbTexture) return;

        const orb = new ExperienceOrb(orbTexture, value);
        orb.x = position.x;
        orb.y = position.y;

        this.orbs.push(orb);
        this.container.addChild(orb);
    }

    public update(delta: number) {
        // Orb-specific updates (e.g., animations, movement) can go here
        // Collision detection is now handled by CollisionManager
    }

    public collectOrb(orbId: number): void {
        const orbIndex = this.orbs.findIndex(o => o.id === orbId);
        if (orbIndex > -1) {
            const orb = this.orbs[orbIndex];
            orb.onPickup();
            this.orbs.splice(orbIndex, 1);
            SoundManager.playSfx('sfx_item_pickup', 0.8); // Play at slightly lower volume
        }
    }

    public getOrbs(): ExperienceOrb[] {
        return this.orbs;
    }
}
