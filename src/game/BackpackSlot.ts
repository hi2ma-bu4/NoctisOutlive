import * as PIXI from 'pixi.js';
import { Item } from './Item';

export class BackpackSlot extends PIXI.Container {
    private item: Item | null = null;
    private background: PIXI.Graphics;
    public readonly size: number = 64; // Slot size in pixels

    constructor(x: number, y: number) {
        super();
        this.position.set(x * this.size, y * this.size);

        this.background = new PIXI.Graphics();
        this.background.beginFill(0x808080);
        this.background.drawRect(0, 0, this.size, this.size);
        this.background.endFill();
        this.addChild(this.background);
    }

    public getItem(): Item | null {
        return this.item;
    }

    public setItem(item: Item): boolean {
        if (!this.item) {
            this.item = item;
            item.width = this.size;
            item.height = this.size;
            this.addChild(item);
            return true;
        }
        return false;
    }

    public removeItem(): Item | null {
        if (this.item) {
            const removedItem = this.item;
            this.removeChild(this.item);
            this.item = null;
            return removedItem;
        }
        return null;
    }

    public isEmpty(): boolean {
        return this.item === null;
    }
}
