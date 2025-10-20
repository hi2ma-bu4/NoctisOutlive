export enum ItemType {
    WEAPON,
    PASSIVE,
    CONSUMABLE,
}

export enum Rarity {
    COMMON,
    UNCOMMON,
    RARE,
    EPIC,
    LEGENDARY,
}

export interface ItemData {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: Rarity;
    textureAlias: string;
    // Effects will be handled by a separate system
}
