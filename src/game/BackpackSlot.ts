// src/game/BackpackSlot.ts

import * as PIXI from 'pixi.js';
import { SLOT_SIZE } from './Item';

export class BackpackSlot extends PIXI.Graphics {
    public readonly gridX: number;
    public readonly gridY: number;

    constructor(x: number, y: number) {
        super();
        this.gridX = x;
        this.gridY = y;
        this.position.set(x * SLOT_SIZE, y * SLOT_SIZE);
        this.draw();
    }

    private draw(): void {
        this.rect(0, 0, SLOT_SIZE, SLOT_SIZE);
        this.fill(0x000000, 0.5);
        this.stroke({ width: 1, color: 0xFFFFFF, alpha: 0.3 });
    }
}
