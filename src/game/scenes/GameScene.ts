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

export class GameScene implements IScene {
    public container: PIXI.Container;
    private player: Player;
    private isPaused: boolean = false;
    private enemyManager: EnemyManager;
    private experienceManager: ExperienceManager;
    private weaponManager: WeaponManager;
    private treasureManager: TreasureManager;

    constructor() {
        this.container = new PIXI.Container();
        this.experienceManager = new ExperienceManager(this.container);
        this.treasureManager = new TreasureManager(this.container);
        this.enemyManager = new EnemyManager(this.container, this.experienceManager, this.treasureManager);
        this.weaponManager = new WeaponManager(this.container, this.enemyManager);
    }

    public init(): void {
        const playerTexture = AssetManager.getTexture('player');
        if (playerTexture) {
            this.player = new Player(playerTexture);
            // Accessing screen dimensions through the renderer
            const screen = (this.container.parent as any)?.renderer.screen;
            if (screen) {
                this.player.x = screen.width / 2;
                this.player.y = screen.height / 2;
            }
            this.container.addChild(this.player);

            // Add backpack to UI
            this.player.backpack.x = screen.width - this.player.backpack.width - 20;
            this.player.backpack.y = screen.height - this.player.backpack.height - 20;
            UIManager.container.addChild(this.player.backpack);
        }
    }

    public update(delta: PIXI.Ticker): void {
        if (this.isPaused || !this.player) return;

        this.player.update(delta.deltaTime);
        this.enemyManager.update(delta.deltaTime, this.player.position);
        this.experienceManager.update(delta.deltaTime, this.player);
        this.weaponManager.update(delta.deltaTime, this.player);
        this.treasureManager.update(delta.deltaTime, this.player, () => this.showLootBoxUI());

        this.checkCollisions();
    }

    public showLootBoxUI() {
        this.isPaused = true;
        const lootBoxUI = new LootBoxUI(this.player, () => {
            this.isPaused = false;
        });
        UIManager.container.addChild(lootBoxUI);
    }

    private checkCollisions(): void {
        const enemies = this.enemyManager.getEnemies();
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];

            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (this.player.width / 2) + (enemy.width / 2)) {
                console.log("Player hit by enemy!");
                // Damage enemy for now, later player will take damage
                enemy.takeDamage(1);
            }
        }
    }

    public destroy(): void {
        this.container.destroy();
    }
}
