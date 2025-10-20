import * as PIXI from 'pixi.js';
import { TreasureChest } from './TreasureChest';
import { AssetManager } from '../core/AssetManager';
import { Player } from './Player';

export class TreasureManager {
    private chests: TreasureChest[] = [];
    private container: PIXI.Container;

    constructor(container: PIXI.Container) {
        this.container = container;
    }

    public spawnChest(position: PIXI.Point) {
        const chestTexture = AssetManager.getTexture('treasure_chest');
        if (!chestTexture) return;

        const chest = new TreasureChest(chestTexture);
        chest.x = position.x;
        chest.y = position.y;

        this.chests.push(chest);
        this.container.addChild(chest);
    }

    public update(delta: number, player: Player, onPickup: () => void) {
        for (let i = this.chests.length - 1; i >= 0; i--) {
            const chest = this.chests[i];

            const dx = player.x - chest.x;
            const dy = player.y - chest.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (player.width / 2) + (chest.width / 2)) {
                onPickup();
                chest.onPickup(); // This will destroy the chest object
                this.chests.splice(i, 1);
            }
        }
    }
}
