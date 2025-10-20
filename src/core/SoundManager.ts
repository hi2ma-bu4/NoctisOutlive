import { sound } from '@pixi/sound';
import { soundAssets } from '../generated/AssetBundle';

export class SoundManager {
    public static async init(): Promise<void> {
        const soundMap: Record<string, string> = {};
        for (const soundInfo of soundAssets) {
            soundMap[soundInfo.alias] = soundInfo.src;
        }
        sound.add(soundMap);
    }

    public static play(alias: string, loop: boolean = false): void {
        if (sound.exists(alias)) {
            sound.play(alias, { loop });
        } else {
            console.warn(`Sound with alias '${alias}' not found.`);
        }
    }

    public static stop(alias: string): void {
        if (sound.exists(alias)) {
            sound.stop(alias);
        }
    }

    public static setVolume(alias: string, volume: number): void {
        if (sound.exists(alias)) {
            sound.volume(alias, volume);
        }
    }
}
