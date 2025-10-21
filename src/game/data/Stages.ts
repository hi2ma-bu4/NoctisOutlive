// src/game/data/Stages.ts

import { StageData, StageType } from './StageData';

export const Stages: StageData[] = [
    {
        id: 'stage-1',
        name: 'Whispering Woods',
        type: StageType.STANDARD,
        description: 'A haunted forest teeming with slimes and bats.',
        background: 'background-forest',
        music: 'music-forest',
        enemies: [
            { enemyType: 'slime', spawnTime: 0, spawnCount: 10 },
            { enemyType: 'bat', spawnTime: 30, spawnCount: 15 },
            { enemyType: 'slime', spawnTime: 60, spawnCount: 20 },
            { enemyType: 'bat', spawnTime: 90, spawnCount: 25 },
        ],
        bosses: [
            {
                bossType: 'sample_boss', // Using SampleBoss for now
                spawnTime: 180,
                isMidBoss: true,
                aiType: 'caster',
                healthMultiplier: 1.5,
                abilities: ['aoe_slam']
            }
        ],
    },
    {
        id: 'stage-2',
        name: 'Sunken Crypt',
        type: StageType.HIGH_DIFFICULTY,
        description: 'Vicious undead guard this cursed tomb.',
        background: 'background-graveyard',
        music: 'music-graveyard',
        enemies: [
            { enemyType: 'zombie', spawnTime: 0, spawnCount: 20 },
            { enemyType: 'ghost', spawnTime: 45, spawnCount: 10 },
            { enemyType: 'zombie', spawnTime: 90, spawnCount: 30 },
            { enemyType: 'ghost', spawnTime: 120, spawnCount: 20 },
        ],
        bosses: [
            {
                bossType: 'sample_boss',
                spawnTime: 240,
                isMidBoss: true,
                aiType: 'charger',
                healthMultiplier: 2.0,
                abilities: ['summon_minions', 'aoe_slam']
            },
            {
                bossType: 'sample_boss', // Final Boss
                spawnTime: 600,
                isMidBoss: false,
                aiType: 'caster',
                healthMultiplier: 3.0,
                abilities: ['summon_minions', 'aoe_slam']
            }
        ]
    },
    {
        id: 'shop-1',
        name: 'Goblin Market',
        type: StageType.SHOP,
        description: 'Spend your hard-earned gold.',
        background: 'background-shop',
        music: 'music-shop',
        enemies: [],
        bosses: [],
    },
    {
        id: 'event-1',
        name: 'Ancient Shrine',
        type: StageType.EVENT,
        description: 'Make a choice, face the consequences.',
        background: 'background-fountain',
        music: 'music-fountain',
        enemies: [],
        bosses: [],
    },
];
