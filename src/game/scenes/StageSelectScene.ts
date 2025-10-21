// src/game/scenes/StageSelectScene.ts

import * as PIXI from 'pixi.js';
import { IScene } from '../../core/IScene';
import { SceneManager } from '../../core/SceneManager';
import { StageManager } from '../../core/StageManager';
import { GameScene } from './GameScene';
import { ShopScene } from './ShopScene';
import { EventScene } from './EventScene';
import { StageType } from '../data/StageData';

export class StageSelectScene implements IScene {
    public container: PIXI.Container;

    constructor() {
        this.container = new PIXI.Container();
    }

    public init(): void {
        const title = new PIXI.Text('Select a Stage', {
            fontSize: 48,
            fill: 0xFFFFFF,
            stroke: 0x000000,
            strokeThickness: 6,
        });
        title.anchor.set(0.5);
        title.x = window.innerWidth / 2;
        title.y = 100;
        this.container.addChild(title);

        StageManager.init(); // Initialize the stages
        const allStages = StageManager.getAllStages();
        const buttonWidth = 400;
        const buttonHeight = 120;
        const padding = 20;
        const startY = 200;

        allStages.forEach((stage, index) => {
            const button = new PIXI.Graphics();
            button.rect(0, 0, buttonWidth, buttonHeight);
            button.fill(0x00AA00);
            button.stroke({ width: 4, color: 0x006600 });
            button.x = (window.innerWidth - buttonWidth) / 2;
            button.y = startY + index * (buttonHeight + padding);
            button.interactive = true;
            button.cursor = 'pointer';

            const buttonTextName = new PIXI.Text(stage.name, {
                fontSize: 28,
                fill: 0xFFFFFF,
                wordWrap: true,
                wordWrapWidth: buttonWidth - 20,
            });
            buttonTextName.x = 15;
            buttonTextName.y = 15;
            button.addChild(buttonTextName);

            const buttonTextDesc = new PIXI.Text(stage.description, {
                fontSize: 18,
                fill: 0xDDDDDD,
                wordWrap: true,
                wordWrapWidth: buttonWidth - 20,
            });
            buttonTextDesc.x = 15;
            buttonTextDesc.y = buttonTextName.y + buttonTextName.height + 10;
            button.addChild(buttonTextDesc);

            button.on('pointertap', () => {
                StageManager.setCurrentStage(stage.id);
                switch (stage.type) {
                    case StageType.STANDARD:
                    case StageType.HIGH_DIFFICULTY:
                        SceneManager.changeScene(new GameScene());
                        break;
                    case StageType.SHOP:
                        SceneManager.changeScene(new ShopScene());
                        break;
                    case StageType.EVENT:
                        SceneManager.changeScene(new EventScene());
                        break;
                }
            });

            this.container.addChild(button);
        });
    }

    public update(delta: PIXI.Ticker): void {
        // No update logic needed for this scene
    }

    public destroy(): void {
        this.container.destroy({ children: true, texture: true, baseTexture: true });
    }
}
