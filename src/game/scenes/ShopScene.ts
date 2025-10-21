// src/game/scenes/ShopScene.ts

import * as PIXI from 'pixi.js';
import { IScene } from '../../core/IScene';
import { SceneManager } from '../../core/SceneManager';
import { StageSelectScene } from './StageSelectScene';
import { PlayerData } from '../../core/PlayerData';
import { itemDatabase } from '../data/Items';
import { ItemChoice } from '../ui/ItemChoice'; // Re-using this for display
import { ItemData } from '../data/ItemData';

export class ShopScene implements IScene {
    public container: PIXI.Container;
    private playerData: PlayerData;
    private moneyText: PIXI.Text;

    private readonly shopInventory: { item: ItemData, price: number }[] = [];

    constructor() {
        this.container = new PIXI.Container();
        this.playerData = PlayerData.getInstance();

        // Populate shop with a few items from the database
        const itemsToSell = ['health_boost', 'damage_boost', 'backpack_expansion_h', 'backpack_expansion_v'];
        itemsToSell.forEach(id => {
            const item = itemDatabase.find(i => i.id === id);
            if (item) {
                // Assign a price based on rarity or a fixed map
                let price = 10;
                if (item.rarity === 'uncommon') price = 25;
                if (item.rarity === 'rare') price = 50;
                this.shopInventory.push({ item, price });
            }
        });
    }

    public init(): void {
        this.setupUI();
    }

    private setupUI(): void {
        const screen = { width: 1280, height: 720 }; // Assuming fixed screen size for now

        const title = new PIXI.Text('Shop', { fontSize: 48, fill: 0xFFFF00, fontWeight: 'bold' });
        title.anchor.set(0.5);
        title.x = screen.width / 2;
        title.y = 80;
        this.container.addChild(title);

        this.moneyText = new PIXI.Text(`Money: ${this.playerData.money} G`, { fontSize: 32, fill: 0xFFD700 });
        this.moneyText.anchor.set(1, 0);
        this.moneyText.x = screen.width - 40;
        this.moneyText.y = 40;
        this.container.addChild(this.moneyText);

        // Display shop items
        this.renderShopItems(screen);

        const backButton = new PIXI.Text('Back to Stage Select', { fontSize: 24, fill: 0xFFFFFF });
        backButton.anchor.set(0.5);
        backButton.x = screen.width / 2;
        backButton.y = screen.height - 60;
        backButton.interactive = true;
        backButton.cursor = 'pointer';
        backButton.on('pointertap', () => SceneManager.changeScene(new StageSelectScene()));
        this.container.addChild(backButton);
    }

    private renderShopItems(screen: { width: number, height: number }): void {
        const itemWidth = 200; // From ItemChoice
        const spacing = 40;
        const totalWidth = (itemWidth * this.shopInventory.length) + (spacing * (this.shopInventory.length - 1));
        const startX = (screen.width - totalWidth) / 2;

        this.shopInventory.forEach((shopItem, index) => {
            const itemCard = new ItemChoice(shopItem.item);
            itemCard.x = startX + index * (itemWidth + spacing);
            itemCard.y = (screen.height - itemCard.height) / 2 - 50;

            const priceText = new PIXI.Text(`${shopItem.price} G`, { fontSize: 24, fill: 0xFFD700, fontWeight: 'bold' });
            priceText.anchor.set(0.5);
            priceText.x = itemCard.x + itemCard.width / 2;
            priceText.y = itemCard.y + itemCard.height + 30;

            itemCard.on('pointertap', () => this.purchaseItem(shopItem));

            this.container.addChild(itemCard, priceText);
        });
    }

    private purchaseItem(shopItem: { item: ItemData, price: number }): void {
        if (this.playerData.money >= shopItem.price) {
            if (this.playerData.backpack.addItem(shopItem.item)) {
                this.playerData.money -= shopItem.price;
                this.updateMoneyDisplay();
                console.log(`Purchased ${shopItem.item.name}`);
                // Optional: add a success visual/sound effect
            } else {
                console.log("Backpack is full!");
                // Optional: add a "backpack full" visual/sound effect
            }
        } else {
            console.log("Not enough money!");
            // Optional: add a "not enough money" visual/sound effect
        }
    }

    private updateMoneyDisplay(): void {
        this.moneyText.text = `Money: ${this.playerData.money} G`;
    }

    public update(delta: PIXI.Ticker): void {}

    public destroy(): void {
        this.container.destroy({ children: true });
    }
}
