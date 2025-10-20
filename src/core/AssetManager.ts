import * as PIXI from 'pixi.js';
import { imageAssets } from '../generated/AssetBundle';

export class AssetManager {
    public static async init(): Promise<void> {
        const assets = imageAssets.map(asset => ({ alias: asset.alias, src: asset.src }));
        PIXI.Assets.addBundle('game-assets', assets);
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
