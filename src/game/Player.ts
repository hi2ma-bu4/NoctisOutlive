import * as PIXI from 'pixi.js';
import { InputManager } from '../core/InputManager';
import { SoundManager } from '../core/SoundManager';
import { Backpack } from './Backpack';
import { ItemData } from './data/ItemData';
import { PlayerData } from '../core/PlayerData';

export class Player extends PIXI.Sprite {
    // Player Stats
    public speed: number = 5;
    public maxHealth: number = 100;
    public currentHealth: number = 100;
    public damageMultiplier: number = 1.0;
    public pickupRadius: number = 100;

    // Experience and Leveling
    public level: number = 1;
    public experience: number = 0;
    public experienceToNextLevel: number = 100;

    // Invincibility
    private isInvincible: boolean = false;
    private invincibilityTimer: number = 0;
    private readonly invincibilityDuration: number = 2; // in seconds
    private readonly flashInterval: number = 0.1; // in seconds
    private flashTimer: number = 0;

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
                    // This is now handled by collecting fragments
                    const playerData = PlayerData.getInstance();
                    if (playerData.addBackpackFragment()) {
                        // Optionally, play a sound or show an effect on successful expansion
                        SoundManager.playSfx('sfx_level_up', 1.1); // Reuse level up sound
                    }
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

    public addExperience(amount: number): boolean {
        this.experience += amount;
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
            return true; // Leveled up
        }
        return false; // Did not level up
    }

    private levelUp(): void {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        // Increase exp requirement for next level, e.g., by 20%
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.2);
        console.log(`Player leveled up to level ${this.level}! Next level at ${this.experienceToNextLevel} exp.`);
    }

    public takeDamage(amount: number): void {
        if (this.isInvincible) {
            return;
        }

        this.currentHealth -= amount;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }

        console.log(`Player took ${amount} damage, health is now ${this.currentHealth}`);

        // Start invincibility
        this.isInvincible = true;
        this.invincibilityTimer = this.invincibilityDuration;
        this.flashTimer = this.flashInterval;
        this.alpha = 0.5; // Start flashing

        SoundManager.playSfx('sfx_player_hit', 0.8);
    }

    public isDead(): boolean {
        return this.currentHealth <= 0;
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

        // Handle invincibility timer and flashing
        if (this.isInvincible) {
            this.invincibilityTimer -= delta / 60; // Assuming 60 FPS
            this.flashTimer -= delta / 60;

            if (this.flashTimer <= 0) {
                this.alpha = this.alpha === 1.0 ? 0.5 : 1.0;
                this.flashTimer = this.flashInterval;
            }

            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
                this.alpha = 1.0; // Reset alpha
            }
        }
    }
}
