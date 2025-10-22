// src/core/CollisionManager.ts

import { Player } from '../game/Player';
import { EnemyManager } from '../game/EnemyManager';
import { WeaponManager } from '../game/WeaponManager';
import { ExperienceManager } from '../game/ExperienceManager';
import { TreasureManager } from '../game/TreasureManager';

// Duplicating these enums/interfaces is necessary because the worker
// cannot import them directly from the main thread's scope.
// It's crucial to keep these in sync with the worker and Rust code.
enum CollidableType {
    Player,
    Enemy,
    Projectile,
    ExperienceOrb,
    TreasureChest,
}
interface CollisionEvent {
    type_a: CollidableType;
    id_a: number;
    type_b: CollidableType;
    id_b: number;
}

export class CollisionManager {
    private player: Player;
    private enemyManager: EnemyManager;
    private weaponManager: WeaponManager;
    private experienceManager: ExperienceManager;
    private treasureManager: TreasureManager;

    private worker: Worker | null = null;
    private isReady: boolean = false;
    private updatePending: boolean = false;

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

        this.initializeWorker();
    }

    private initializeWorker(): void {
        try {
            this.worker = new Worker(new URL('../workers/CollisionWorker.ts', import.meta.url), {
                type: 'module'
            });

            this.worker.onmessage = (event: MessageEvent) => {
                switch (event.data.type) {
                    case 'init_done':
                        this.isReady = true;
                        console.log("Collision worker is ready.");
                        break;
                    case 'collisions':
                        this.processCollisions(event.data.collisions);
                        this.updatePending = false;
                        break;
                    case 'init_error':
                    case 'runtime_error':
                        console.error("Collision worker error:", event.data.error);
                        this.isReady = false;
                        this.worker?.terminate();
                        break;
                }
            };

            // The path to the wasm module must be relative to the final worker script's location.
            // When built, `CollisionWorker.ts` will be in `dist/workers/`, and `collision_logic.js` in `dist/pkg/`.
            this.worker.postMessage({
                type: 'init',
                wasmPath: '../pkg/collision_logic.js'
            });

        } catch (error) {
            console.error("Failed to initialize the collision worker:", error);
            this.isReady = false;
        }
    }

    public update(): void {
        if (!this.isReady || this.updatePending) {
            return;
        }

        this.updatePending = true;

        const gameState = {
            player: { id: 0, position: { x: this.player.x, y: this.player.y }, radius: this.player.width / 2 },
            enemies: this.enemyManager.getEnemies().map(e => ({ id: e.id, position: { x: e.x, y: e.y }, radius: e.width / 2 })),
            projectiles: this.weaponManager.getProjectiles().map(p => ({ id: p.id, position: { x: p.x, y: p.y }, radius: p.width / 2 })),
            orbs: this.experienceManager.getOrbs().map(o => ({ id: o.id, position: { x: o.x, y: o.y }, radius: o.width / 2 })),
            chests: this.treasureManager.getChests().map(c => ({ id: c.id, position: { x: c.x, y: c.y }, radius: c.width / 2 })),
        };

        this.worker!.postMessage({
            type: 'detect',
            gameState: gameState
        });
    }

    private processCollisions(collisions: CollisionEvent[]): void {
        for (const event of collisions) {
            this.handleCollision(event);
        }
    }

    private handleCollision(event: CollisionEvent): void {
        const typeA = Math.min(event.type_a, event.type_b);
        const typeB = Math.max(event.type_a, event.type_b);
        const idA = typeA === event.type_a ? event.id_a : event.id_b;
        const idB = typeA === event.type_a ? event.id_b : event.id_a;

        if (typeA === CollidableType.Projectile && typeB === CollidableType.Enemy) {
            this.weaponManager.registerHit(idA, idB);
        } else if (typeA === CollidableType.Player && typeB === CollidableType.Enemy) {
            const enemy = this.enemyManager.getEnemyById(idB);
            if (enemy) {
                this.player.takeDamage(enemy.damage);
            }
        } else if (typeA === CollidableType.Player && typeB === CollidableType.ExperienceOrb) {
            this.experienceManager.collectOrb(idB);
        } else if (typeA === CollidableType.Player && typeB === CollidableType.TreasureChest) {
            this.treasureManager.collectChest(idB);
        }
    }

    public destroy(): void {
        if (this.worker) {
            this.worker.terminate();
        }
        this.isReady = false;
    }
}
