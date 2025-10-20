import * as PIXI from 'pixi.js';

export interface IScene {
    init(): void;
    update(delta: PIXI.Ticker): void;
    destroy(): void;
    container: PIXI.Container;
}
