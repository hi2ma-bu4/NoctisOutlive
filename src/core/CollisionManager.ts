// src/core/CollisionManager.ts

import { Player } from '../game/Player';
import { EnemyManager } from '../game/EnemyManager';
import { WeaponManager } from '../game/WeaponManager';
import { ExperienceManager } from '../game/ExperienceManager';
import { TreasureManager } from '../game/TreasureManager';
import { BaseEnemy } from '../game/BaseEnemy';

enum CollisionType {
    PROJECTILE_ENEMY = 'projectile-enemy',
    PLAYER_ENEMY = 'player-enemy',
    PLAYER_EXP_ORB = 'player-exp-orb',
    PLAYER_TREASURE = 'player-treasure',
}

interface CollisionResult {
    type: CollisionType;
    a: number; // ID of the first object
    b: number; // ID of the second object
}

export class CollisionManager {
    private worker: Worker;

    // Managers to delegate collision handling to
    private player: Player;
    private enemyManager: EnemyManager;
    private weaponManager: WeaponManager;
    private experienceManager: ExperienceManager;
    private treasureManager: TreasureManager;

    constructor(
        player: Player,
        enemyManager: EnemyManager,
        weaponManager: WeaponManager,
        experienceManager: ExperienceManager,
        treasureManager: TreasureManager
    ) {
        this.player = player;
        this.enemyManager = enemyManager;
        this.weaponManager = weaponManager;
        this.experienceManager = experienceManager;
        this.treasureManager = treasureManager;

        this.worker = new Worker('workers/CollisionWorker.js');
        this.worker.onmessage = (event: MessageEvent) => {
            this.handleCollisions(event.data.collisions);
        };
    }

    public update(): void {
        const enemies = this.enemyManager.getEnemies();
        const projectiles = this.weaponManager.getProjectiles();
        const expOrbs = this.experienceManager.getOrbs();
        const treasureChests = this.treasureManager.getChests();

        // Avoid posting empty data
        if (enemies.length === 0 && projectiles.length === 0 && expOrbs.length === 0 && treasureChests.length === 0) {
            return;
        }

        // Prepare data for the worker
        const workerData = {
            player: { id: 0, x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height, pickupRadius: this.player.pickupRadius },
            enemies: enemies.map(e => ({ id: e.id, x: e.x, y: e.y, width: e.width, height: e.height })),
            projectiles: projectiles.map(p => ({ id: p.id, x: p.x, y: p.y, width: p.width, height: p.height })),
            expOrbs: expOrbs.map(o => ({ id: o.id, x: o.x, y: o.y, width: o.width, height: o.height })),
            treasureChests: treasureChests.map(c => ({ id: c.id, x: c.x, y: c.y, width: c.width, height: c.height })),
        };

        this.worker.postMessage(workerData);
    }

    private handleCollisions(collisions: CollisionResult[]): void {
        if (!collisions) return;

        for (const collision of collisions) {
            switch (collision.type) {
                case CollisionType.PROJECTILE_ENEMY:
                    this.weaponManager.handleCollision(collision.a, collision.b, this.player);
                    break;
                case CollisionType.PLAYER_ENEMY:
                    const enemy = this.enemyManager.getEnemies().find(e => e.id === collision.b);
                    // this.player.takeDamage(enemy.stats.attack); // To be implemented
                    console.log(`Player collided with enemy ${enemy.id}`);
                    break;
                case CollisionType.PLAYER_EXP_ORB:
                    this.experienceManager.collectOrb(collision.b);
                    break;
                case CollisionType.PLAYER_TREASURE:
                    this.treasureManager.collectChest(collision.b);
                    break;
            }
        }
    }

    public destroy(): void {
        this.worker.terminate();
    }
}
