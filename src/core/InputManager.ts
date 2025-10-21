import * as PIXI from 'pixi.js';

export enum MouseButton {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
}

export class InputManager {
    private static keys: { [key: string]: boolean } = {};
    private static justPressed: { [key: string]: boolean } = {};
    private static mouseButtons: { [button: number]: boolean } = {};
    private static mousePosition = new PIXI.Point(0, 0);

    private static lastKeys: { [key: string]: boolean } = {};

    public static init() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));

        const gameCanvas = document.querySelector('canvas');
        if (gameCanvas) {
            gameCanvas.addEventListener('mousedown', this.onMouseDown.bind(this));
            gameCanvas.addEventListener('mouseup', this.onMouseUp.bind(this));
            gameCanvas.addEventListener('mousemove', this.onMouseMove.bind(this));
            gameCanvas.addEventListener('contextmenu', e => e.preventDefault()); // Prevent right-click menu
        }

        // Add a ticker to update "just pressed" states
        PIXI.Ticker.shared.add(this.update.bind(this));
    }

    private static onKeyDown(event: KeyboardEvent) {
        this.keys[event.code] = true;
    }

    private static onKeyUp(event: KeyboardEvent) {
        this.keys[event.code] = false;
    }

    public static isKeyDown(keyCode: string): boolean {
        return this.keys[keyCode] || false;
    }

    public static isKeyJustPressed(keyCode: string): boolean {
        return this.justPressed[keyCode] || false;
    }

    private static onMouseDown(event: MouseEvent) {
        this.mouseButtons[event.button] = true;
    }

    private static onMouseUp(event: MouseEvent) {
        this.mouseButtons[event.button] = false;
    }

    private static onMouseMove(event: MouseEvent) {
        this.mousePosition.set(event.clientX, event.clientY);
    }

    public static isMouseButtonDown(button: MouseButton): boolean {
        return this.mouseButtons[button] || false;
    }

    public static getMousePosition(): PIXI.Point {
        return this.mousePosition.clone();
    }

    private static update() {
        for (const key in this.keys) {
            this.justPressed[key] = this.keys[key] && !this.lastKeys[key];
            this.lastKeys[key] = this.keys[key];
        }
    }
}
