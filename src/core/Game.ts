import * as PIXI from 'pixi.js';
import { AssetManager } from './AssetManager';
import { SoundManager } from './SoundManager';
import { SceneManager } from './SceneManager';
import { StageSelectScene } from '../game/scenes/StageSelectScene';
import { InputManager } from './InputManager';
import { UIManager } from './UIManager';
import { EffectManager } from './EffectManager';

export class Game {
    private app: PIXI.Application;

    constructor() {
        this.app = new PIXI.Application();
        this.init();
    }

    private async init() {
        await AssetManager.init();
        await SoundManager.init();
        InputManager.init();

        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
            resizeTo: window
        });

        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(this.app.canvas);
        } else {
            console.error('Could not find #game-container element.');
            return;
        }

        SceneManager.init(this.app);
        UIManager.init(this.app);
        SceneManager.onSceneChange = (newScene) => {
            EffectManager.init(newScene.container);
        };

        // Load assets and change to the first scene
        await this.loadAssetsAndStart();

        // Start the game loop
        this.app.ticker.add(delta => this.update(delta));
    }

    private async loadAssetsAndStart() {
        await AssetManager.loadBundle('game-assets');

        const stageSelectScene = new StageSelectScene();
        SceneManager.changeScene(stageSelectScene);
    }

    private update(delta: PIXI.Ticker) {
        SceneManager.update(delta);
        UIManager.update(delta.deltaTime);
        EffectManager.update(delta.deltaTime);
    }
}
