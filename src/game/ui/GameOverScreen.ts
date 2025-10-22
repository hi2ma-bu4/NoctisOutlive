// src/game/ui/GameOverScreen.ts

import * as PIXI from 'pixi.js';
import { SceneManager } from '../../core/SceneManager';

export class GameOverScreen extends PIXI.Container {

    constructor() {
        super();
        this.interactive = true;
        this.createUI();
    }

    private createUI() {
        const screen = { width: window.innerWidth, height: window.innerHeight };

        // Background overlay
        const overlay = new PIXI.Graphics();
        overlay.rect(0, 0, screen.width, screen.height);
        overlay.fill({ color: 0x000000, alpha: 0.9 });
        this.addChild(overlay);

        // Game Over Text
        const title = new PIXI.Text('GAME OVER', {
            fontSize: 72,
            fill: 0xFF0000,
            fontWeight: 'bold',
            stroke: 0xCCCCCC,
            strokeThickness: 6,
        });
        title.anchor.set(0.5);
        title.x = screen.width / 2;
        title.y = screen.height / 2 - 100;
        this.addChild(title);

        // Return to Menu Button
        const button = new PIXI.Graphics();
        button.rect(0, 0, 300, 80);
        button.fill(0x555555);
        button.stroke({ width: 4, color: 0xAAAAAA });
        button.x = (screen.width - 300) / 2;
        button.y = screen.height / 2 + 50;
        button.interactive = true;
        button.cursor = 'pointer';

        const buttonText = new PIXI.Text('Return to Menu', {
            fontSize: 28,
            fill: 0xFFFFFF,
        });
        buttonText.anchor.set(0.5);
        buttonText.x = 150;
        buttonText.y = 40;
        button.addChild(buttonText);

        button.on('pointertap', () => {
            // Use the SceneManager to go back to the stage select screen
            SceneManager.changeScene('stage_select');
        });

        this.addChild(button);
    }
}
