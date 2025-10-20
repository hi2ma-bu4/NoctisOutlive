// This script will be run in a Web Worker

interface GameObject {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

self.onmessage = (event: MessageEvent) => {
    const { enemies, projectiles } = event.data;

    const collisions: { projectileId: number; enemyId: number }[] = [];

    for (const projectile of projectiles) {
        for (const enemy of enemies) {
            const dx = projectile.x - enemy.x;
            const dy = projectile.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (projectile.width / 2) + (enemy.width / 2)) {
                collisions.push({ projectileId: projectile.id, enemyId: enemy.id });
                // In a real scenario, you might want to stop checking for this projectile
                break;
            }
        }
    }

    self.postMessage({ collisions });
};
