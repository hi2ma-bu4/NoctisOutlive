import * as PIXI from 'pixi.js';

export class Item extends PIXI.Sprite {
    constructor(texture: PIXI.Texture) {
        super(texture);
        this.anchor.set(0.5);
    }

    public onPickup() {
        // Logic when item is picked up
    }
}
