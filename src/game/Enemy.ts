import * as PIXI from 'pixi.js';

export class Enemy extends PIXI.Sprite {
    constructor(texture: PIXI.Texture) {
        super(texture);
        this.anchor.set(0.5);
    }

    public update(delta: number) {
        // Enemy movement and logic
    }
}
