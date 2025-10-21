// src/game/data/ItemData.ts

export enum ItemType {
    WEAPON = 'weapon',
    PASSIVE = 'passive',
    CONSUMABLE = 'consumable',
    BACKPACK_PIECE = 'backpack_piece', // For expanding the backpack
}

export enum Rarity {
    COMMON = 'common',
    UNCOMMON = 'uncommon',
    RARE = 'rare',
    EPIC = 'epic',
    LEGENDARY = 'legendary',
}

export interface ItemEffect {
    type: string; // e.g., 'damage_boost', 'health_increase', 'backpack_expand'
    value: any;   // The magnitude of the effect (e.g., 0.1 for 10% boost, or { width: 1, height: 0 } for expansion)
}

export interface ItemData {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: Rarity;
    textureAlias: string;

    // For grid-based backpack
    width: number;  // Width in grid cells
    height: number; // Height in grid cells

    effects: ItemEffect[];
}
