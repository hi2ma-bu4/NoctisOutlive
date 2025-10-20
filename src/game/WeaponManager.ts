import * as PIXI from 'pixi.js';
import { Projectile } from './Projectile';
import { AssetManager } from '../core/AssetManager';
import { Enemy } from './Enemy';
import { EnemyManager } from './EnemyManager';
import { Player } from './Player';
import { EffectManager } from '../core/EffectManager';

export class WeaponManager {
    private projectiles: Projectile[] = [];
    private container: PIXI.Container;
    private enemyManager: EnemyManager;
    private fireTimer: number = 0;
    private fireRate: number = 1000; // ms
    private collisionWorker: Worker;
    private projectileIdCounter: number = 0;

    constructor(container: PIXI.Container, enemyManager: EnemyManager) {
        this.container = container;
        this.enemyManager = enemyManager;

        this.collisionWorker = new Worker('workers/CollisionWorker.js');
        this.collisionWorker.onmessage = (event) => {
            this.handleCollisions(event.data.collisions);
        };
    }

    public update(delta: number, player: Player) {
        // Update all projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(delta);
            // TODO: Remove projectile if it goes off-screen
        }

        // Fire new projectiles
        this.fireTimer += delta * 16.66; // Approximate ms
        if (this.fireTimer > this.fireRate) {
            this.fireTimer = 0;
            this.fire(player);
        }

        // Post data to the collision worker
        const projectileData = this.projectiles.map(p => ({ id: p.id, x: p.x, y: p.y, width: p.width, height: p.height }));
        const enemyData = this.enemyManager.getEnemies().map(e => ({ id: e.id, x: e.x, y: e.y, width: e.width, height: e.height }));

        if(projectileData.length > 0 && enemyData.length > 0) {
            this.collisionWorker.postMessage({
                projectiles: projectileData,
                enemies: enemyData,
            });
        }
    }

    private handleCollisions(collisions: { projectileId: number; enemyId: number }[]) {
        for (const collision of collisions) {
            const projectile = this.projectiles.find(p => p.id === collision.projectileId);
            const enemy = this.enemyManager.getEnemies().find(e => e.id === collision.enemyId);

            if (projectile && enemy && !projectile.destroyed && !enemy.destroyed) {
                enemy.takeDamage(projectile.damage);
                EffectManager.createExplosion(projectile.position, 3);

                // Remove projectile from array and stage
                const projIndex = this.projectiles.indexOf(projectile);
                if (projIndex > -1) {
                    this.projectiles.splice(projIndex, 1);
                }
                projectile.destroy();
            }
        }
    }

    private fire(player: Player) {
        const projectileTexture = AssetManager.getTexture('projectile');
        if (!projectileTexture) return;

        const enemies = this.enemyManager.getEnemies();
        if (enemies.length === 0) return;

        // Find the closest enemy
        let closestEnemy: Enemy | null = null;
        let minDistance = Infinity;
        for (const enemy of enemies) {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const distance = dx * dx + dy * dy; // Use squared distance for comparison
            if (distance < minDistance) {
                minDistance = distance;
                closestEnemy = enemy;
            }
        }

        if (closestEnemy) {
            const direction = new PIXI.Point(closestEnemy.x - player.x, closestEnemy.y - player.y);
            const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
            if (length > 0) {
                direction.x /= length;
                direction.y /= length;
            }

            const projectile = new Projectile(projectileTexture, this.projectileIdCounter++, 1, 10, direction);
            projectile.x = player.x;
            projectile.y = player.y;

            this.projectiles.push(projectile);
            this.container.addChild(projectile);
        }
    }
}
