// src/game/Backpack.ts

import * as PIXI from 'pixi.js';
import { BackpackSlot } from './BackpackSlot';
import { Item, SLOT_SIZE } from './Item';
import { ItemData } from './data/ItemData';

export class Backpack extends PIXI.Container {
    private slots: BackpackSlot[][] = [];
    public items: Item[] = [];
    private grid: (Item | null)[][] = []; // Logical grid representing occupied slots
    private rows: number;
    private cols: number;

    private background: PIXI.Graphics;
    public itemContainer: PIXI.Container;

    constructor(rows: number, cols: number) {
        super();
        this.rows = rows;
        this.cols = cols;

        this.background = new PIXI.Graphics();
        this.addChild(this.background);

        this.itemContainer = new PIXI.Container();
        this.addChild(this.itemContainer);

        this.createGrid();
    }

    private createGrid(): void {
        this.slots.forEach(row => row.forEach(slot => slot.destroy()));
        this.slots = [];
        this.grid = [];

        for (let y = 0; y < this.rows; y++) {
            this.slots[y] = [];
            this.grid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                const slot = new BackpackSlot(x, y);
                this.slots[y][x] = slot;
                this.addChildAt(slot, 1);
                this.grid[y][x] = null;
            }
        }
        this.redrawBackground();
    }

    private redrawBackground(): void {
        this.background.clear();
        this.background.rect(0, 0, this.cols * SLOT_SIZE, this.rows * SLOT_SIZE);
        this.background.fill({ color: 0x333333, alpha: 0.8 });
    }

    public expandGrid(addRows: number, addCols: number): void {
        this.rows += addRows;
        this.cols += addCols;
        this.createGrid();

        const oldItems = [...this.items];
        this.items = [];
        this.itemContainer.removeChildren();

        oldItems.forEach(item => {
            this.addItem(item.data);
        });
    }

    public addItem(itemData: ItemData): boolean {
        const newItem = new Item(itemData);
        const position = this.findEmptySpace(newItem.data.width, newItem.data.height);

        if (position) {
            this.placeItem(newItem, position.x, position.y);
            return true;
        }
        console.warn("Backpack is full. Cannot add item:", itemData.name);
        return false;
    }

    public findEmptySpace(width: number, height: number): { x: number, y: number } | null {
        for (let y = 0; y <= this.rows - height; y++) {
            for (let x = 0; x <= this.cols - width; x++) {
                if (this.isSpaceAvailable(x, y, width, height)) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    public isSpaceAvailable(startX: number, startY: number, width: number, height: number): boolean {
        if (startX < 0 || startY < 0 || startX + width > this.cols || startY + height > this.rows) {
            return false;
        }
        for (let y = startY; y < startY + height; y++) {
            for (let x = startX; x < startX + width; x++) {
                if (this.grid[y][x] !== null) {
                    return false;
                }
            }
        }
        return true;
    }

    public placeItem(item: Item, gridX: number, gridY: number): void {
        item.gridX = gridX;
        item.gridY = gridY;

        for (let y = gridY; y < gridY + item.data.height; y++) {
            for (let x = gridX; x < gridX + item.data.width; x++) {
                this.grid[y][x] = item;
            }
        }

        item.position.set(
            gridX * SLOT_SIZE + (item.width / 2),
            gridY * SLOT_SIZE + (item.height / 2)
        );

        const index = this.items.indexOf(item);
        if (index === -1) {
            this.items.push(item);
        }

        if (!item.parent) {
            this.itemContainer.addChild(item);
        }
    }

    public unplaceItem(itemToUnplace: Item): void {
        if (!itemToUnplace || itemToUnplace.gridX === -1) return;

        for (let y = itemToUnplace.gridY; y < itemToUnplace.gridY + itemToUnplace.data.height; y++) {
            for (let x = itemToUnplace.gridX; x < itemToUnplace.gridX + itemToUnplace.data.width; x++) {
                if (y < this.rows && x < this.cols && this.grid[y][x] === itemToUnplace) {
                    this.grid[y][x] = null;
                }
            }
        }

        const index = this.items.indexOf(itemToUnplace);
        if (index > -1) {
            this.items.splice(index, 1);
        }

        itemToUnplace.gridX = -1;
        itemToUnplace.gridY = -1;
    }

    public removeItem(itemToRemove: Item): void {
        this.unplaceItem(itemToRemove);
        this.itemContainer.removeChild(itemToRemove);
        if (!itemToRemove.destroyed) {
            itemToRemove.destroy();
        }
    }

    public tryToRotateItem(item: Item): boolean {
        const originalGridX = item.gridX;
        const originalGridY = item.gridY;

        if (originalGridX === -1 || originalGridY === -1) return false;

        this.unplaceItem(item);
        item.rotate();

        if (this.isSpaceAvailable(originalGridX, originalGridY, item.data.width, item.data.height)) {
            this.placeItem(item, originalGridX, originalGridY);
            return true;
        } else {
            item.rotate();
            this.placeItem(item, originalGridX, originalGridY);
            return false;
        }
    }

    public getItems(): Item[] {
        return this.items;
    }
}
