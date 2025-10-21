// src/game/scenes/EventScene.ts

import * as PIXI from 'pixi.js';
import { IScene } from '../../core/IScene';
import { SceneManager } from '../../core/SceneManager';
import { StageSelectScene } from './StageSelectScene';
import { PlayerData } from '../../core/PlayerData';
import { eventDatabase, EventChoice, EventData } from '../data/EventData';
import { itemDatabase } from '../data/Items'; // Needed for adding items
import { ItemEffect } from '../data/ItemData';

export class EventScene implements IScene {
    public container: PIXI.Container;
    private playerData: PlayerData;
    private currentEvent: EventData;

    constructor() {
        this.container = new PIXI.Container();
        this.playerData = PlayerData.getInstance();

        // Pick a random event for the scene
        this.currentEvent = eventDatabase[Math.floor(Math.random() * eventDatabase.length)];
    }

    public init(): void {
        this.setupUI();
    }

    private setupUI(): void {
        const screen = { width: 1280, height: 720 };

        // Background panel
        const panel = new PIXI.Graphics()
            .rect(screen.width / 2 - 400, screen.height / 2 - 250, 800, 500)
            .fill({ color: 0x222222, alpha: 0.9 })
            .stroke({ width: 2, color: 0xAAAAAA });
        this.container.addChild(panel);

        const title = new PIXI.Text(this.currentEvent.title, { fontSize: 40, fill: 0xFFD700, wordWrap: true, wordWrapWidth: 750 });
        title.anchor.set(0.5, 0);
        title.x = screen.width / 2;
        title.y = panel.y + 40;
        this.container.addChild(title);

        const mainText = new PIXI.Text(this.currentEvent.mainText, { fontSize: 24, fill: 0xFFFFFF, wordWrap: true, wordWrapWidth: 700 });
        mainText.anchor.set(0.5, 0);
        mainText.x = screen.width / 2;
        mainText.y = title.y + 80;
        this.container.addChild(mainText);

        // Display choices as buttons
        this.renderChoices(screen, panel);
    }

    private renderChoices(screen: { width: number, height: number }, panel: PIXI.Graphics): void {
        const choiceCount = this.currentEvent.choices.length;
        const buttonWidth = 300;
        const buttonHeight = 100;
        const spacing = 40;
        const totalHeight = (buttonHeight * choiceCount) + (spacing * (choiceCount - 1));
        const startY = panel.y + panel.height - totalHeight - 40;

        this.currentEvent.choices.forEach((choice, index) => {
            const button = new PIXI.Graphics()
                .rect(0, 0, buttonWidth, buttonHeight)
                .fill(0x555555)
                .stroke({ width: 1, color: 0xCCCCCC });

            const buttonText = new PIXI.Text(choice.text, { fontSize: 20, fill: 0xFFFFFF, wordWrap: true, wordWrapWidth: buttonWidth - 20, align: 'center' });
            buttonText.anchor.set(0.5);
            buttonText.position.set(buttonWidth / 2, buttonHeight / 2);
            button.addChild(buttonText);

            button.x = screen.width / 2 - buttonWidth / 2;
            button.y = startY + index * (buttonHeight + spacing);

            button.interactive = true;
            button.cursor = 'pointer';
            button.on('pointertap', () => this.handleChoice(choice));

            this.container.addChild(button);
        });
    }

    private handleChoice(choice: EventChoice): void {
        console.log(`Player chose: "${choice.text}"`);

        // Apply effects
        choice.effects.forEach(effect => {
            this.applyEffect(effect);
        });

        // After making a choice, return to the stage select screen
        SceneManager.changeScene(new StageSelectScene());
    }

    private applyEffect(effect: ItemEffect): void {
        // This effect handler needs to be more robust
        switch(effect.type) {
            case 'health_increase':
                // This would be better applied to the player object itself in GameScene,
                // but for now we can't do that. This highlights the need for persistent player stats
                // beyond just backpack and money. For now, this effect does nothing outside of combat.
                console.log(`Health increase effect of ${effect.value} cannot be applied here.`);
                break;
            case 'add_item':
                const itemData = itemDatabase.find(i => i.id === effect.value);
                if (itemData) {
                    this.playerData.backpack.addItem(itemData);
                    console.log(`Added ${itemData.name} to backpack.`);
                }
                break;
            case 'lose_money':
                this.playerData.money = Math.max(0, this.playerData.money - effect.value);
                console.log(`Lost ${effect.value} money.`);
                break;
            default:
                console.warn(`Unhandled event effect type: ${effect.type}`);
        }
    }

    public update(delta: PIXI.Ticker): void {}

    public destroy(): void {
        this.container.destroy({ children: true });
    }
}
