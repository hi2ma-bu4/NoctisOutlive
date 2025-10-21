import * as PIXI from 'pixi.js';
import { IScene } from './IScene';
import { StageManager } from './StageManager';
import { SoundManager } from './SoundManager';
import { StageType } from '../game/data/StageData';

// Import all scene types
import { GameScene } from '../game/scenes/GameScene';
import { ShopScene } from '../game/scenes/ShopScene';
import { EventScene } from '../game/scenes/EventScene';
import { StageSelectScene } from '../game/scenes/StageSelectScene';

export class SceneManager {
    private static currentScene: IScene | null = null;
    private static app: PIXI.Application;
    public static onSceneChange: ((newScene: IScene) => void) | null = null;

    public static init(app: PIXI.Application) {
        this.app = app;
        StageManager.init();
    }

    public static changeScene(stageId: string) {
        const stage = StageManager.getStage(stageId);
        if (!stage) {
            console.error(`Cannot change scene: Stage with id '${stageId}' not found.`);
            // As a fallback, maybe go to the stage select screen
            if (stageId !== 'stage_select') {
                this.changeScene('stage_select');
            }
            return;
        }

        StageManager.setCurrentStage(stageId);

        let newScene: IScene;

        switch (stage.type) {
            case StageType.STANDARD:
            case StageType.HIGH_DIFFICULTY:
                newScene = new GameScene();
                break;
            case StageType.SHOP:
                newScene = new ShopScene();
                break;
            case StageType.EVENT:
                newScene = new EventScene();
                break;
            // A special case for the main menu/stage select
            case 'system_scene' as any: // Using 'as any' to handle a non-standard type
                 newScene = new StageSelectScene();
                 break;
            default:
                console.error(`Unknown stage type: ${stage.type}`);
                newScene = new StageSelectScene(); // Default to stage select
                break;
        }

        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene.container);
            this.currentScene.destroy();
        }
        this.currentScene = newScene;
        this.currentScene.init();
        this.app.stage.addChild(this.currentScene.container);

        if (stage && stage.music) {
            SoundManager.playMusic(stage.music);
        } else {
            SoundManager.playMusic('music_menu');
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
