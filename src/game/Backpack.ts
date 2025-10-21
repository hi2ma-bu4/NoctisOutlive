// src/game/Backpack.ts

import * as PIXI from 'pixi.js';
import { BackpackSlot } from './BackpackSlot';
import { Item, SLOT_SIZE } from './Item';
import { ItemData } from './data/ItemData';

export class Backpack extends PIXI.Container {
    private slots: BackpackSlot[][] = [];
    private items: Item[] = [];
    private grid: (Item | null)[][] = []; // Logical grid representing occupied slots
    private rows: number;
    private cols: number;

    private background: PIXI.Graphics;
    private itemContainer: PIXI.Container;

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
        // Clear existing slots and logical grid
        this.slots.forEach(row => row.forEach(slot => slot.destroy()));
        this.slots = [];
        this.grid = [];

        for (let y = 0; y < this.rows; y++) {
            this.slots[y] = [];
            this.grid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                const slot = new BackpackSlot(x, y);
                this.slots[y][x] = slot;
                this.addChildAt(slot, 1); // Add behind items
                this.grid[y][x] = null;
            }
        }
        this.redrawBackground();
    }

    private redrawBackground(): void {
        this.background.clear();
        this.background.rect(0, 0, this.cols * SLOT_SIZE, this.rows * SLOT_SIZE);
        this.background.fill(0x333333, 0.8);
    }

    public expandGrid(addRows: number, addCols: number): void {
        this.rows += addRows;
        this.cols += addCols;
        this.createGrid();

        // Re-place existing items into the new grid
        const oldItems = [...this.items];
        this.items = [];
        this.itemContainer.removeChildren();

        oldItems.forEach(item => {
            this.addItem(item.data); // This will find a new spot
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

    private findEmptySpace(width: number, height: number): { x: number, y: number } | null {
        for (let y = 0; y <= this.rows - height; y++) {
            for (let x = 0; x <= this.cols - width; x++) {
                if (this.isSpaceAvailable(x, y, width, height)) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    private isSpaceAvailable(startX: number, startY: number, width: number, height: number): boolean {
        for (let y = startY; y < startY + height; y++) {
            for (let x = startX; x < startX + width; x++) {
                if (this.grid[y][x] !== null) {
                    return false;
                }
            }
        }
        return true;
    }

    private placeItem(item: Item, gridX: number, gridY: number): void {
        item.gridX = gridX;
        item.gridY = gridY;

        // Mark grid cells as occupied
        for (let y = gridY; y < gridY + item.data.height; y++) {
            for (let x = gridX; x < gridX + item.data.width; x++) {
                this.grid[y][x] = item;
            }
        }

        // Position the item visually
        item.position.set(
            gridX * SLOT_SIZE + (item.width / 2),
            gridY * SLOT_SIZE + (item.height / 2)
        );

        this.items.push(item);
        this.itemContainer.addChild(item);
    }

    public getItems(): Item[] {
        return this.items;
    }
}
