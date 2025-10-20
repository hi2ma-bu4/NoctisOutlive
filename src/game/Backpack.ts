import * as PIXI from 'pixi.js';
import { BackpackSlot } from './BackpackSlot';
import { Item } from './Item';

export class Backpack extends PIXI.Container {
    private slots: BackpackSlot[][] = [];
    private rows: number;
    private cols: number;

    constructor(rows: number, cols: number) {
        super();
        this.rows = rows;
        this.cols = cols;

        for (let y = 0; y < rows; y++) {
            this.slots[y] = [];
            for (let x = 0; x < cols; x++) {
                const slot = new BackpackSlot(x, y);
                this.slots[y][x] = slot;
                this.addChild(slot);
            }
        }
    }

    public addItem(item: Item): boolean {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.slots[y][x].setItem(item)) {
                    return true;
                }
            }
        }
        return false; // Backpack is full
    }

    // You can add more methods like removeItem, findItem, etc. here
}
