// src/game/data/Items.ts

import { ItemData, ItemType, Rarity } from './ItemData';

export const ITEMS: Record<string, ItemData> = {
    // Passive Items
    'health_boost': {
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
    'damage_boost': {
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

    // Weapon Items
    'weapon_magic_missile': {
        id: 'weapon_magic_missile',
        name: 'Magic Missile',
        description: 'Fires a seeking missile at the nearest enemy.',
        type: ItemType.WEAPON,
        rarity: Rarity.COMMON,
        textureAlias: 'weapon_magic_missile', // Placeholder texture
        width: 1,
        height: 2,
        effects: [{ type: 'add_weapon', value: 'magic_missile' }],
    },

    // Backpack Expansion Items
    'backpack_expansion_h': {
        id: 'backpack_expansion_h',
        name: 'Backpack Expansion (H)',
        description: 'Adds one column to your backpack grid.',
        type: ItemType.BACKPACK_PIECE,
        rarity: Rarity.RARE,
        textureAlias: 'item_backpack_h', // Placeholder texture
        width: 1,
        height: 1, // The size of the piece itself when choosing
        effects: [{ type: 'backpack_expand', value: { width: 1, height: 0 } }],
    },
};

export function getRandomItem(rarity?: Rarity): ItemData {
    const items = Object.values(ITEMS);
    // Simple random for now, can be weighted by rarity later
    return items[Math.floor(Math.random() * items.length)];
}

export function getLootChoices(count: number = 3): ItemData[] {
    const choices: ItemData[] = [];
    const availableItems = Object.values(ITEMS);

    // Ensure no duplicate choices
    while (choices.length < count && availableItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        const selected = availableItems.splice(randomIndex, 1)[0];
        choices.push(selected);
    }

    return choices;
}
