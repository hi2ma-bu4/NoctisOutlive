import * as PIXI from 'pixi.js';

export class AssetManager {
    private static bundles: { name: string, assets: { alias: string, src: string }[] }[] = [
        {
            name: 'game-assets',
            assets: [
                { alias: 'player', src: 'assets/images/player.png' },
                // { alias: 'enemy', src: 'assets/images/enemy.png' },
            ],
        },
    ];

    public static async init(): Promise<void> {
        for (const bundle of this.bundles) {
            PIXI.Assets.addBundle(bundle.name, bundle.assets);
        }
    }

    public static async loadBundle(bundleName: string): Promise<Record<string, PIXI.Texture>> {
        const assets = await PIXI.Assets.loadBundle(bundleName);
        const textures: Record<string, PIXI.Texture> = {};
        for (const key in assets) {
            textures[key] = assets[key];
        }
        return textures;
    }

    public static getTexture(alias: string): PIXI.Texture {
        return PIXI.Assets.get(alias);
    }
}
