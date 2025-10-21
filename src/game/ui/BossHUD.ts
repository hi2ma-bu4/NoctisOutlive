// src/game/ui/BossHUD.ts

import * as PIXI from 'pixi.js';

export class BossHUD extends PIXI.Container {
    private nameText: PIXI.Text;
    private healthBar: PIXI.Graphics;
    private healthBarBackground: PIXI.Graphics;
    private maxHealth: number = 0;
    private currentHealth: number = 0;

    private readonly BAR_WIDTH = 800;
    private readonly BAR_HEIGHT = 25;

    constructor() {
        super();

        // Background for the health bar
        this.healthBarBackground = new PIXI.Graphics();
        this.healthBarBackground.rect(0, 0, this.BAR_WIDTH, this.BAR_HEIGHT);
        this.healthBarBackground.fill(0x333333);
        this.healthBarBackground.stroke({ width: 2, color: 0x000000 });
        this.addChild(this.healthBarBackground);

        // The health bar itself
        this.healthBar = new PIXI.Graphics();
        this.addChild(this.healthBar);

        // Boss Name Text
        this.nameText = new PIXI.Text('', { fontSize: 32, fill: 0xFFFFFF, fontWeight: 'bold', stroke: { color: 0x000000, width: 4 } });
        this.nameText.anchor.set(0.5, 1);
        this.nameText.x = this.BAR_WIDTH / 2;
        this.nameText.y = -10; // Position above the bar
        this.addChild(this.nameText);
    }

    public show(name: string): void {
        this.nameText.text = name;
        this.visible = true;
    }

    public updateHealth(currentHealth: number, maxHealth: number): void {
        if (this.maxHealth !== maxHealth) {
            this.maxHealth = maxHealth;
        }
        this.currentHealth = Math.max(0, currentHealth);
        this.updateHealthBar();
    }

    private updateHealthBar(): void {
        const percentage = this.currentHealth / this.maxHealth;

        this.healthBar.clear();
        this.healthBar.rect(0, 0, this.BAR_WIDTH * percentage, this.BAR_HEIGHT);
        this.healthBar.fill(0xFF0000); // Red color for health
    }

    public hide(): void {
        this.visible = false;
    }
}
