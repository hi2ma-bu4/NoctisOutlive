// src/game/ui/BackpackScreen.ts

import * as PIXI from 'pixi.js';
import { Backpack } from '../Backpack';
import { InputManager, MouseButton } from '../../core/InputManager';
import { Item, SLOT_SIZE } from '../Item';
import { UIManager } from '../../core/UIManager';

export class BackpackScreen extends PIXI.Container {
    private backpack: Backpack;
    private onClose: () => void;
    private originalParent: PIXI.Container;
    private originalPosition: PIXI.Point;

    private draggedItem: Item | null = null;
    private dragOffset = new PIXI.Point();
    private placementIndicator: PIXI.Graphics;

    constructor(backpack: Backpack, onClose: () => void) {
        super();
        this.name = 'BackpackScreen';
        this.backpack = backpack;
        this.onClose = onClose;
        this.interactive = true;

        this.originalParent = this.backpack.parent;
        this.originalPosition = this.backpack.position.clone();

        this.placementIndicator = new PIXI.Graphics();
        this.backpack.addChild(this.placementIndicator);

        this.createUI();
        this.setupInteractions();
    }

    private createUI(): void {
        const screen = UIManager.getScreenSize();

        const overlay = new PIXI.Graphics();
        overlay.rect(0, 0, screen.width, screen.height);
        overlay.fill({ color: 0x000000, alpha: 0.85 });
        this.addChild(overlay);

        const title = new PIXI.Text('Organize Your Backpack', { fontSize: 48, fill: 0xFFFFFF });
        title.anchor.set(0.5);
        title.x = screen.width / 2;
        title.y = 80;
        this.addChild(title);

        this.backpack.position.set(
            (screen.width - this.backpack.width) / 2,
            (screen.height - this.backpack.height) / 2
        );
        this.addChild(this.backpack);

        const instruction = new PIXI.Text('Drag to move, Right-click to rotate, B to close', { fontSize: 24, fill: 0xCCCCCC });
        instruction.anchor.set(0.5);
        instruction.x = screen.width / 2;
        instruction.y = screen.height - 80;
        this.addChild(instruction);
    }

    private setupInteractions(): void {
        this.backpack.getItems().forEach(item => this.makeItemInteractive(item));

        // Add a ticker to handle drag updates
        PIXI.Ticker.shared.add(this.onDragUpdate, this);
    }

    private makeItemInteractive(item: Item): void {
        item.interactive = true;
        item.cursor = 'pointer';

        item.on('mousedown', (e) => this.onItemDragStart(e, item));
        item.on('mouseup', (e) => this.onItemDragEnd(e, item));
        item.on('rightdown', (e) => this.onItemRightClick(e, item));
    }

    private onItemDragStart(event: PIXI.FederatedMouseEvent, item: Item): void {
        if (event.button !== MouseButton.LEFT) return;

        this.draggedItem = item;
        const localPos = this.backpack.toLocal(event.global);
        this.dragOffset.set(localPos.x - item.x, localPos.y - item.y);

        // Bring item to top
        this.backpack.addChild(item);

        // Temporarily un-place from grid to allow placement checks
        this.backpack.unplaceItem(item);
    }

    private onItemDragEnd(event: PIXI.FederatedMouseEvent, item: Item): void {
        if (!this.draggedItem) return;

        const localPos = this.backpack.toLocal(InputManager.getMousePosition());
        const gridPos = this.getGridPosition(localPos);

        if (this.backpack.isSpaceAvailable(gridPos.x, gridPos.y, item.data.width, item.data.height)) {
            this.backpack.placeItem(item, gridPos.x, gridPos.y);
        } else {
            // If the target space is not available, find the first available space and place it there.
            const emptySpot = this.backpack.findEmptySpace(item.data.width, item.data.height);
            if (emptySpot) {
                this.backpack.placeItem(item, emptySpot.x, emptySpot.y);
            } else {
                // This is a critical error: the item was picked up, but there's no space left.
                // This shouldn't happen if the logic is correct.
                console.error("CRITICAL: No space to return dragged item to the backpack!");
                // As a last resort, we will just add it to the item container so it's not lost.
                this.backpack.itemContainer.addChild(item);
                this.backpack.items.push(item);
            }
        }

        this.draggedItem = null;
        this.placementIndicator.clear();
    }

    private onItemRightClick(event: PIXI.FederatedMouseEvent, item: Item): void {
        if (this.draggedItem) return; // Don't rotate while dragging

        this.backpack.tryToRotateItem(item);
    }

    private onDragUpdate(): void {
        if (!this.draggedItem) return;

        const mousePos = InputManager.getMousePosition();
        const localPos = this.backpack.toLocal(mousePos);

        this.draggedItem.x = localPos.x - this.dragOffset.x;
        this.draggedItem.y = localPos.y - this.dragOffset.y;

        this.updatePlacementIndicator();
    }

    private updatePlacementIndicator(): void {
        if (!this.draggedItem) return;

        const gridPos = this.getGridPosition(this.draggedItem.position);
        const isValid = this.backpack.isSpaceAvailable(gridPos.x, gridPos.y, this.draggedItem.data.width, this.draggedItem.data.height);

        this.placementIndicator.clear();
        this.placementIndicator.rect(
            gridPos.x * SLOT_SIZE,
            gridPos.y * SLOT_SIZE,
            this.draggedItem.data.width * SLOT_SIZE,
            this.draggedItem.data.height * SLOT_SIZE
        );
        this.placementIndicator.fill({ color: isValid ? 0x00FF00 : 0xFF0000, alpha: 0.5 });
    }

    private getGridPosition(localPoint: PIXI.Point): { x: number, y: number } {
        return {
            x: Math.round((localPoint.x - (this.draggedItem?.width ?? 0) / 2) / SLOT_SIZE),
            y: Math.round((localPoint.y - (this.draggedItem?.height ?? 0) / 2) / SLOT_SIZE)
        };
    }

    public close(): void {
        // Return backpack to its original state
        this.originalParent.addChild(this.backpack);
        this.backpack.position.copyFrom(this.originalPosition);

        // Cleanup
        PIXI.Ticker.shared.remove(this.onDragUpdate, this);
        this.onClose();
        this.destroy({ children: true });
    }
}
