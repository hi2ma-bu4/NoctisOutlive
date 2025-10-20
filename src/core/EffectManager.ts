import * as PIXI from 'pixi.js';
import { Particle } from '../game/effects/Particle';
import { AssetManager } from './AssetManager';

export class EffectManager {
    private static particles: Particle[] = [];
    private static container: PIXI.Container;

    public static init(container: PIXI.Container) {
        this.container = container;
    }

    public static update(delta: number) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(delta);
            if (particle.destroyed) {
                this.particles.splice(i, 1);
            }
        }
    }

    public static createExplosion(position: PIXI.Point, count: number = 10) {
        const particleTexture = AssetManager.getTexture('particle');
        if (!particleTexture) return;

        for (let i = 0; i < count; i++) {
            const particle = new Particle(particleTexture, position);
            this.particles.push(particle);
            this.container.addChild(particle);
        }
    }
}
