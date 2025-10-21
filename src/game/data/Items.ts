// src/game/data/Items.ts

import { ItemData, ItemType, Rarity } from './ItemData';

/**
 * The central database for all item definitions in the game.
 */
export const itemDatabase: ItemData[] = [
    // === Passive Items ===
    {
        id: 'health_boost',
        name: 'Health Boost',
        description: 'Increases maximum health by 20.',
        type: ItemType.PASSIVE,
        rarity: Rarity.COMMON,
        textureAlias: 'item_health_boost',
        width: 1,
        height: 1,
        effects: [{ type: 'health_increase', value: 20 }],
    },
    {
        id: 'damage_boost',
        name: 'Damage Boost',
        description: 'Increases attack damage by 10%.',
        type: ItemType.PASSIVE,
        rarity: Rarity.UNCOMMON,
        textureAlias: 'item_damage_boost',
        width: 2,
        height: 1,
        effects: [{ type: 'damage_boost', value: 0.1 }],
    },

    // === Weapon Items ===
    {
        id: 'weapon_magic_missile',
        name: 'Magic Missile',
        description: 'Fires a seeking missile at the nearest enemy.',
        type: ItemType.WEAPON,
        rarity: Rarity.COMMON,
        textureAlias: 'weapon_magic_missile',
        width: 1,
        height: 2,
        effects: [{ type: 'add_weapon', value: 'magic_missile' }],
    },

    // === Backpack Expansion Items ===
    {
        id: 'backpack_expansion_h',
        name: 'Backpack Expansion (H)',
        description: 'Adds one column to your backpack grid.',
        type: ItemType.BACKPACK_PIECE,
        rarity: Rarity.RARE,
        textureAlias: 'item_backpack_h',
        width: 1,
        height: 1, // The size of the piece itself when choosing
        effects: [{ type: 'backpack_expand', value: { width: 1, height: 0 } }],
    },
    {
        id: 'backpack_expansion_v',
        name: 'Backpack Expansion (V)',
        description: 'Adds one row to your backpack grid.',
        type: ItemType.BACKPACK_PIECE,
        rarity: Rarity.RARE,
        textureAlias: 'item_backpack_v',
        width: 1,
        height: 1,
        effects: [{ type: 'backpack_expand', value: { width: 0, height: 1 } }],
    },
];
