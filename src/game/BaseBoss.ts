// src/game/BaseBoss.ts

import { BaseEnemy } from './BaseEnemy';
import { BossSpawn } from './data/StageData';
import * as PIXI from 'pixi.js';

export abstract class BaseBoss extends BaseEnemy {
    protected bossData: BossSpawn;
    protected spawnEnemyCallback: (enemyType: string, position: PIXI.Point) => void;
    private abilityCooldowns: Map<string, number> = new Map();
    private phase: number = 1;

    protected spawnProjectileCallback: (position: PIXI.Point, direction: PIXI.Point, damage: number, speed: number, lifespan: number) => void;

    constructor(
        enemyType: string,
        id: number,
        bossData: BossSpawn,
        // Optional callback to allow bosses to spawn minions
        spawnEnemyCallback: (enemyType: string, position: PIXI.Point) => void = () => {},
        spawnProjectileCallback: (position: PIXI.Point, direction: PIXI.Point, damage: number, speed: number, lifespan: number) => void = () => {}
    ) {
        super(enemyType, id);
        this.bossData = bossData;
        this.spawnEnemyCallback = spawnEnemyCallback;
        this.spawnProjectileCallback = spawnProjectileCallback;

        // Apply health multiplier
        this.stats.health *= this.bossData.healthMultiplier;
        this.currentHealth = this.stats.health;

        // Initialize ability cooldowns
        this.bossData.abilities.forEach(ability => {
            this.abilityCooldowns.set(ability, 0);
        });
    }

    public override update(delta: number, playerPosition: PIXI.Point): void {
        super.update(delta, playerPosition);

        this.updateAI(delta, playerPosition);
        this.updateAbilities(delta, playerPosition);
        this.checkPhaseTransition();
    }

    /**
     * Updates the boss's main AI behavior based on its aiType.
     * This can be overridden by specific boss implementations for more unique patterns.
     */
    protected updateAI(delta: number, playerPosition: PIXI.Point): void {
        switch (this.bossData.aiType) {
            case 'charger':
                // Example: Charge at the player periodically
                break;
            case 'caster':
                // Example: Keep distance and cast spells
                break;
            case 'default':
            default:
                // Default behavior is just to move towards the player (handled by BaseEnemy)
                break;
        }
    }

    /**
     * Updates and potentially triggers special abilities.
     */
    protected updateAbilities(delta: number, playerPosition: PIXI.Point): void {
        this.abilityCooldowns.forEach((cooldown, ability) => {
            if (cooldown > 0) {
                this.abilityCooldowns.set(ability, cooldown - delta);
            } else {
                this.useAbility(ability, playerPosition);
                // Reset cooldown (this should be defined per-ability)
                this.abilityCooldowns.set(ability, 10 * 60); // e.g., 10 seconds
            }
        });
    }

    /**
     * Placeholder for using a special ability.
     * To be implemented by specific boss classes.
     */
    protected abstract useAbility(ability: string, playerPosition: PIXI.Point): void;

    /**
     * Checks if the boss should transition to a new phase (e.g., "enrage" mode).
     */
    private checkPhaseTransition(): void {
        if (this.phase === 1 && this.currentHealth / this.stats.health < 0.5) {
            this.phase = 2;
            this.onPhaseTransition(2);
        }
    }

    /**
     * Called when a phase transition occurs.
     * Can be used to change attack patterns, speed, etc.
     */
    protected onPhaseTransition(newPhase: number): void {
        console.log(`${this.stats.name} has entered phase ${newPhase}!`);
        // Example: increase speed and damage
        this.stats.speed *= 1.5;
        this.stats.damage *= 1.2;
    }
}
