import { sound } from '@pixi/sound';

export class SoundManager {
    private static sounds: { alias: string, src: string }[] = [
        { alias: 'test_sound', src: 'assets/sounds/test_sound.wav' },
        // { alias: 'shot', src: 'assets/sounds/shot.wav' },
        // { alias: 'explosion', src: 'assets/sounds/explosion.wav' },
    ];

    public static async init(): Promise<void> {
        const soundMap: Record<string, string> = {};
        for (const soundInfo of this.sounds) {
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
