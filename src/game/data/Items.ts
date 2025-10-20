import { ItemData, ItemType, Rarity } from './ItemData';

export const ITEMS: Record<string, ItemData> = {
    'health_boost': {
        id: 'health_boost',
        name: 'Health Boost',
        description: 'Increases maximum health.',
        type: ItemType.PASSIVE,
        rarity: Rarity.COMMON,
        textureAlias: 'item_health_boost',
    },
    'damage_boost': {
        id: 'damage_boost',
        name: 'Damage Boost',
        description: 'Increases attack damage.',
        type: ItemType.PASSIVE,
        rarity: Rarity.UNCOMMON,
        textureAlias: 'item_damage_boost',
    },
};
