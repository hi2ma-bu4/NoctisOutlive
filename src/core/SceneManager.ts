import * as PIXI from 'pixi.js';
import { IScene } from './IScene';
import { StageManager } from './StageManager';
import { SoundManager } from './SoundManager';

export class SceneManager {
    private static currentScene: IScene | null = null;
    private static app: PIXI.Application;
    public static onSceneChange: ((newScene: IScene) => void) | null = null;

    public static init(app: PIXI.Application) {
        this.app = app;
    }

    public static changeScene(newScene: IScene) {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene.container);
            this.currentScene.destroy();
        }
        this.currentScene = newScene;
        this.currentScene.init();
        this.app.stage.addChild(this.currentScene.container);

        // Play music based on the current stage
        const currentStage = StageManager.getCurrentStage();
        if (currentStage && currentStage.music) {
            SoundManager.playMusic(currentStage.music);
        } else {
            // Default music for scenes without a stage (like StageSelect)
            SoundManager.playMusic('music_menu'); // Assuming a menu music track exists
        }

        if (this.onSceneChange) {
            this.onSceneChange(newScene);
        }
    }

    public static update(delta: PIXI.Ticker) {
        if (this.currentScene) {
            this.currentScene.update(delta);
        }
    }

    public static getSceneContainer(): PIXI.Container | null {
        return this.currentScene ? this.currentScene.container : null;
    }
}
