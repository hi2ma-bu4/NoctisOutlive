import * as PIXI from 'pixi.js';

export class Projectile extends PIXI.Sprite {
    public id: number;
    public velocity: PIXI.Point;
    public damage: number;

    constructor(texture: PIXI.Texture, id: number, damage: number, speed: number, direction: PIXI.Point) {
        super(texture);
        this.id = id;
        this.anchor.set(0.5);
        this.damage = damage;

        this.velocity = new PIXI.Point(direction.x * speed, direction.y * speed);
    }

    public update(delta: number) {
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
    }
}
