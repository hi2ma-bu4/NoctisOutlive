// src/game/scenes/ShopScene.ts

import * as PIXI from 'pixi.js';
import { IScene } from '../../core/IScene';
import { SceneManager } from '../../core/SceneManager';
import { StageSelectScene } from './StageSelectScene'; // For back button

export class ShopScene implements IScene {
    public container: PIXI.Container;

    constructor() {
        this.container = new PIXI.Container();
    }

    public init(): void {
        const title = new PIXI.Text('Shop', {
            fontSize: 48,
            fill: 0xFFFF00,
        });
        title.anchor.set(0.5);
        title.x = window.innerWidth / 2;
        title.y = 100;
        this.container.addChild(title);

        const backButton = new PIXI.Text('Back to Stage Select', {
            fontSize: 24,
            fill: 0xFFFFFF,
        });
        backButton.anchor.set(0.5);
        backButton.x = window.innerWidth / 2;
        backButton.y = window.innerHeight - 100;
        backButton.interactive = true;
        backButton.cursor = 'pointer';

        backButton.on('pointertap', () => {
            SceneManager.changeScene(new StageSelectScene());
        });

        this.container.addChild(backButton);
    }

    public update(delta: PIXI.Ticker): void {
        // Shop-specific logic will go here
    }

    public destroy(): void {
        this.container.destroy({ children: true, texture: true, baseTexture: true });
    }
}
