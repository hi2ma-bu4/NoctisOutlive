import * as PIXI from 'pixi.js';
import { IScene } from '../../core/IScene';
import { Player } from '../Player';
import { AssetManager } from '../../core/AssetManager';
import { UIManager } from '../../core/UIManager';
import { EnemyManager } from '../EnemyManager';
import { ExperienceManager } from '../ExperienceManager';
import { WeaponManager } from '../WeaponManager';
import { TreasureManager } from '../TreasureManager';

import { LootBoxUI } from '../ui/LootBoxUI';
import { CollisionManager } from '../../core/CollisionManager';

export class GameScene implements IScene {
    public container: PIXI.Container;
    private player: Player;
    private isPaused: boolean = false;
    private stageTimer: number = 0;
    private enemyManager: EnemyManager;
    private experienceManager: ExperienceManager;
    private weaponManager: WeaponManager;
    private treasureManager: TreasureManager;
    private collisionManager: CollisionManager;

    constructor() {
        this.container = new PIXI.Container();
        this.experienceManager = new ExperienceManager(this.container);
        this.treasureManager = new TreasureManager(this.container, () => this.showLootBoxUI());
        this.enemyManager = new EnemyManager(this.container, this.experienceManager, this.treasureManager);
    }

    public init(): void {
        UIManager.showGameHUD();
        const playerTexture = AssetManager.getTexture('player');
        if (!playerTexture) {
            console.error("Player texture not found!");
            return;
        }

        this.player = new Player(playerTexture);
        const screen = (this.container.parent as any)?.renderer.screen;
        if (screen) {
            this.player.x = screen.width / 2;
            this.player.y = screen.height / 2;
        }
        this.container.addChild(this.player);

        // WeaponManager must be created after Player
        this.weaponManager = new WeaponManager(this.container, this.enemyManager);

        // CollisionManager must be created after all other managers
        this.collisionManager = new CollisionManager(this.player, this.enemyManager, this.weaponManager, this.experienceManager, this.treasureManager);

        // Add backpack to UI
        this.player.backpack.x = screen.width - this.player.backpack.width - 20;
        this.player.backpack.y = screen.height - this.player.backpack.height - 20;
        UIManager.container.addChild(this.player.backpack);
    }

    public update(delta: PIXI.Ticker): void {
        if (this.isPaused || !this.player) return;

        this.stageTimer += delta.deltaTime / 60; // Update timer in seconds

        this.player.update(delta.deltaTime);
        this.enemyManager.update(delta.deltaTime, this.player.position);
        this.experienceManager.update(delta.deltaTime);
        this.weaponManager.update(delta.deltaTime, this.player);
        this.treasureManager.update(delta.deltaTime, this.player);
        this.collisionManager.update();
        UIManager.updateGameHUD(this.player, this.stageTimer);
    }

    public showLootBoxUI() {
        this.isPaused = true;
        const lootBoxUI = new LootBoxUI(this.player, () => {
            this.isPaused = false;
        });
        UIManager.container.addChild(lootBoxUI);
    }

    public destroy(): void {
        UIManager.hideGameHUD();
        this.collisionManager.destroy();
        this.container.destroy({ children: true, texture: true, baseTexture: true });
    }
}
