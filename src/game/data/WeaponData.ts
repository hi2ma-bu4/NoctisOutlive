// src/game/data/WeaponData.ts

import { ItemData } from './ItemData';

export enum ProjectileType {
    BULLET = 'bullet',
    AOE = 'aoe', // Area of Effect
    MELEE = 'melee',
}

export interface ProjectileData {
    type: ProjectileType;
    textureAlias: string;
    speed: number;
    lifespan: number; // in seconds
    pierce: number; // how many enemies it can pass through
    area: number; // radius or width of the hitbox
}

export interface WeaponData extends ItemData {
    baseDamage: number;
    attackSpeed: number; // attacks per second
    cooldown: number; // time between attacks in seconds
    projectileCount: number;
    projectile: ProjectileData;
}
