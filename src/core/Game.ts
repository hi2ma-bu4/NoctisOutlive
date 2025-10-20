import * as PIXI from 'pixi.js';
import { AssetManager } from './AssetManager';
import { SoundManager } from './SoundManager';
import { Player } from '../game/Player';

export class Game {
    private app: PIXI.Application;

    constructor() {
        this.app = new PIXI.Application();
        this.init();
    }

    private async init() {
        await AssetManager.init();
        await SoundManager.init();

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

        await this.loadAssets();

        // Start the game loop
        this.app.ticker.add(delta => this.update(delta));
    }

    private async loadAssets() {
        const textures = await AssetManager.loadBundle('game-assets');

        const playerTexture = textures['player'];
        if (playerTexture) {
            const player = new Player(playerTexture);
            player.x = this.app.screen.width / 2;
            player.y = this.app.screen.height / 2;
            this.app.stage.addChild(player);
        }

        SoundManager.play('test_sound', true);
    }

    private update(delta: PIXI.Ticker) {
        // Game logic goes here
    }
}
