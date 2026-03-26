import * as THREE from 'three';

class GameManager {
    constructor() {
        this.pressedKeys = {};

        window.addEventListener('keydown', (e) => {
            this.pressedKeys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.pressedKeys[e.code] = false;
        });
    }

    update() {
        
    }

    keyPressed(key) {
        return this.pressedKeys[key];
    }
}

export const gameManager = new GameManager();