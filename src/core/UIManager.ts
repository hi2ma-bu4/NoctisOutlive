import * as PIXI from 'pixi.js';

export class UIManager {
    public static container: PIXI.Container;
    private static app: PIXI.Application;

    public static init(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
    }

    public static update(delta: number) {
        // Update UI elements
    }
}
