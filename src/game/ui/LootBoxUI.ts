// src/game/ui/LootBoxUI.ts

import * as PIXI from 'pixi.js';
import { ItemChoice } from './ItemChoice';
import { ItemData, ItemType } from '../data/ItemData';
import { getLootChoices } from '../data/Items';
import { Player } from '../Player';

export class LootBoxUI extends PIXI.Container {
    private player: Player;
    private onChoice: () => void; // Callback to resume the game

    constructor(player: Player, onChoice: () => void) {
        super();
        this.player = player;
        this.onChoice = onChoice;
        this.interactive = true;
        this.createUI();
    }

    private createUI() {
        // Background overlay
        const overlay = new PIXI.Graphics();
        const screen = (this.parent as any)?.renderer.screen;
        overlay.rect(0, 0, screen.width, screen.height);
        overlay.fill(0x000000, 0.8);
        this.addChild(overlay);

        // Title
        const title = new PIXI.Text('Choose Your Loot!', { fontSize: 48, fill: 0xFFD700 });
        title.anchor.set(0.5);
        title.x = screen.width / 2;
        title.y = 150;
        this.addChild(title);

        // Get 3 random items
        const choices = getLootChoices(3);

        // Display choices
        const choiceWidth = 250;
        const spacing = 60;
        const totalWidth = (choiceWidth * choices.length) + (spacing * (choices.length - 1));
        const startX = (screen.width - totalWidth) / 2;

        choices.forEach((itemData, index) => {
            const itemChoice = new ItemChoice(itemData);
            itemChoice.x = startX + index * (choiceWidth + spacing);
            itemChoice.y = (screen.height - itemChoice.height) / 2;

            itemChoice.on('pointertap', () => this.selectItem(itemData));
            this.addChild(itemChoice);
        });
    }

    private selectItem(itemData: ItemData) {
        // Apply item effects
        this.player.applyItemEffects(itemData);

        // If the item is not a backpack piece, try to add it to the backpack
        if (itemData.type !== ItemType.BACKPACK_PIECE) {
            if (this.player.backpack.addItem(itemData)) {
                console.log(`Added ${itemData.name} to backpack.`);
            } else {
                console.log("Backpack is full! Item was not added, but effects were applied.");
            }
        }

        this.onChoice(); // Resume game
        this.destroy();
    }
}
