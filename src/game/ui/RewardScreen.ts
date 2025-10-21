// src/game/ui/RewardScreen.ts

import * as PIXI from 'pixi.js';
import { ItemChoice } from './ItemChoice';
import { ItemData, ItemType } from '../data/ItemData';
import { Player } from '../Player';
import { IReward } from '../../core/RewardManager';

export class RewardScreen extends PIXI.Container {
    private player: Player;
    private onChoice: () => void; // Callback to resume the game

    constructor(player: Player, rewards: IReward[], onChoice: () => void) {
        super();
        this.player = player;
        this.onChoice = onChoice;
        this.interactive = true; // Absorb clicks on the overlay
        this.createUI(rewards);
    }

    private createUI(rewards: IReward[]) {
        // This logic assumes the screen size is available via the renderer.
        // It might be better to pass screen dimensions to the constructor.
        const screen = (this.parent as any)?.renderer.screen || { width: 1280, height: 720 };

        // Background overlay
        const overlay = new PIXI.Graphics();
        overlay.rect(0, 0, screen.width, screen.height);
        overlay.fill({ color: 0x000000, alpha: 0.8 });
        this.addChild(overlay);

        // Title
        const title = new PIXI.Text('Choose a Reward!', { fontSize: 48, fill: 0xFFD700, fontWeight: 'bold' });
        title.anchor.set(0.5);
        title.x = screen.width / 2;
        title.y = 150;
        this.addChild(title);

        // Display choices
        const choiceWidth = 200; // From ItemChoice
        const spacing = 60;
        const totalWidth = (choiceWidth * rewards.length) + (spacing * (rewards.length - 1));
        const startX = (screen.width - totalWidth) / 2;

        rewards.forEach((reward, index) => {
            // For now, we assume all rewards are items
            const itemData = reward.data;
            const itemChoice = new ItemChoice(itemData);
            itemChoice.x = startX + index * (choiceWidth + spacing);
            itemChoice.y = (screen.height - itemChoice.height) / 2;

            itemChoice.on('pointertap', () => this.selectReward(reward));
            this.addChild(itemChoice);
        });
    }

    private selectReward(reward: IReward) {
        // For now, we only handle item rewards
        const itemData = reward.data;

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
