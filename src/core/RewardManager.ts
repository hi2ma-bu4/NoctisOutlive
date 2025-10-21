// src/core/RewardManager.ts

import { ItemData } from '../game/data/ItemData';
import { itemDatabase } from '../game/data/Items';

export interface IReward {
    type: 'item' | 'weapon' | 'ability';
    data: ItemData; // For now, we only handle items. This can be expanded.
}

export class RewardManager {

    /**
     * Generates a list of reward options for the player.
     * For now, it randomly picks from the item database.
     * @param count The number of reward options to generate.
     * @returns An array of reward objects.
     */
    public static generateRewards(count: number = 3): IReward[] {
        const rewards: IReward[] = [];
        const availableItems = [...itemDatabase]; // Create a mutable copy

        for (let i = 0; i < count; i++) {
            if (availableItems.length === 0) break;

            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const selectedItem = availableItems.splice(randomIndex, 1)[0]; // Remove to avoid duplicates

            rewards.push({
                type: 'item',
                data: selectedItem
            });
        }

        return rewards;
    }
}
