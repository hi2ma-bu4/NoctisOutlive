// src/game/data/EnemyData.ts

export interface EnemyStats {
    type: string;
    textureKey: string;
    health: number;
    speed: number;
    attack: number;
    scale: number;
}

export const EnemyDatabase: Record<string, EnemyStats> = {
    // Standard Enemies
    'slime': {
        type: 'slime',
        textureKey: 'enemy-slime', // Placeholder texture key
        health: 10,
        speed: 1.5,
        attack: 5,
        scale: 0.8,
    },
    'bat': {
        type: 'bat',
        textureKey: 'enemy-bat', // Placeholder texture key
        health: 5,
        speed: 2.5,
        attack: 3,
        scale: 0.7,
    },
    'zombie': {
        type: 'zombie',
        textureKey: 'enemy-zombie', // Placeholder texture key
        health: 25,
        speed: 1,
        attack: 8,
        scale: 1.0,
    },
    'ghost': {
        type: 'ghost',
        textureKey: 'enemy-ghost', // Placeholder texture key
        health: 15,
        speed: 2,
        attack: 6,
        scale: 0.9,
    },

    // Mid-Bosses
    'goblin-shaman': {
        type: 'goblin-shaman',
        textureKey: 'boss-goblin-shaman', // Placeholder texture key
        health: 150,
        speed: 1.8,
        attack: 15,
        scale: 1.5,
    },
    'necromancer': {
        type: 'necromancer',
        textureKey: 'boss-necromancer', // Placeholder texture key
        health: 200,
        speed: 2.0,
        attack: 20,
        scale: 1.6,
    },

    // Bosses
    'ogre': {
        type: 'ogre',
        textureKey: 'boss-ogre', // Placeholder texture key
        health: 500,
        speed: 1.2,
        attack: 30,
        scale: 2.5,
    },
    'lich': {
        type: 'lich',
        textureKey: 'boss-lich', // Placeholder texture key
        health: 800,
        speed: 1.5,
        attack: 40,
        scale: 2.8,
    },
};
