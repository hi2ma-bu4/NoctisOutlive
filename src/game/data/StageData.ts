// src/game/data/StageData.ts

export enum StageType {
    STANDARD = 'standard',
    HIGH_DIFFICULTY = 'high_difficulty',
    SHOP = 'shop',
    EVENT = 'event',
}

export interface EnemySpawn {
    enemyType: string; // Will correspond to an Enemy class name or key
    spawnTime: number; // Time in seconds from the start of the stage
    spawnCount: number;
}

export interface BossSpawn {
    bossType: string;
    spawnTime: number;
    isMidBoss: boolean;
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
