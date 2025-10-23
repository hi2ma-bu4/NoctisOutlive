// src/game/data/EnemyData.ts

export interface EnemyStats {
    name: string;
    type: string;
    textureKey: string;
    health: number;
    speed: number;
    attack: number;
    scale: number;
    expValue: number;
}

export const EnemyDatabase: Record<string, EnemyStats> = {
    // Standard Enemies
    'slime': {
        name: 'Slime',
        type: 'slime',
        textureKey: 'enemy-slime', // Placeholder texture key
        health: 10,
        speed: 1.5,
        attack: 5,
        scale: 0.8,
        expValue: 1,
    },
    'bat': {
        name: 'Bat',
        type: 'bat',
        textureKey: 'enemy-bat', // Placeholder texture key
        health: 5,
        speed: 2.5,
        attack: 3,
        scale: 0.7,
        expValue: 1,
    },
    'zombie': {
        name: 'Zombie',
        type: 'zombie',
        textureKey: 'enemy-zombie', // Placeholder texture key
        health: 25,
        speed: 1,
        attack: 8,
        scale: 1.0,
        expValue: 2,
    },
    'ghost': {
        name: 'Ghost',
        type: 'ghost',
        textureKey: 'enemy-ghost', // Placeholder texture key
        health: 15,
        speed: 2,
        attack: 6,
        scale: 0.9,
        expValue: 2,
    },

    // Mid-Bosses
    'goblin-shaman': {
        name: 'Goblin Shaman',
        type: 'goblin-shaman',
        textureKey: 'boss-goblin-shaman', // Placeholder texture key
        health: 150,
        speed: 1.8,
        attack: 15,
        scale: 1.5,
        expValue: 20,
    },
    'necromancer': {
        name: 'Necromancer',
        type: 'necromancer',
        textureKey: 'boss-necromancer', // Placeholder texture key
        health: 200,
        speed: 2.0,
        attack: 20,
        scale: 1.6,
        expValue: 25,
    },

    // Bosses
    'ogre': {
        name: 'Ogre',
        type: 'ogre',
        textureKey: 'boss-ogre', // Placeholder texture key
        health: 500,
        speed: 1.2,
        attack: 30,
        scale: 2.5,
        expValue: 50,
    },
    'lich': {
        name: 'Lich',
        type: 'lich',
        textureKey: 'boss-lich', // Placeholder texture key
        health: 800,
        speed: 1.5,
        attack: 40,
        scale: 2.8,
        expValue: 100,
    },

    // High-Difficulty Enemies
    'hellhound': {
        name: 'Hellhound',
        type: 'hellhound',
        textureKey: 'enemy-hellhound',
        health: 100,
        speed: 3.5,
        attack: 25,
        scale: 1.2,
        expValue: 10,
    },
    'golem': {
        name: 'Golem',
        type: 'golem',
        textureKey: 'enemy-golem',
        health: 300,
        speed: 0.8,
        attack: 40,
        scale: 1.8,
        expValue: 15,
    },

    // High-Difficulty Boss
    'hydra': {
        name: 'Hydra',
        type: 'hydra',
        textureKey: 'boss-hydra',
        health: 2500,
        speed: 1.0,
        attack: 60,
        scale: 3.5,
        expValue: 500,
    },
};
