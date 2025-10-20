import * as PIXI from 'pixi.js';

export class Enemy extends PIXI.Sprite {
    public id: number;
    private speed: number = 2;
    public health: number = 1;

    constructor(texture: PIXI.Texture, id: number) {
        super(texture);
        this.id = id;
        this.anchor.set(0.5);
    }

    public update(delta: number, playerPosition: PIXI.Point) {
        const dx = playerPosition.x - this.x;
        const dy = playerPosition.y - this.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > 0) {
            const normalizedDx = dx / length;
            const normalizedDy = dy / length;

            this.x += normalizedDx * this.speed * delta;
            this.y += normalizedDy * this.speed * delta;
        }
    }

    public takeDamage(amount: number): void {
        this.health -= amount;
    }

    public isDead(): boolean {
        return this.health <= 0;
    }
}
