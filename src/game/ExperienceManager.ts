import * as PIXI from 'pixi.js';
import { ExperienceOrb } from './ExperienceOrb';
import { AssetManager } from '../core/AssetManager';
import { Player } from './Player';

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

    public update(delta: number, player: Player) {
        for (let i = this.orbs.length - 1; i >= 0; i--) {
            const orb = this.orbs[i];

            // Simple collision detection
            const dx = player.x - orb.x;
            const dy = player.y - orb.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (player.width / 2) + (orb.width / 2)) {
                orb.onPickup();
                this.orbs.splice(i, 1);
            }
        }
    }

    public getOrbs(): ExperienceOrb[] {
        return this.orbs;
    }
}
