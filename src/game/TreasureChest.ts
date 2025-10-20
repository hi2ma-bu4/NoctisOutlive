import * as PIXI from 'pixi.js';

export class TreasureChest extends PIXI.Sprite {
    constructor(texture: PIXI.Texture) {
        super(texture);
        this.anchor.set(0.5);
    }

    public onPickup() {
        console.log("Opening treasure chest!");
        // Logic to open the loot box UI will go here
        this.destroy();
    }
}
