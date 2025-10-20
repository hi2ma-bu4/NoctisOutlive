import * as PIXI from 'pixi.js';

export class ExperienceOrb extends PIXI.Sprite {
    public value: number;

    constructor(texture: PIXI.Texture, value: number = 1) {
        super(texture);
        this.anchor.set(0.5);
        this.value = value;
    }

    public onPickup() {
        console.log(`Picked up ${this.value} experience!`);
        this.destroy();
    }
}
