// src/game/EnemyManager.ts

import * as PIXI from 'pixi.js';
import { BaseEnemy } from './BaseEnemy';
import { BaseBoss } from './BaseBoss';
import { GoblinLeader } from './bosses/GoblinLeader';
import { OrcChieftain } from './bosses/OrcChieftain';
import { HydraBoss } from './bosses/HydraBoss';
import { ExperienceManager } from './ExperienceManager';
import { TreasureManager } from './TreasureManager';
import { EffectManager } from '../core/EffectManager';
import { UIManager } from '../core/UIManager';
import { StageManager } from '../core/StageManager';
import { EnemySpawn, BossSpawn } from './data/StageData';
import { SoundManager } from '../core/SoundManager';
import { BossProjectile } from './BossProjectile';
import { AssetManager } from '../core/AssetManager';

export class EnemyManager {
    private enemies: (BaseEnemy | BaseBoss)[] = [];
    private bossProjectiles: BossProjectile[] = [];
    private container: PIXI.Container;
    private experienceManager: ExperienceManager;
    private treasureManager: TreasureManager;
    private stageTimer: number = 0;
    private enemyIdCounter: number = 0;
    private projectileIdCounter: number = 0;
    private isBossActive: boolean = false;

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

    public update(delta: number, player: Player) {
        this.stageTimer += delta / 60; // Convert delta frames to seconds

        // Update boss projectiles
        for (let i = this.bossProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.bossProjectiles[i];
            projectile.update(delta);

            const dx = projectile.x - player.x;
            const dy = projectile.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < player.width / 2) {
                player.takeDamage(projectile.damage);
                projectile.registerHit();
            }

            if (projectile.shouldBeDestroyed()) {
                this.container.removeChild(projectile);
                this.bossProjectiles.splice(i, 1);
            }
        }

        // Check for enemy spawns only if a boss is not active
        if (!this.isBossActive) {
            while (this.enemySpawnQueue.length > 0 && this.stageTimer >= this.enemySpawnQueue[0].spawnTime) {
                const spawnInfo = this.enemySpawnQueue.shift()!;
                for (let i = 0; i < spawnInfo.spawnCount; i++) {
                    this.spawnEnemy(spawnInfo.enemyType);
                }
            }
        }

        // Check for boss spawns
        if (!this.isBossActive) {
            while (this.bossSpawnQueue.length > 0 && this.stageTimer >= this.bossSpawnQueue[0].spawnTime) {
                const bossInfo = this.bossSpawnQueue.shift()!;
                this.spawnBoss(bossInfo);
                this.isBossActive = true;
                break; // Spawn one boss at a time
            }
        }

        // Update all enemies
        let bossCount = 0;
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(delta, player.position);

            if (enemy.isDead()) {
                const wasBoss = enemy instanceof BaseBoss;
                EffectManager.createExplosion(enemy.position, wasBoss ? 0xFFD700 : 0xFFFFFF, wasBoss ? 2.0 : 1.0); // Bigger, golden explosion for bosses
                this.experienceManager.spawnOrb(enemy.position, enemy.stats.expValue * (wasBoss ? 5 : 1));

                if (wasBoss) {
                    SoundManager.playSfx('sfx_boss_death', 1.0);
                } else {
                    SoundManager.playSfx('sfx_enemy_death', 0.7);
                }

                // Drop treasure chest: 100% for boss, 20% for normal
                if (wasBoss || Math.random() < 0.2) {
                    this.treasureManager.spawnChest(enemy.position);
                }

                this.container.removeChild(enemy);
                this.enemies.splice(i, 1);

                if (wasBoss) {
                    UIManager.hideBossHUD();
                }

            } else if (enemy instanceof BaseBoss) {
                bossCount++;
                UIManager.updateBossHUD(enemy.getCurrentHealth(), enemy.getMaxHealth());
            }
        }

        // If boss count is zero and a boss was active, reset the flag
        if (bossCount === 0 && this.isBossActive) {
            this.isBossActive = false;
            console.log("Boss defeated! Resuming normal spawns.");
        }
    }

    public spawnEnemy(enemyType: string, position?: PIXI.Point) {
        try {
            const enemy = new BaseEnemy(enemyType, this.enemyIdCounter++);
            if (position) {
                enemy.position.copyFrom(position);
            } else {
                this.setupEnemyPosition(enemy);
            }
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

    public spawnBossProjectile(position: PIXI.Point, direction: PIXI.Point, damage: number, speed: number, lifespan: number) {
        const texture = AssetManager.getTexture('projectile');
        if (!texture) {
            console.error('Boss projectile texture not found.');
            return;
        }
        const projectile = new BossProjectile(texture, this.projectileIdCounter++, damage, speed, direction, lifespan);
        projectile.position.copyFrom(position);
        this.bossProjectiles.push(projectile);
        this.container.addChild(projectile);
    }

    private spawnBoss(bossInfo: BossSpawn) {
        let boss: BaseBoss;
        const spawnCallback = this.spawnEnemy.bind(this);
        const projectileCallback = this.spawnBossProjectile.bind(this);

        switch (bossInfo.bossType) {
            case 'goblin_leader':
                boss = new GoblinLeader(bossInfo.bossType, this.enemyIdCounter++, bossInfo, spawnCallback, projectileCallback);
                break;
            case 'orc_chieftain':
                boss = new OrcChieftain(bossInfo.bossType, this.enemyIdCounter++, bossInfo, spawnCallback, projectileCallback);
                break;
            case 'hydra':
                boss = new HydraBoss(bossInfo.bossType, this.enemyIdCounter++, bossInfo, spawnCallback, projectileCallback);
                break;
            default:
                console.error(`Unknown boss type: ${bossInfo.bossType}. No fallback implemented.`);
                return;
        }

        this.setupEnemyPosition(boss);
        this.enemies.push(boss);
        this.container.addChild(boss);

        UIManager.showBossHUD(boss.stats.name);
    }

    public getEnemies(): (BaseEnemy | BaseBoss)[] {
        return this.enemies;
    }

    public getEnemyById(id: number): BaseEnemy | BaseBoss | undefined {
        return this.enemies.find(enemy => enemy.id === id);
    }
}
