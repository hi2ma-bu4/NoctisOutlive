// src/game/data/Weapons.ts

import { WeaponData } from './WeaponData';
import { ItemType, Rarity } from './ItemData';
import { ProjectileType } from './WeaponData';

export const WEAPONS: { [id: string]: WeaponData } = {
    'magic_missile': {
        id: 'magic_missile',
        name: 'Magic Missile',
        description: 'Fires a magical bolt at the nearest enemy.',
        type: ItemType.WEAPON,
        rarity: Rarity.COMMON,
        textureAlias: 'weapon_magic_missile',
        width: 1,
        height: 2,
        effects: [],
        baseDamage: 10,
        attackSpeed: 1.5,
        cooldown: 1 / 1.5, // Inverse of attack speed
        projectileCount: 1,
        projectile: {
            type: ProjectileType.BULLET,
            textureAlias: 'projectile_magic_missile',
            speed: 8,
            lifespan: 3, // seconds
            pierce: 1,
            area: 10, // radius
        }
    },
};
