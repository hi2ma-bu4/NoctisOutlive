// src/game/ui/BackpackScreen.ts
import * as PIXI from 'pixi.js';
import { Backpack } from '../Backpack';
import { Item, SLOT_SIZE } from '../Item';
import { SoundManager } from '../../core/SoundManager';
import { InputManager } from '../../core/InputManager';

export class BackpackScreen extends PIXI.Container {
    private backpack: Backpack;
    private onClose: () => void;

    private draggedItem: Item | null = null;
    private dragOffset = new PIXI.Point();

    constructor(backpack: Backpack, onClose: () => void) {
        super();
        this.backpack = backpack;
        this.onClose = onClose;
        this.name = 'BackpackScreen';

        this.interactive = true;
        this.setupUI();
        this.setupDragEvents();
    }

    private setupUI(): void {
        const screen = (this.parent as any)?.renderer.screen || { width: 1280, height: 720 };

        const overlay = new PIXI.Graphics();
        overlay.rect(0, 0, screen.width, screen.height);
        overlay.fill({ color: 0x000000, alpha: 0.85 });
        overlay.interactive = true;
        this.addChild(overlay);

        const title = new PIXI.Text('Backpack', { fontSize: 48, fill: 0xFFFFFF, fontWeight: 'bold' });
        title.anchor.set(0.5);
        title.x = screen.width / 2;
        title.y = 80;
        this.addChild(title);

        // Center the backpack on the screen
        this.backpack.x = (screen.width - this.backpack.width) / 2;
        this.backpack.y = (screen.height - this.backpack.height) / 2;
        this.addChild(this.backpack);

        const closeButton = new PIXI.Text('Close [B]', { fontSize: 24, fill: 0xFFD700 });
        closeButton.anchor.set(0.5);
        closeButton.x = screen.width / 2;
        closeButton.y = screen.height - 80;
        closeButton.interactive = true;
        closeButton.on('pointertap', () => this.close());
        this.addChild(closeButton);
    }

    private setupDragEvents(): void {
        this.backpack.itemContainer.interactive = true;
        this.backpack.itemContainer.on('pointerdown', this.onDragStart, this);
        this.on('pointerup', this.onDragEnd, this);
        this.on('pointerupoutside', this.onDragEnd, this);
        this.on('pointermove', this.onDragMove, this);
    }

    private onDragStart(event: PIXI.FederatedPointerEvent): void {
        const item = event.target as Item;
        if (item && item instanceof Item) {
            this.draggedItem = item;

            // Bring item to the top
            this.backpack.itemContainer.addChild(this.draggedItem);

            const localPos = event.getLocalPosition(this.draggedItem);
            this.dragOffset.set(localPos.x, localPos.y);

            this.backpack.unplaceItem(this.draggedItem);
            SoundManager.playSfx('sfx_item_pickup', 0.8);

            // Handle item rotation on right-click
            if (event.button === 2) { // Right mouse button
                this.backpack.tryToRotateItem(this.draggedItem);
                SoundManager.playSfx('sfx_item_rotate');
            }
        }
    }

    private onDragMove(event: PIXI.FederatedPointerEvent): void {
        if (this.draggedItem) {
            const newPos = event.getLocalPosition(this.backpack.itemContainer);
            this.draggedItem.x = newPos.x - this.dragOffset.x;
            this.draggedItem.y = newPos.y - this.dragOffset.y;
        }
    }

    private onDragEnd(event: PIXI.FederatedPointerEvent): void {
        if (!this.draggedItem) return;

        const localPos = event.getLocalPosition(this.backpack);
        const gridX = Math.round((localPos.x - this.draggedItem.width / 2) / SLOT_SIZE);
        const gridY = Math.round((localPos.y - this.draggedItem.height / 2) / SLOT_SIZE);

        if (this.backpack.isSpaceAvailable(gridX, gridY, this.draggedItem.data.width, this.draggedItem.data.height)) {
            this.backpack.placeItem(this.draggedItem, gridX, gridY);
            SoundManager.playSfx('sfx_item_drop', 0.8);
        } else {
            // If no valid spot, add it back to the first available spot
            const pos = this.backpack.findEmptySpace(this.draggedItem.data.width, this.draggedItem.data.height);
            if(pos) {
                this.backpack.placeItem(this.draggedItem, pos.x, pos.y);
            } else {
                // This case should be rare, but as a fallback, we remove the item
                 this.backpack.removeItem(this.draggedItem);
                 console.error("No space to return dragged item. Item removed.");
            }
            SoundManager.playSfx('sfx_error', 0.7);
        }

        this.draggedItem = null;
    }

    public close(): void {
        // Before closing, move the backpack back to its original parent (the main UI container)
        UIManager.container.addChild(this.backpack);
        this.onClose();
        this.destroy();
    }
}
