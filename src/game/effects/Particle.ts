import * as PIXI from 'pixi.js';

export class Particle extends PIXI.Sprite {
    private velocity: PIXI.Point;
    private lifetime: number;
    private decay: number;

    constructor(texture: PIXI.Texture, position: PIXI.Point) {
        super(texture);
        this.anchor.set(0.5);
        this.position.copyFrom(position);

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.velocity = new PIXI.Point(Math.cos(angle) * speed, Math.sin(angle) * speed);

        this.lifetime = Math.random() * 0.5 + 0.2; // in seconds
        this.scale.set(Math.random() * 0.5 + 0.2);
        this.alpha = 1;
        this.decay = 0.05;
    }

    public update(delta: number) {
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;

        this.lifetime -= delta / 60; // Assuming 60 FPS
        this.alpha -= this.decay;

        if (this.lifetime <= 0 || this.alpha <= 0) {
            this.destroy();
        }
    }
}
