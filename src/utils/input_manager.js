class InputManager {
    constructor() {
        this.pressedKeys = {};
        this.justPressedKeys = {};

        window.addEventListener('keydown', (e) => {
            if (!this.pressedKeys[e.code]) {
                this.justPressedKeys[e.code] = true;
            }
            this.pressedKeys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.pressedKeys[e.code] = false;
        });
    }

    update() {
        this.justPressedKeys = {};
    }

    keyJustPressed(key) {
        return this.justPressedKeys[key] ?? false;
    }

    keyPressed(key) {
        return this.pressedKeys[key] ?? false;
    }
}

export const inputManager = new InputManager();