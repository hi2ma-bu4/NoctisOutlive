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
        this.renderSellItems(screen);

        const backButton = new PIXI.Text('Back to Stage Select', { fontSize: 24, fill: 0xFFFFFF });
        backButton.anchor.set(0.5);
        backButton.x = screen.width / 2;
        backButton.y = screen.height - 60;
        backButton.interactive = true;
        backButton.cursor = 'pointer';
        backButton.on('pointertap', () => SceneManager.changeScene('stage_select'));
        this.container.addChild(backButton);
    }

    private renderShopItems(screen: { width: number, height: number }): void {
        const shopTitle = new PIXI.Text('For Sale', { fontSize: 32, fill: 0xFFFFFF });
        shopTitle.anchor.set(0.5);
        shopTitle.x = screen.width / 4;
        shopTitle.y = 150;
        this.container.addChild(shopTitle);

        const shopPanel = new PIXI.Graphics().rect(50, 180, screen.width / 2 - 100, screen.height - 300).fill({color: 0x000000, alpha: 0.5});
        this.container.addChild(shopPanel);

        let shopX = 100;
        let shopY = 200;

        this.shopInventory.forEach((shopItem) => {
            const itemCard = new ItemChoice(shopItem.item);
            itemCard.position.set(shopX, shopY);

            const priceText = new PIXI.Text(`Buy: ${shopItem.price} G`, { fontSize: 20, fill: 0xFFD700 });
            priceText.anchor.set(0.5);
            priceText.position.set(shopX + itemCard.width / 2, shopY + itemCard.height + 20);

            itemCard.on('pointertap', () => this.purchaseItem(shopItem));
            this.container.addChild(itemCard, priceText);

            shopX += itemCard.width + 40;
            if (shopX > screen.width / 2 - 150) {
                shopX = 100;
                shopY += itemCard.height + 60;
            }
        });
    }

    private renderSellItems(screen: { width: number, height: number }): void {
        const sellTitle = new PIXI.Text('Your Items', { fontSize: 32, fill: 0xFFFFFF });
        sellTitle.anchor.set(0.5);
        sellTitle.x = screen.width * 3 / 4;
        sellTitle.y = 150;
        this.container.addChild(sellTitle);

        const sellPanel = new PIXI.Graphics().rect(screen.width / 2 + 50, 180, screen.width / 2 - 100, screen.height - 300).fill({color: 0x000000, alpha: 0.5});
        this.container.addChild(sellPanel);

        let sellX = screen.width / 2 + 100;
        let sellY = 200;

        this.playerData.backpack.getItems().forEach(item => {
            const itemCard = new ItemChoice(item.data);
            itemCard.position.set(sellX, sellY);

            const sellPrice = this.getSellPrice(item.data);
            const priceText = new PIXI.Text(`Sell: ${sellPrice} G`, { fontSize: 20, fill: 0x00FF00 });
            priceText.anchor.set(0.5);
            priceText.position.set(sellX + itemCard.width / 2, sellY + itemCard.height + 20);

            itemCard.on('pointertap', () => this.sellItem(item, sellPrice));
            this.container.addChild(itemCard, priceText);

            sellX += itemCard.width + 40;
            if (sellX > screen.width - 150) {
                sellX = screen.width / 2 + 100;
                sellY += itemCard.height + 60;
            }
        });
    }

    private getSellPrice(item: ItemData): number {
        const shopItem = this.shopInventory.find(si => si.item.id === item.id);
        return Math.floor((shopItem ? shopItem.price : 10) / 2);
    }

    private purchaseItem(shopItem: { item: ItemData, price: number }): void {
        if (this.playerData.money >= shopItem.price) {
            if (this.playerData.backpack.addItem(shopItem.item)) {
                this.playerData.money -= shopItem.price;
                this.showFeedback(`Purchased ${shopItem.item.name}!`, 0x00FF00);
                this.refreshUI();
            } else {
                this.showFeedback("Backpack is full!", 0xFF0000);
            }
        } else {
            this.showFeedback("Not enough money!", 0xFF0000);
        }
    }

    private sellItem(item: import('../Item').Item, sellPrice: number): void {
        this.playerData.backpack.removeItem(item);
        this.playerData.money += sellPrice;
        this.showFeedback(`Sold ${item.data.name}!`, 0x00FF00);
        this.refreshUI();
    }

    private refreshUI(): void {
        // Simple refresh: clear and re-render everything
        this.container.removeChildren();
        this.setupUI();
    }

    private showFeedback(message: string, color: number): void {
        const feedbackText = new PIXI.Text(message, { fontSize: 28, fill: color, stroke: 0x000000, strokeThickness: 4 });
        feedbackText.anchor.set(0.5);
        feedbackText.x = this.container.width / 2;
        feedbackText.y = this.container.height / 2;
        this.container.addChild(feedbackText);

        // Fade out and remove
        let elapsed = 0;
        const duration = 1500; // 1.5 seconds
        const ticker = (delta: any) => {
            elapsed += delta.deltaTime * 16.67;
            feedbackText.alpha = 1 - (elapsed / duration);
            if (elapsed >= duration) {
                PIXI.Ticker.shared.remove(ticker);
                feedbackText.destroy();
            }
        };
        PIXI.Ticker.shared.add(ticker);
    }

    private updateMoneyDisplay(): void {
        this.moneyText.text = `Money: ${this.playerData.money} G`;
    }

    public update(delta: PIXI.Ticker): void {}

    public destroy(): void {
        this.container.destroy({ children: true });
    }
}
