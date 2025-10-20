import * as PIXI from 'pixi.js';
import { IScene } from '../../core/IScene';
import { SceneManager } from '../../core/SceneManager';
import { StageManager } from '../../core/StageManager';
import { GameScene } from './GameScene';

export class StageSelectScene implements IScene {
    public container: PIXI.Container;

    constructor() {
        this.container = new PIXI.Container();
    }

    public init(): void {
        const title = new PIXI.Text('Select a Stage', { fontSize: 48, fill: 0xFFFFFF });
        title.x = (window.innerWidth - title.width) / 2;
        title.y = 100;
        this.container.addChild(title);

        const stageButton = new PIXI.Graphics();
        stageButton.beginFill(0x00AA00);
        stageButton.drawRect(0, 0, 300, 100);
        stageButton.endFill();
        stageButton.x = (window.innerWidth - stageButton.width) / 2;
        stageButton.y = 300;
        stageButton.interactive = true;
        stageButton.cursor = 'pointer';

        const buttonText = new PIXI.Text('Stage 1: Forest', { fontSize: 24, fill: 0xFFFFFF });
        buttonText.x = (stageButton.width - buttonText.width) / 2;
        buttonText.y = (stageButton.height - buttonText.height) / 2;
        stageButton.addChild(buttonText);

        stageButton.on('pointertap', () => {
            StageManager.setCurrentStage('stage1');
            SceneManager.changeScene(new GameScene());
        });

        this.container.addChild(stageButton);
    }

    public update(delta: PIXI.Ticker): void {
        // No update logic needed for this simple scene
    }

    public destroy(): void {
        this.container.destroy();
    }
}
