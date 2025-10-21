// src/core/UIManager.ts

import * as PIXI from 'pixi.js';
import { GameHUD } from '../game/ui/GameHUD';
import { Player } from '../game/Player';

export class UIManager {
    public static container: PIXI.Container;
    private static app: PIXI.Application;
    private static gameHUD: GameHUD | null = null;

    public static init(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
    }

    public static update(delta: number) {
        // This method is less useful now that updates are more specific
    }

    public static showGameHUD(): void {
        if (this.gameHUD) {
            this.gameHUD.destroy();
        }
        this.gameHUD = new GameHUD();
        this.container.addChild(this.gameHUD);
    }

    public static hideGameHUD(): void {
        if (this.gameHUD) {
            this.gameHUD.destroy();
            this.gameHUD = null;
        }
    }

    public static updateGameHUD(player: Player, stageTimer: number): void {
        if (this.gameHUD) {
            this.gameHUD.update(player, stageTimer);
        }
    }
}
