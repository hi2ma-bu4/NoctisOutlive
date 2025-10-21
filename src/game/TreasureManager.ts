// src/game/TreasureManager.ts

import * as PIXI from 'pixi.js';
import { TreasureChest } from './TreasureChest';
import { AssetManager } from '../core/AssetManager';
import { Player } from './Player';
import { SoundManager } from '../core/SoundManager';

export class TreasureManager {
    private chests: TreasureChest[] = [];
    private container: PIXI.Container;
    private onPickupCallback: () => void;
    private chestIdCounter: number = 0;

    constructor(container: PIXI.Container, onPickup: () => void) {
        this.container = container;
        this.onPickupCallback = onPickup;
    }

    public spawnChest(position: PIXI.Point) {
        const chestTexture = AssetManager.getTexture('treasure_chest');
        if (!chestTexture) return;

        const chest = new TreasureChest(chestTexture, this.chestIdCounter++);
        chest.x = position.x;
        chest.y = position.y;

        this.chests.push(chest);
        this.container.addChild(chest);
    }

    public update(delta: number, player: Player) {
        // Collision detection is now handled by CollisionManager
    }

    public collectChest(chestId: number): void {
        const chestIndex = this.chests.findIndex(c => c.id === chestId);
        if (chestIndex > -1) {
            const chest = this.chests[chestIndex];
            this.onPickupCallback();
            chest.onPickup(); // This will destroy the chest object
            this.chests.splice(chestIndex, 1);
            SoundManager.playSfx('sfx_item_pickup', 1.2); // Play slightly louder for emphasis
        }
    }

    public getChests(): TreasureChest[] {
        return this.chests;
    }
}
