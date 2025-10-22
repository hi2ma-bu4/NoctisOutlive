// src/game/data/Stages.ts
import { StageData, StageType } from './StageData';

export const Stages: StageData[] = [
    // System Scene for Stage Selection
    {
        id: 'stage_select',
        name: 'Stage Select',
        type: StageType.SYSTEM,
        description: 'Choose your next destination.',
        background: 'background_menu',
        music: 'music_menu',
        enemies: [],
        bosses: [],
    },

    // Standard Stage
    {
        id: 'stage_1',
        name: 'Forgotten Plains',
        type: StageType.STANDARD,
        description: 'A standard stage with a variety of enemies.',
        background: 'background_plains',
        music: 'music_stage_1',
        enemies: [
            { enemyType: 'bat', spawnTime: 0, spawnCount: 10 },
            { enemyType: 'slime', spawnTime: 30, spawnCount: 15 },
            { enemyType: 'goblin', spawnTime: 60, spawnCount: 5 },
        ],
        bosses: [
            { bossType: 'goblin_leader', spawnTime: 300, isMidBoss: true, aiType: 'default', healthMultiplier: 1.5, abilities: ['summon_goblin'] },
            { bossType: 'orc_chieftain', spawnTime: 600, isMidBoss: false, aiType: 'charger', healthMultiplier: 2.0, abilities: ['charge', 'stomp'] },
        ],
    },

    // High-Difficulty Stage
    {
        id: 'stage_hard_1',
        name: 'Cursed Wastes',
        type: StageType.HIGH_DIFFICULTY,
        description: 'A high-difficulty stage with relentless foes.',
        background: 'background_wastes',
        music: 'music_stage_hard',
        enemies: [
            { enemyType: 'armored_goblin', spawnTime: 0, spawnCount: 20 },
            { enemyType: 'shadow_bat', spawnTime: 30, spawnCount: 25 },
        ],
        bosses: [
            { bossType: 'lich', spawnTime: 600, isMidBoss: false, aiType: 'caster', healthMultiplier: 3.0, abilities: ['fireball', 'summon_undead'] },
        ],
    },

    // New High-Difficulty Stage
    {
        id: 'stage_hard_2',
        name: 'Volcanic Peak',
        type: StageType.HIGH_DIFFICULTY,
        description: 'An unforgiving stage with powerful new foes.',
        background: 'background_wastes', // Placeholder
        music: 'music_stage_hard', // Placeholder
        enemies: [
            { enemyType: 'hellhound', spawnTime: 0, spawnCount: 15 },
            { enemyType: 'golem', spawnTime: 45, spawnCount: 10 },
            { enemyType: 'hellhound', spawnTime: 90, spawnCount: 20 },
        ],
        bosses: [
            { bossType: 'hydra', spawnTime: 600, isMidBoss: false, aiType: 'default', healthMultiplier: 1.0, abilities: ['multi-attack', 'regenerate'] },
        ],
    },

    // Shop Stage
    {
        id: 'shop_1',
        name: 'Mysterious Trader',
        type: StageType.SHOP,
        description: 'A place to buy and sell rare goods.',
        background: 'background_shop',
        music: 'music_shop',
        enemies: [],
        bosses: [],
    },

    // Event Stage
    {
        id: 'event_1',
        name: 'Whispering Fountain',
        type: StageType.EVENT,
        description: 'A mysterious fountain offers you a choice.',
        background: 'background_event',
        music: 'music_event',
        enemies: [],
        bosses: [],
    },
];
