import * as PIXI from 'pixi.js';
import { Enemy } from './Enemy';
import { AssetManager } from '../core/AssetManager';
import { ExperienceManager } from './ExperienceManager';
import { TreasureManager } from './TreasureManager';
import { EffectManager } from '../core/EffectManager';

export class EnemyManager {
    private enemies: Enemy[] = [];
    private container: PIXI.Container;
    private experienceManager: ExperienceManager;
    private treasureManager: TreasureManager;
    private spawnTimer: number = 0;
    private spawnInterval: number = 1000; // ms
    private enemyIdCounter: number = 0;

    constructor(container: PIXI.Container, experienceManager: ExperienceManager, treasureManager: TreasureManager) {
        this.container = container;
        this.experienceManager = experienceManager;
        this.treasureManager = treasureManager;
    }

    public update(delta: number, player: PIXI.Point) {
        // Update all enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(delta, player);

            if (enemy.isDead()) {
                EffectManager.createExplosion(enemy.position);
                this.experienceManager.spawnOrb(enemy.position, 1);

                // 20% chance to drop a treasure chest
                if (Math.random() < 0.2) {
                    this.treasureManager.spawnChest(enemy.position);
                }

                this.container.removeChild(enemy);
                this.enemies.splice(i, 1);
            }
        }

        // Spawn new enemies
        this.spawnTimer += delta * 16.66; // Approximate ms
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy();
        }
    }

    private spawnEnemy() {
        const enemyTexture = AssetManager.getTexture('enemy');
        if (!enemyTexture) return;

        const enemy = new Enemy(enemyTexture, this.enemyIdCounter++);

        const screen = (this.container.parent as any)?.renderer.screen;
        if (!screen) return;

        // Spawn at a random position outside the screen
        const side = Math.floor(Math.random() * 4);
        const margin = 50;
        switch (side) {
            case 0: // Top
                enemy.x = Math.random() * screen.width;
                enemy.y = -margin;
                break;
            case 1: // Right
                enemy.x = screen.width + margin;
                enemy.y = Math.random() * screen.height;
                break;
            case 2: // Bottom
                enemy.x = Math.random() * screen.width;
                enemy.y = screen.height + margin;
                break;
            case 3: // Left
                enemy.x = -margin;
                enemy.y = Math.random() * screen.height;
                break;
        }

        this.enemies.push(enemy);
        this.container.addChild(enemy);
    }

    public getEnemies(): Enemy[] {
        return this.enemies;
    }
}
