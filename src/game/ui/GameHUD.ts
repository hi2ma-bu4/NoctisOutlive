// src/game/ui/GameHUD.ts

import * as PIXI from 'pixi.js';
import { Player } from '../Player';

export class GameHUD extends PIXI.Container {
    private hpBar: PIXI.Graphics;
    private hpText: PIXI.Text;
    private levelText: PIXI.Text;
    private timerText: PIXI.Text;
    private expBar: PIXI.Graphics;

    constructor() {
        super();
        this.setupUI();
    }

    private setupUI(): void {
        const barWidth = 200;
        const barHeight = 20;
        const expBarHeight = 10;

        // HP Bar
        const hpBarContainer = new PIXI.Container();
        hpBarContainer.position.set(20, 20);
        this.addChild(hpBarContainer);

        const hpBarBackground = new PIXI.Graphics();
        hpBarBackground.rect(0, 0, barWidth, barHeight);
        hpBarBackground.fill(0x000000, 0.7);
        hpBarContainer.addChild(hpBarBackground);

        this.hpBar = new PIXI.Graphics();
        hpBarContainer.addChild(this.hpBar);

        this.hpText = new PIXI.Text('', { fontSize: 14, fill: 0xFFFFFF, fontWeight: 'bold' });
        this.hpText.anchor.set(0.5);
        this.hpText.position.set(barWidth / 2, barHeight / 2);
        hpBarContainer.addChild(this.hpText);

        // Experience Bar
        const expBarContainer = new PIXI.Container();
        expBarContainer.position.set(20, 45); // Below HP bar
        this.addChild(expBarContainer);

        const expBarBackground = new PIXI.Graphics();
        expBarBackground.rect(0, 0, barWidth, expBarHeight);
        expBarBackground.fill(0x000000, 0.7);
        expBarContainer.addChild(expBarBackground);

        this.expBar = new PIXI.Graphics();
        expBarContainer.addChild(this.expBar);

        // Level Text
        this.levelText = new PIXI.Text('Level: 1', { fontSize: 24, fill: 0xFFD700, stroke: { color: 0x000000, width: 4 }});
        this.levelText.position.set(20, 60); // Pushed down
        this.addChild(this.levelText);

        // Timer Text
        this.timerText = new PIXI.Text('00:00', { fontSize: 32, fill: 0xFFFFFF, stroke: { color: 0x000000, width: 5 }});
        this.timerText.anchor.set(0.5, 0);
        this.timerText.position.set(window.innerWidth / 2, 20);
        this.addChild(this.timerText);
    }

    public update(player: Player, stageTimer: number): void {
        // Update HP Bar
        const hpPercent = player.currentHealth / player.maxHealth;
        this.hpBar.clear();
        this.hpBar.rect(0, 0, 200 * hpPercent, 20);
        this.hpBar.fill(0xFF0000);
        this.hpText.text = `${Math.ceil(player.currentHealth)} / ${player.maxHealth}`;

        // Update Experience Bar
        const expPercent = player.experience / player.experienceToNextLevel;
        this.expBar.clear();
        this.expBar.rect(0, 0, 200 * expPercent, 10);
        this.expBar.fill(0x32CD32); // LimeGreen for experience

        // Update Level Text
        this.levelText.text = `Level: ${player.level}`;

        // Update Timer
        const minutes = Math.floor(stageTimer / 60).toString().padStart(2, '0');
        const seconds = Math.floor(stageTimer % 60).toString().padStart(2, '0');
        this.timerText.text = `${minutes}:${seconds}`;
    }
}
