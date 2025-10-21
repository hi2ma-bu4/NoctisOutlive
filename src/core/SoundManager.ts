// src/core/SoundManager.ts

import { sound, Sound } from '@pixi/sound';
import { soundAssets } from '../generated/AssetBundle';

enum SoundType {
    SFX,
    MUSIC,
}

export class SoundManager {
    private static masterVolume: number = 1.0;
    private static sfxVolume: number = 1.0;
    private static musicVolume: number = 0.7;
    private static soundTypes: Map<string, SoundType> = new Map();
    private static currentMusic: Sound | null = null;

    public static async init(): Promise<void> {
        const soundMap: Record<string, string> = {};
        for (const soundInfo of soundAssets) {
            soundMap[soundInfo.alias] = soundInfo.src;
            // Classify sounds based on a naming convention
            if (soundInfo.alias.startsWith('music_')) {
                this.soundTypes.set(soundInfo.alias, SoundType.MUSIC);
            } else {
                this.soundTypes.set(soundInfo.alias, SoundType.SFX);
            }
        }
        await sound.add(soundMap);
    }

    private static getVolume(alias: string): number {
        const type = this.soundTypes.get(alias);
        const categoryVolume = type === SoundType.MUSIC ? this.musicVolume : this.sfxVolume;
        return this.masterVolume * categoryVolume;
    }

    public static playMusic(alias: string): void {
        if (this.currentMusic) {
            this.currentMusic.stop();
        }
        if (sound.exists(alias)) {
            const music = sound.play(alias, {
                loop: true,
                volume: this.getVolume(alias)
            });
            this.currentMusic = music as Sound;
        } else {
            console.warn(`Music with alias '${alias}' not found.`);
        }
    }

    public static playSfx(alias: string, volumeScale: number = 1.0): void {
        if (sound.exists(alias)) {
            sound.play(alias, {
                volume: this.getVolume(alias) * volumeScale,
                loop: false
            });
        } else {
            console.warn(`SFX with alias '${alias}' not found.`);
        }
    }

    public static stop(alias: string): void {
        if (sound.exists(alias)) {
            sound.stop(alias);
        }
    }

    public static setMasterVolume(volume: number): void {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        // Update current music volume
        if (this.currentMusic && this.currentMusic.isPlaying) {
            const alias = Object.keys(sound.find(this.currentMusic)).pop();
            if(alias) {
                this.currentMusic.volume = this.getVolume(alias);
            }
        }
    }

    public static setSfxVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    public static setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.setMasterVolume(this.masterVolume); // Re-apply master volume to update music
    }
}
