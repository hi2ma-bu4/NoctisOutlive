// src/core/UIManager.ts

import * as PIXI from 'pixi.js';
import { GameHUD } from '../game/ui/GameHUD';
import { BossHUD } from '../game/ui/BossHUD';
import { Player } from '../game/Player';

export class UIManager {
    public static container: PIXI.Container;
    private static app: PIXI.Application;
    private static gameHUD: GameHUD | null = null;
    private static bossHUD: BossHUD | null = null;

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

    // === Boss HUD Methods ===

    public static showBossHUD(bossName: string): void {
        if (!this.bossHUD) {
            this.bossHUD = new BossHUD();
            // Position the HUD at the top center of the screen
            this.bossHUD.x = (this.app.screen.width - this.bossHUD.width) / 2;
            this.bossHUD.y = 40;
            this.container.addChild(this.bossHUD);
        }
        this.bossHUD.show(bossName);
    }

    public static updateBossHUD(currentHealth: number, maxHealth: number): void {
        if (this.bossHUD && this.bossHUD.visible) {
            this.bossHUD.updateHealth(currentHealth, maxHealth);
        }
    }

    public static hideBossHUD(): void {
        if (this.bossHUD) {
            this.bossHUD.visible = false;
        }
    }
}
