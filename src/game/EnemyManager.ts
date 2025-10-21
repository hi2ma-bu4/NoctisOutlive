// src/game/EnemyManager.ts

import * as PIXI from 'pixi.js';
import { BaseEnemy } from './BaseEnemy';
import { ExperienceManager } from './ExperienceManager';
import { TreasureManager } from './TreasureManager';
import { EffectManager } from '../core/EffectManager';
import { StageManager } from '../core/StageManager';
import { EnemySpawn, BossSpawn } from './data/StageData';

export class EnemyManager {
    private enemies: BaseEnemy[] = [];
    private container: PIXI.Container;
    private experienceManager: ExperienceManager;
    private treasureManager: TreasureManager;
    private stageTimer: number = 0;
    private enemyIdCounter: number = 0;

    private enemySpawnQueue: EnemySpawn[];
    private bossSpawnQueue: BossSpawn[];

    constructor(container: PIXI.Container, experienceManager: ExperienceManager, treasureManager: TreasureManager) {
        this.container = container;
        this.experienceManager = experienceManager;
        this.treasureManager = treasureManager;

        const stageData = StageManager.getCurrentStage();
        if (!stageData) {
            console.error("EnemyManager: No stage data found.");
            this.enemySpawnQueue = [];
            this.bossSpawnQueue = [];
            return;
        }
        // Clone the arrays to not modify the original data
        this.enemySpawnQueue = [...stageData.enemies].sort((a, b) => a.spawnTime - b.spawnTime);
        this.bossSpawnQueue = [...stageData.bosses].sort((a, b) => a.spawnTime - b.spawnTime);
    }

    public update(delta: number, playerPosition: PIXI.Point) {
        this.stageTimer += delta / 60; // Convert delta frames to seconds

        // Check for enemy spawns
        while (this.enemySpawnQueue.length > 0 && this.stageTimer >= this.enemySpawnQueue[0].spawnTime) {
            const spawnInfo = this.enemySpawnQueue.shift()!;
            for (let i = 0; i < spawnInfo.spawnCount; i++) {
                this.spawnEnemy(spawnInfo.enemyType);
            }
        }

        // Check for boss spawns
        while (this.bossSpawnQueue.length > 0 && this.stageTimer >= this.bossSpawnQueue[0].spawnTime) {
            const bossInfo = this.bossSpawnQueue.shift()!;
            this.spawnEnemy(bossInfo.bossType); // Spawning bosses as regular enemies for now
        }

        // Update all enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(delta, playerPosition);

            if (enemy.isDead()) {
                EffectManager.createExplosion(enemy.position);
                this.experienceManager.spawnOrb(enemy.position, 1);

                // Drop treasure chest based on probability (e.g., 20% for normal, 100% for boss)
                const isBoss = StageManager.getCurrentStage()?.bosses.some(b => b.bossType === enemy.stats.type);
                if (isBoss || Math.random() < 0.2) {
                    this.treasureManager.spawnChest(enemy.position);
                }

                this.container.removeChild(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }

    private spawnEnemy(enemyType: string) {
        try {
            const enemy = new BaseEnemy(enemyType, this.enemyIdCounter++);
            this.setupEnemyPosition(enemy);
            this.enemies.push(enemy);
            this.container.addChild(enemy);
        } catch (error) {
            console.error(`Failed to spawn enemy of type '${enemyType}':`, error);
        }
    }

    private setupEnemyPosition(enemy: BaseEnemy) {
        const screen = (this.container.parent as any)?.renderer.screen;
        if (!screen) return;

        const side = Math.floor(Math.random() * 4);
        const margin = 100;
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
    }

    public getEnemies(): BaseEnemy[] {
        return this.enemies;
    }
}
