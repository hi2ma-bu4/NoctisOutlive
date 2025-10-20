import * as PIXI from 'pixi.js';
import { ItemData } from '../data/ItemData';
import { AssetManager } from '../../core/AssetManager';

export class ItemChoice extends PIXI.Container {
    private background: PIXI.Graphics;
    public readonly itemData: ItemData;

    constructor(itemData: ItemData) {
        super();
        this.itemData = itemData;
        this.interactive = true;
        this.cursor = 'pointer';

        const width = 200;
        const height = 250;

        // Background
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x333333);
        this.background.lineStyle(2, 0xAAAAAA, 1);
        this.background.drawRoundedRect(0, 0, width, height, 10);
        this.background.endFill();
        this.addChild(this.background);

        // Item Icon
        const iconTexture = AssetManager.getTexture(itemData.textureAlias);
        if (iconTexture) {
            const icon = new PIXI.Sprite(iconTexture);
            icon.width = 128;
            icon.height = 128;
            icon.x = (width - icon.width) / 2;
            icon.y = 15;
            this.addChild(icon);
        }

        // Item Name
        const nameText = new PIXI.Text(itemData.name, { fontSize: 24, fill: 0xFFFFFF, wordWrap: true, wordWrapWidth: width - 20 });
        nameText.x = (width - nameText.width) / 2;
        nameText.y = 155;
        this.addChild(nameText);

        // Item Description
        const descriptionText = new PIXI.Text(itemData.description, { fontSize: 16, fill: 0xCCCCCC, wordWrap: true, wordWrapWidth: width - 20 });
        descriptionText.x = (width - descriptionText.width) / 2;
        descriptionText.y = 190;
        this.addChild(descriptionText);
    }
}
