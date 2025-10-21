// src/game/data/StageData.ts

export enum StageType {
    STANDARD = 'standard',
    HIGH_DIFFICULTY = 'high_difficulty',
    SHOP = 'shop',
    EVENT = 'event',
    SYSTEM_SCENE = 'system_scene', // For internal scenes like StageSelect, not for gameplay
}

export interface EnemySpawn {
    enemyType: string; // Will correspond to an Enemy class name or key
    spawnTime: number; // Time in seconds from the start of the stage
    spawnCount: number;
}

export interface BossSpawn {
    bossType: string;         // A key from EnemyData, defining the boss's base stats.
    spawnTime: number;        // Time in seconds from the start of the stage.
    isMidBoss: boolean;       // True for mid-boss, false for the final boss of the stage.
    aiType: 'default' | 'charger' | 'caster'; // Defines the behavior pattern.
    healthMultiplier: number; // Multiplier for the base health from EnemyData.
    abilities: string[];      // List of special abilities the boss can use.
}

export interface StageData {
    id: string;
    name: string;
    type: StageType;
    description: string;
    background: string; // Asset key for the background image
    music: string;      // Asset key for the background music
    enemies: EnemySpawn[];
    bosses: BossSpawn[];
}
