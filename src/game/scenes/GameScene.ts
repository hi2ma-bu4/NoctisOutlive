import * as PIXI from 'pixi.js';
import { IScene } from '../../core/IScene';
import { Player } from '../Player';
import { AssetManager } from '../../core/AssetManager';
import { UIManager } from '../../core/UIManager';
import { EnemyManager } from '../EnemyManager';
import { ExperienceManager } from '../ExperienceManager';
import { WeaponManager } from '../WeaponManager';
import { TreasureManager } from '../TreasureManager';
import { CollisionManager } from '../../core/CollisionManager';
import { RewardScreen } from '../ui/RewardScreen';
import { BackpackScreen } from '../ui/BackpackScreen';
import { IReward, RewardManager } from '../../core/RewardManager';
import { InputManager } from '../../core/InputManager';
import { PlayerData } from '../../core/PlayerData';
import { GameOverScreen } from '../ui/GameOverScreen';

enum GameState {
    PLAYING,
    PAUSED,
    REWARD,
    GAME_OVER,
}

export class GameScene implements IScene {
    public container: PIXI.Container;
    private player: Player;
    private state: GameState = GameState.PLAYING;
    private stageTimer: number = 0;

    // Managers
    private enemyManager: EnemyManager;
    private experienceManager: ExperienceManager;
    private weaponManager: WeaponManager;
    private treasureManager: TreasureManager;
    private collisionManager: CollisionManager;

    constructor() {
        this.container = new PIXI.Container();
    }

    public init(): void {
        UIManager.showGameHUD();
        const playerTexture = AssetManager.getTexture('player');
        if (!playerTexture) {
            console.error("Player texture not found!");
            return;
        }

        this.player = new Player(playerTexture);

        // Load persistent data BEFORE adding backpack to UI
        const playerData = PlayerData.getInstance();
        this.player.backpack = playerData.backpack;

        const screen = (this.container.parent as any)?.renderer.screen;
        if (screen) {
            this.player.x = screen.width / 2;
            this.player.y = screen.height / 2;
        }
        this.container.addChild(this.player);

        // Initialize Managers
        this.experienceManager = new ExperienceManager(this.container, this.player, () => this.handleLevelUp());
        this.treasureManager = new TreasureManager(this.container, (rewards) => this.showRewardScreen(rewards));
        this.enemyManager = new EnemyManager(this.container, this.experienceManager, this.treasureManager);
        this.weaponManager = new WeaponManager(this.container, this.enemyManager);
        this.collisionManager = new CollisionManager(this.player, this.enemyManager, this.weaponManager, this.experienceManager, this.treasureManager);
        this.enemyManager.setCollisionManager(this.collisionManager);

        // Add backpack to UI
        this.player.backpack.x = screen.width - this.player.backpack.width - 20;
        this.player.backpack.y = screen.height - this.player.backpack.height - 20;
        UIManager.container.addChild(this.player.backpack);
    }

    private handleLevelUp(): void {
        console.log("Level up detected! Generating rewards...");
        SoundManager.playSfx('sfx_level_up');
        const rewards = RewardManager.generateRewards(3);
        this.showRewardScreen(rewards);
    }

    private showRewardScreen(rewards: IReward[]): void {
        this.state = GameState.REWARD;
        const rewardScreen = new RewardScreen(this.player, rewards, () => {
            this.state = GameState.PLAYING;
        });
        UIManager.container.addChild(rewardScreen);
    }

    private toggleBackpackScreen(): void {
        if (this.state === GameState.PLAYING) {
            this.state = GameState.PAUSED;
            const backpackScreen = new BackpackScreen(this.player.backpack, () => {
                this.state = GameState.PLAYING;
            });
            UIManager.container.addChild(backpackScreen);
        } else if (this.state === GameState.PAUSED) {
            // This assumes the only reason for PAUSED is the backpack screen.
            // A more robust state machine would be needed if there were other pauses (like a pause menu).
            const backpackScreen = UIManager.container.getChildByName('BackpackScreen');
            if (backpackScreen instanceof BackpackScreen) {
                backpackScreen.close();
            } else {
                // Fallback if the screen wasn't found - just unpause.
                this.state = GameState.PLAYING;
            }
        }
    }

    public update(delta: PIXI.Ticker): void {
        if (InputManager.isKeyJustPressed('KeyB')) {
            this.toggleBackpackScreen();
        }

        if (this.state !== GameState.PLAYING || !this.player) return;

        this.stageTimer += delta.deltaTime / 60;

        this.player.update(delta.deltaTime);
        this.enemyManager.update(delta.deltaTime, this.player);
        this.experienceManager.update(delta.deltaTime);
        this.weaponManager.update(delta.deltaTime, this.player);
        this.treasureManager.update(delta.deltaTime, this.player);
        this.collisionManager.update();
        UIManager.updateGameHUD(this.player, this.stageTimer);

        if (this.player.isDead()) {
            this.handlePlayerDeath();
        }
    }

    private handlePlayerDeath(): void {
        if (this.state === GameState.GAME_OVER) return; // Prevent multiple calls
        this.state = GameState.GAME_OVER;
        console.log("Player has died. Game Over.");

        const gameOverScreen = new GameOverScreen();
        UIManager.container.addChild(gameOverScreen);
    }

    public destroy(): void {
        // Save persistent data before destroying
        const playerData = PlayerData.getInstance();
        playerData.setBackpack(this.player.backpack);

        UIManager.hideGameHUD();
        if (this.collisionManager) {
            this.collisionManager.destroy();
        }
        this.container.destroy({ children: true, texture: true, baseTexture: true });
    }
}
