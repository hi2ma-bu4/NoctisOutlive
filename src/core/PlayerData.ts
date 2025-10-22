// src/core/PlayerData.ts

import { Backpack } from '../game/Backpack';

/**
 * A singleton class to hold player data that persists across scenes.
 */
export class PlayerData {
    private static instance: PlayerData;

    public money: number;
    public backpack: Backpack;
    public backpackFragments: number;
    public readonly fragmentsPerExpansion: number = 4; // Collect 4 pieces to expand
    // Other persistent stats can be added here (e.g., total playtime, unlocked characters, etc.)

    private constructor() {
        this.money = 100; // Starting money
        this.backpack = new Backpack(5, 5); // Default backpack
        this.backpackFragments = 0;
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
     * Adds a backpack fragment and expands the backpack if enough fragments are collected.
     * Returns true if an expansion occurred, false otherwise.
     */
    public addBackpackFragment(): boolean {
        this.backpackFragments++;
        console.log(`Backpack fragments: ${this.backpackFragments}/${this.fragmentsPerExpansion}`);
        if (this.backpackFragments >= this.fragmentsPerExpansion) {
            this.backpackFragments -= this.fragmentsPerExpansion;
            // For simplicity, we expand by 1 in a alternating direction (1x0, then 0x1)
            const isHorizontalExpansion = this.backpack.gridHeight >= this.backpack.gridWidth;
            const expandWidth = isHorizontalExpansion ? 1 : 0;
            const expandHeight = isHorizontalExpansion ? 0 : 1;

            console.log(`Expanding backpack by ${expandWidth}x${expandHeight}`);
            this.backpack.expandGrid(expandHeight, expandWidth);
            return true;
        }
        return false;
    }
}
