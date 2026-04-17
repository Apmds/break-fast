import { inputManager } from "./input_manager.js";
import * as THREE from 'three';
import Player from './player.js';
import City from "../city/city.js";

class GameManager {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(-2, 4, -160);
        this.camera.lookAt(0, 10, 0);

        this.scene = new City(this.camera, this.player);
        this.scene.setAsCurrent();

        this.player = new Player(this.camera, this.scene.domElement, this.scene.physicsWorld, this.scene.scene);
        this.scene.setPlayer(this.player);

        this.clock = new THREE.Timer();

        window.addEventListener('resize', () => {
            // Update scene
            this.scene.handleResize();
        });
    }

    frameUpdate() {
        this.scene.begin();
        this.update();
        this.render();
        this.scene.end();
    }

    update() {
        const delta = this.clock.getDelta();

        this.player.update(delta);
        this.scene.update(delta);
        this.clock.update();
        inputManager.update();
    }

    render() {
        this.scene.render();
    }
}

export default GameManager;