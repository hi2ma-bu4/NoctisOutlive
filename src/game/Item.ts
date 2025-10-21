// src/game/Item.ts

import * as PIXI from 'pixi.js';
import { ItemData } from './data/ItemData';
import { AssetManager } from '../core/AssetManager';

export const SLOT_SIZE = 64; // Making this a constant for universal access

export class Item extends PIXI.Sprite {
    public data: ItemData;

    // Position in the backpack grid
    public gridX: number = -1;
    public gridY: number = -1;

    constructor(itemData: ItemData) {
        const texture = AssetManager.getTexture(itemData.textureAlias);
        if (!texture) {
            console.warn(`Texture not found for item: ${itemData.name}, using fallback.`);
            super(PIXI.Texture.WHITE);
        } else {
            super(texture);
        }

        this.data = itemData;
        this.anchor.set(0.5);

        // Set visual size based on grid dimensions
        this.width = this.data.width * SLOT_SIZE;
        this.height = this.data.height * SLOT_SIZE;
    }

    public rotate(): void {
        // Swap dimensions
        [this.data.width, this.data.height] = [this.data.height, this.data.width];

        // Swap visual size
        [this.width, this.height] = [this.height, this.width];

        // Rotate sprite
        this.rotation += Math.PI / 2;
    }
}
