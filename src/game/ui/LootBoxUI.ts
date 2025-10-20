import * as PIXI from 'pixi.js';
import { ItemChoice } from './ItemChoice';
import { ItemData } from '../data/ItemData';
import { ITEMS } from '../data/Items';
import { Player } from '../Player';
import { Item } from '../Item';
import { AssetManager } from '../../core/AssetManager';

export class LootBoxUI extends PIXI.Container {
    private player: Player;
    private onChoice: () => void; // Callback to resume the game

    constructor(player: Player, onChoice: () => void) {
        super();
        this.player = player;
        this.onChoice = onChoice;
        this.interactive = true; // Block clicks from propagating to the game world
        this.createUI();
    }

    private createUI() {
        // Background overlay
        const overlay = new PIXI.Graphics();
        const screen = (this.parent as any)?.renderer.screen;
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, screen.width, screen.height);
        overlay.endFill();
        this.addChild(overlay);

        // Get 3 random items
        const itemKeys = Object.keys(ITEMS);
        const choices: ItemData[] = [];
        while (choices.length < 3 && itemKeys.length > 0) {
            const randomIndex = Math.floor(Math.random() * itemKeys.length);
            const key = itemKeys.splice(randomIndex, 1)[0];
            choices.push(ITEMS[key]);
        }

        // Display choices
        const choiceWidth = 200;
        const spacing = 50;
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
        const itemTexture = AssetManager.getTexture(itemData.textureAlias);
        if (itemTexture) {
            const newItem = new Item(itemTexture);
            // Here you would add the item's effect to the player

            if (this.player.backpack.addItem(newItem)) {
                console.log(`Added ${itemData.name} to backpack.`);
            } else {
                console.log("Backpack is full!");
                // What to do if backpack is full? For now, the item is lost.
            }
        }

        this.onChoice(); // Resume game
        this.destroy();
    }
}
