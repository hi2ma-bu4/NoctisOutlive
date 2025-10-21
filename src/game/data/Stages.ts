// src/game/data/Stages.ts

import { StageData, StageType } from './StageData';

export const Stages: StageData[] = [
    {
        id: 'stage-1',
        name: 'Standard Forest',
        type: StageType.STANDARD,
        description: 'A standard stage with regular enemies.',
        background: 'background-forest',
        music: 'music-forest',
        enemies: [
            { enemyType: 'slime', spawnTime: 0, spawnCount: 10 },
            { enemyType: 'bat', spawnTime: 30, spawnCount: 15 },
        ],
        bosses: [
            { bossType: 'goblin-shaman', spawnTime: 180, isMidBoss: true },
            { bossType: 'ogre', spawnTime: 600, isMidBoss: false },
        ],
    },
    {
        id: 'stage-2',
        name: 'Cursed Graveyard',
        type: StageType.HIGH_DIFFICULTY,
        description: 'A high-difficulty stage with powerful foes.',
        background: 'background-graveyard',
        music: 'music-graveyard',
        enemies: [
            { enemyType: 'zombie', spawnTime: 0, spawnCount: 20 },
            { enemyType: 'ghost', spawnTime: 45, spawnCount: 10 },
        ],
        bosses: [
            { bossType: 'necromancer', spawnTime: 240, isMidBoss: true },
            { bossType: 'lich', spawnTime: 720, isMidBoss: false },
        ],
    },
    {
        id: 'shop-1',
        name: 'Mysterious Shop',
        type: StageType.SHOP,
        description: 'Buy, sell, and upgrade items.',
        background: 'background-shop',
        music: 'music-shop',
        enemies: [],
        bosses: [],
    },
    {
        id: 'event-1',
        name: 'Whispering Fountain',
        type: StageType.EVENT,
        description: 'An event stage with choices and consequences.',
        background: 'background-fountain',
        music: 'music-fountain',
        enemies: [],
        bosses: [],
    },
];
