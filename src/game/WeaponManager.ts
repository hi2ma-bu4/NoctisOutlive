// src/game/WeaponManager.ts

import * as PIXI from 'pixi.js';
import { Projectile } from './Projectile';
import { AssetManager } from '../core/AssetManager';
import { EnemyManager } from './EnemyManager';
import { Player } from './Player';
import { EffectManager } from '../core/EffectManager';
import { SoundManager } from '../core/SoundManager';
import { WeaponData } from './data/WeaponData';
import { WEAPONS } from './data/Weapons';
import { BaseEnemy, BaseBoss } from './BaseEnemy';
import { UIManager } from '../core/UIManager';

interface ActiveWeapon {
    data: WeaponData;
    cooldownTimer: number;
}

export class WeaponManager {
    private projectiles: Projectile[] = [];
    private container: PIXI.Container;
    private enemyManager: EnemyManager;
    private projectileIdCounter: number = 0;
    private activeWeapons: ActiveWeapon[] = [];

    constructor(container: PIXI.Container, enemyManager: EnemyManager) {
        this.container = container;
        this.enemyManager = enemyManager;
        // Start with a default weapon
        this.addWeapon('magic_missile');
    }

    public addWeapon(weaponId: string): void {
        const weaponData = WEAPONS[weaponId];
        if (weaponData) {
            this.activeWeapons.push({
                data: weaponData,
                cooldownTimer: 0,
            });
            console.log(`Weapon added: ${weaponData.name}`);
        } else {
            console.error(`Weapon with id '${weaponId}' not found.`);
        }
    }

    public update(delta: number, player: Player) {
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(delta);
            if (projectile.shouldBeDestroyed()) {
                this.container.removeChild(projectile);
                this.projectiles.splice(i, 1);
            }
        }

        // Update weapon cooldowns and fire
        this.activeWeapons.forEach(weapon => {
            weapon.cooldownTimer -= delta / 60; // convert delta frames to seconds
            if (weapon.cooldownTimer <= 0) {
                weapon.cooldownTimer = weapon.data.cooldown;
                this.fire(player, weapon.data);
            }
        });
    }

    // This is now called by CollisionManager
    public registerHit(projectileId: number, enemyId: number): void {
        const projectile = this.projectiles.find(p => p.id === projectileId);
        const enemy = this.enemyManager.getEnemies().find(e => e.id === enemyId);

        if (projectile && enemy && !projectile.hasHit(enemy.id) && !enemy.isDead()) {
            enemy.takeDamage(projectile.damage);
            projectile.registerHit(enemy.id);

            EffectManager.createExplosion(projectile.position, 0xFF8844, 0.5);
            SoundManager.playSfx('sfx_projectile_hit', 0.5);

            if (projectile.shouldBeDestroyed()) {
                const index = this.projectiles.indexOf(projectile);
                if (index > -1) {
                    this.projectiles.splice(index, 1);
                }
                projectile.destroy();
            }
        }
    }

    private fire(player: Player, weapon: WeaponData) {
        const projectileData = weapon.projectile;
        const projectileTexture = AssetManager.getTexture(projectileData.textureAlias);
        if (!projectileTexture) {
            console.warn(`Texture not found for projectile: ${projectileData.textureAlias}`);
            return;
        }

        const enemies = this.enemyManager.getEnemies().filter(e => !e.isDead());
        if (enemies.length === 0) return;

        // Find the closest enemy
        const closestEnemy = this.findClosestEnemy(player, enemies);

        if (closestEnemy) {
            for (let i = 0; i < weapon.projectileCount; i++) {
                const direction = new PIXI.Point(closestEnemy.x - player.x, closestEnemy.y - player.y);
                const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
                if (length > 0) {
                    direction.x /= length;
                    direction.y /= length;
                }

                const projectile = new Projectile(
                    projectileTexture,
                    this.projectileIdCounter++,
                    weapon.baseDamage * player.damageMultiplier,
                    projectileData.speed,
                    direction,
                    projectileData.lifespan,
                    projectileData.pierce
                );
                projectile.x = player.x;
                projectile.y = player.y;

                this.projectiles.push(projectile);
                this.container.addChild(projectile);
            }
            SoundManager.playSfx('sfx_player_shoot', 0.3);
        }
    }

    private findClosestEnemy(player: Player, enemies: (BaseEnemy | BaseBoss)[]): BaseEnemy | BaseBoss | null {
        let closestEnemy: BaseEnemy | BaseBoss | null = null;
        let minDistanceSq = Infinity;

        for (const enemy of enemies) {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const distanceSq = dx * dx + dy * dy;
            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq;
                closestEnemy = enemy;
            }
        }
        return closestEnemy;
    }

    public getProjectiles(): Projectile[] {
        return this.projectiles;
    }
}
