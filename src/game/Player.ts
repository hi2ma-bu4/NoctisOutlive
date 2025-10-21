import * as PIXI from 'pixi.js';
import { InputManager } from '../core/InputManager';
import { Backpack } from './Backpack';
import { ItemData } from './data/ItemData';

export class Player extends PIXI.Sprite {
    // Player Stats
    public speed: number = 5;
    public maxHealth: number = 100;
    public currentHealth: number = 100;
    public damageMultiplier: number = 1.0;
    public pickupRadius: number = 100;

    public backpack: Backpack;

    constructor(texture: PIXI.Texture) {
        super(texture);
        this.anchor.set(0.5);
        this.backpack = new Backpack(5, 5); // Initial backpack size
    }

    public applyItemEffects(itemData: ItemData): void {
        console.log(`Applying effects for ${itemData.name}`);
        itemData.effects.forEach(effect => {
            switch (effect.type) {
                case 'health_increase':
                    this.maxHealth += effect.value;
                    this.currentHealth += effect.value; // Heal for the same amount
                    console.log(`Max health increased to ${this.maxHealth}`);
                    break;
                case 'damage_boost':
                    this.damageMultiplier += effect.value;
                    console.log(`Damage multiplier increased to ${this.damageMultiplier}`);
                    break;
                case 'backpack_expand':
                    const { width, height } = effect.value;
                    this.backpack.expandGrid(height, width);
                    console.log(`Backpack expanded by ${width}x${height}`);
                    break;
                case 'add_weapon':
                    // This will be handled by the WeaponManager,
                    // but we can log it here for now.
                    console.log(`Weapon unlocked: ${effect.value}`);
                    break;
                default:
                    console.warn(`Unknown item effect type: ${effect.type}`);
            }
        });
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
