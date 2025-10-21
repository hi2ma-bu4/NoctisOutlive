// src/game/ui/BackpackScreen.ts

import * as PIXI from 'pixi.js';
import { Backpack } from '../Backpack';

export class BackpackScreen extends PIXI.Container {
    private backpack: Backpack;
    private onClose: () => void;

    constructor(backpack: Backpack, onClose: () => void) {
        super();
        this.name = 'BackpackScreen'; // Set the name for lookup
        this.backpack = backpack;
        this.onClose = onClose;
        this.interactive = true;

        this.createUI();
    }

    private createUI(): void {
        const screen = (this.parent as any)?.renderer.screen || { width: 1280, height: 720 };

        // Background overlay
        const overlay = new PIXI.Graphics();
        overlay.rect(0, 0, screen.width, screen.height);
        overlay.fill({ color: 0x000000, alpha: 0.85 });
        overlay.on('pointertap', this.close.bind(this));
        overlay.interactive = true;
        this.addChild(overlay);

        // Title
        const title = new PIXI.Text('Backpack', { fontSize: 48, fill: 0xFFFFFF, fontWeight: 'bold' });
        title.anchor.set(0.5);
        title.x = screen.width / 2;
        title.y = 80;
        this.addChild(title);

        // Center the backpack display
        this.backpack.x = (screen.width - this.backpack.width) / 2;
        this.backpack.y = (screen.height - this.backpack.height) / 2;
        this.addChild(this.backpack);

        // Instruction Text
        const instruction = new PIXI.Text('Press B or click outside to close', { fontSize: 24, fill: 0xCCCCCC });
        instruction.anchor.set(0.5);
        instruction.x = screen.width / 2;
        instruction.y = screen.height - 80;
        this.addChild(instruction);
    }

    public close(): void {
        // We return the backpack to its original parent (the main UI container)
        // This is a bit of a hack. A better solution would be to have a dedicated UI manager
        // that handles where UI elements live. For now, this works.
        const originalParent = (this.parent as any)?.parent?.getChildByName("UIManagerContainer");
        if (originalParent) {
            originalParent.addChild(this.backpack);
            // Reposition it back to the corner
            const screen = (this.parent as any)?.renderer.screen;
            this.backpack.x = screen.width - this.backpack.width - 20;
            this.backpack.y = screen.height - this.backpack.height - 20;
        }

        this.onClose();
        this.destroy();
    }
}
