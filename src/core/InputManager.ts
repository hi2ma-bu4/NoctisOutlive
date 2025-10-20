export class InputManager {
    private static keys: { [key: string]: boolean } = {};

    public static init() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
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
}
