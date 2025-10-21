// src/core/PlayerData.ts

import { Backpack } from '../game/Backpack';

/**
 * A singleton class to hold player data that persists across scenes.
 */
export class PlayerData {
    private static instance: PlayerData;

    public money: number;
    public backpack: Backpack;
    // Other persistent stats can be added here (e.g., total playtime, unlocked characters, etc.)

    private constructor() {
        this.money = 100; // Starting money
        this.backpack = new Backpack(5, 5); // Default backpack
    }

    public static getInstance(): PlayerData {
        if (!PlayerData.instance) {
            PlayerData.instance = new PlayerData();
        }
        return PlayerData.instance;
    }

    /**
     * Replaces the current backpack with a new one.
     * Useful when loading data or syncing with the in--game player object.
     * @param newBackpack The new backpack instance.
     */
    public setBackpack(newBackpack: Backpack): void {
        this.backpack = newBackpack;
    }

    /**
     * Applies the effects of an item to the player's persistent data.
     * @param itemData The item whose effects should be applied.
     */
    public applyItemEffect(itemData: import('../game/data/ItemData').ItemData): void {
        itemData.effects.forEach(effect => {
            switch (effect.type) {
                case 'backpack_expand':
                    if (effect.value && typeof effect.value.width === 'number' && typeof effect.value.height === 'number') {
                        console.log(`Expanding backpack by ${effect.value.width}x${effect.value.height}`);
                        this.backpack.expandGrid(effect.value.height, effect.value.width);
                    }
                    break;
                // Other persistent effects can be handled here
                // For example, a permanent stat boost could be applied to a `this.permanentStats` object.
            }
        });
    }
}
