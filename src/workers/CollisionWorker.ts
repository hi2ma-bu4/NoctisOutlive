// src/workers/CollisionWorker.ts

interface GameObject {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface PlayerObject extends GameObject {
    pickupRadius: number;
}

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

// Simple Axis-Aligned Bounding Box check
function checkCollision(objA: GameObject, objB: GameObject): boolean {
    // Using circular collision for better feel
    const dx = objA.x - objB.x;
    const dy = objA.y - objB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (objA.width / 2) + (objB.width / 2);
}

// Check for collision within a larger radius (for pickups)
function checkRadiusCollision(player: PlayerObject, item: GameObject): boolean {
    const dx = player.x - item.x;
    const dy = player.y - item.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < player.pickupRadius;
}


self.onmessage = (event: MessageEvent) => {
    const { player, enemies, projectiles, expOrbs, treasureChests } = event.data;
    const collisions: CollisionResult[] = [];

    // 1. Projectiles vs Enemies
    if (projectiles && enemies) {
        for (const projectile of projectiles) {
            for (const enemy of enemies) {
                if (checkCollision(projectile, enemy)) {
                    collisions.push({ type: CollisionType.PROJECTILE_ENEMY, a: projectile.id, b: enemy.id });
                    // Assume a projectile can only hit one enemy
                    break;
                }
            }
        }
    }

    // 2. Player vs Enemies
    if (player && enemies) {
        for (const enemy of enemies) {
            if (checkCollision(player, enemy)) {
                collisions.push({ type: CollisionType.PLAYER_ENEMY, a: player.id, b: enemy.id });
            }
        }
    }

    // 3. Player vs Experience Orbs (using pickup radius)
    if (player && expOrbs) {
        for (const orb of expOrbs) {
            if (checkRadiusCollision(player, orb)) {
                collisions.push({ type: CollisionType.PLAYER_EXP_ORB, a: player.id, b: orb.id });
            }
        }
    }

    // 4. Player vs Treasure Chests
    if (player && treasureChests) {
        for (const chest of treasureChests) {
            if (checkCollision(player, chest)) {
                collisions.push({ type: CollisionType.PLAYER_TREASURE, a: player.id, b: chest.id });
            }
        }
    }

    if (collisions.length > 0) {
        self.postMessage({ collisions });
    }
};
