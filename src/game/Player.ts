import * as PIXI from 'pixi.js';
import { InputManager } from '../core/InputManager';
import { Backpack } from './Backpack';

export class Player extends PIXI.Sprite {
    private speed: number = 5;
    public backpack: Backpack;

    constructor(texture: PIXI.Texture) {
        super(texture);
        this.anchor.set(0.5);
        this.backpack = new Backpack(5, 5);
    }

    public update(delta: number) {
        let dx = 0;
        let dy = 0;

        if (InputManager.isKeyDown('KeyA') || InputManager.isKeyDown('ArrowLeft')) {
            dx -= 1;
        }
        if (InputManager.isKeyDown('KeyD') || InputManager.isKeyDown('ArrowRight')) {
            dx += 1;
        }
        if (InputManager.isKeyDown('KeyW') || InputManager.isKeyDown('ArrowUp')) {
            dy -= 1;
        }
        if (InputManager.isKeyDown('KeyS') || InputManager.isKeyDown('ArrowDown')) {
            dy += 1;
        }

        // Normalize diagonal movement
        if (dx !== 0 || dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        this.x += dx * this.speed * delta;
        this.y += dy * this.speed * delta;
    }
}
