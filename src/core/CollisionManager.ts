// src/core/CollisionManager.ts

import { Player } from '../game/Player';
import { EnemyManager } from '../game/EnemyManager';
import { WeaponManager } from '../game/WeaponManager';
import { ExperienceManager } from '../game/ExperienceManager';
import { TreasureManager } from '../game/TreasureManager';
import { BaseEnemy } from '../game/BaseEnemy';

// Type definition for the WASM module's exports
type WasmCollisionModule = {
    init: () => Promise<void>;
    detect_collisions: (state: any) => any;
};

// Type definitions for data structures matching Rust's
interface Point { x: number; y: number; }
interface GameObject { id: number; position: Point; radius: number; }
interface GameState {
    player: GameObject;
    enemies: GameObject[];
    projectiles: GameObject[];
    orbs: GameObject[];
    chests: GameObject[];
}
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

    private wasm: WasmCollisionModule | null = null;
    private isReady: boolean = false;

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

        this.loadWasm();
    }

    private async loadWasm(): Promise<void> {
        try {
            // The path is relative to the final HTML file in `dist`
            this.wasm = await import('../pkg/collision_logic.js') as WasmCollisionModule;
            // The `init` function is often needed to load the .wasm file itself.
            // Depending on the wasm-pack output, this might not be necessary if using a bundler that handles it.
            // await this.wasm.init();
            this.isReady = true;
            console.log("WebAssembly collision module loaded successfully.");
        } catch (error) {
            console.error("Failed to load WebAssembly module:", error);
        }
    }

    public update(): void {
        if (!this.isReady || !this.wasm) {
            return; // WASM module not ready yet
        }

        // 1. Prepare the game state object for Rust
        const gameState: GameState = {
            player: { id: 0, position: { x: this.player.x, y: this.player.y }, radius: this.player.width / 2 },
            enemies: this.enemyManager.getEnemies().map(e => ({ id: e.id, position: { x: e.x, y: e.y }, radius: e.width / 2 })),
            projectiles: this.weaponManager.getProjectiles().map(p => ({ id: p.id, position: { x: p.x, y: p.y }, radius: p.width / 2 })),
            orbs: this.experienceManager.getOrbs().map(o => ({ id: o.id, position: { x: o.x, y: o.y }, radius: o.width / 2 })),
            chests: this.treasureManager.getChests().map(c => ({ id: c.id, position: { x: c.x, y: c.y }, radius: c.width / 2 })),
        };

        // 2. Call the WASM function
        try {
            const results: CollisionEvent[] = this.wasm.detect_collisions(gameState);

            // 3. Process the results
            for (const event of results) {
                this.handleCollision(event);
            }
        } catch (error) {
            console.error("Error in WASM collision detection:", error);
            this.isReady = false; // Disable further updates to prevent spamming errors
        }
    }

    private handleCollision(event: CollisionEvent): void {
        // Sort types to handle (A, B) and (B, A) collisions the same way
        const typeA = Math.min(event.type_a, event.type_b);
        const typeB = Math.max(event.type_a, event.type_b);
        const idA = typeA === event.type_a ? event.id_a : event.id_b;
        const idB = typeA === event.type_a ? event.id_b : event.id_a;

        if (typeA === CollidableType.Projectile && typeB === CollidableType.Enemy) {
            this.weaponManager.registerHit(idA, idB); // projectileId, enemyId
        } else if (typeA === CollidableType.Player && typeB === CollidableType.Enemy) {
            // Player taking damage could be handled here
            // console.log(`Player collided with enemy ${idB}`);
        } else if (typeA === CollidableType.Player && typeB === CollidableType.ExperienceOrb) {
            this.experienceManager.collectOrb(idB); // orbId
        } else if (typeA === CollidableType.Player && typeB === CollidableType.TreasureChest) {
            this.treasureManager.collectChest(idB); // chestId
        }
    }

    public destroy(): void {
        // No special cleanup needed for WASM
        this.isReady = false;
        this.wasm = null;
    }
}
