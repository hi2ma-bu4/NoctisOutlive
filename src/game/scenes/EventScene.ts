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
        // Clear the choice buttons
        this.container.children.filter(child => child.interactive).forEach(child => child.destroy());

        let resultText = "Outcome:\n";
        choice.effects.forEach(effect => {
            resultText += this.applyEffect(effect) + "\n";
        });

        if (choice.effects.length === 0) {
            resultText += "Nothing happened.";
        }

        this.showResult(resultText);
    }

    private applyEffect(effect: ItemEffect): string {
        switch(effect.type) {
            case 'add_item':
                const itemData = itemDatabase.find(i => i.id === effect.value);
                if (itemData) {
                    const success = this.playerData.backpack.addItem(itemData);
                    return success ? `Added ${itemData.name} to backpack.` : `Backpack is full, lost ${itemData.name}.`;
                }
                return `Could not find item with id: ${effect.value}`;
            case 'lose_money':
                const amount = effect.value as number;
                this.playerData.money = Math.max(0, this.playerData.money - amount);
                return `Lost ${amount} money.`;
            // Note: 'health_increase' and other combat stats are not applied here as they are not persistent.
            // A more complex system would be needed for permanent stat boosts.
            default:
                console.warn(`Unhandled event effect type: ${effect.type}`);
                return `An unknown effect occurred.`;
        }
    }

    private showResult(resultText: string): void {
        const screen = { width: 1280, height: 720 };

        const resultLabel = new PIXI.Text(resultText, { fontSize: 28, fill: 0xCCCCCC, wordWrap: true, wordWrapWidth: 700, align: 'center' });
        resultLabel.anchor.set(0.5);
        resultLabel.x = screen.width / 2;
        resultLabel.y = screen.height / 2 + 50;
        this.container.addChild(resultLabel);

        const continueButton = new PIXI.Graphics()
            .rect(0, 0, 200, 80)
            .fill(0x00AA00);
        const continueText = new PIXI.Text('Continue', { fontSize: 24, fill: 0xFFFFFF });
        continueText.anchor.set(0.5);
        continueText.position.set(100, 40);
        continueButton.addChild(continueText);

        continueButton.x = screen.width / 2 - 100;
        continueButton.y = screen.height - 150;
        continueButton.interactive = true;
        continueButton.cursor = 'pointer';
        continueButton.on('pointertap', () => SceneManager.changeScene('stage_select'));

        this.container.addChild(continueButton);
    }

    public update(delta: PIXI.Ticker): void {}

    public destroy(): void {
        this.container.destroy({ children: true });
    }
}
